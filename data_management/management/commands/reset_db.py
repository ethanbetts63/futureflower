# Local dev (default): drops every table, wipes and rebuilds migrations from the
# current models, then regenerates the data the app needs from committed sources
# (terms from HTML files, the admin user from a generator).
#
# Server (--server): pulls latest code and reuses the already-committed migrations
# (no makemigrations), then does the same regeneration. The server must never
# squash migrations — it applies whatever local dev already committed.
#
# There is nothing to restore from a backup here: everything the reset needs is
# generated from source, so unlike the podcast pipeline this command takes no
# archive. See generate.py for --terms / --admin_user.

import shutil
import subprocess
from pathlib import Path

from django.apps import apps
from django.conf import settings
from django.core.management import call_command
from django.core.management.base import BaseCommand, CommandError
from django.db import connection


class Command(BaseCommand):
    help = "Drop all tables, rebuild the schema, and regenerate baseline data."

    def add_arguments(self, parser):
        parser.add_argument(
            "--server",
            action="store_true",
            help="Server variant: pull code and reuse committed migrations instead "
                 "of squashing them locally.",
        )
        parser.add_argument(
            "--admin-password",
            required=True,
            help="Password for the regenerated admin user (see generate --admin_user).",
        )

    def handle(self, *args, **options):
        server = options["server"]
        base_dir = settings.BASE_DIR

        if server:
            self.stdout.write("Pulling latest app code...")
            self._run_git(["git", "pull"], cwd=base_dir)

        # Drop every table so migrate can recreate the schema from scratch.
        self.stdout.write("Dropping all tables...")
        with connection.cursor() as cursor:
            cursor.execute("SET FOREIGN_KEY_CHECKS = 0")
            for table in connection.introspection.table_names(cursor):
                cursor.execute(f"DROP TABLE IF EXISTS `{table}`")
                self.stdout.write(f"  Dropped: {table}")
            cursor.execute("SET FOREIGN_KEY_CHECKS = 1")

        if not server:
            # Local squash only. The server reuses whatever migrations are committed,
            # so it must never delete or regenerate them here.
            for migrations_dir in self._project_migration_dirs():
                for f in migrations_dir.glob("*.py"):
                    if f.name != "__init__.py":
                        f.unlink()
                        self.stdout.write(
                            f"Deleted migration: {f.relative_to(base_dir)}"
                        )

            for cache_dir in base_dir.rglob("__pycache__"):
                if "venv" in cache_dir.parts:
                    continue
                shutil.rmtree(cache_dir)
                self.stdout.write(f"Cleared cache: {cache_dir.relative_to(base_dir)}")

            self.stdout.write("\nRunning makemigrations...")
            call_command("makemigrations")

        self.stdout.write("\nRunning migrate...")
        call_command("migrate")

        self.stdout.write("\nGenerating terms and conditions...")
        call_command("generate", terms=True)

        self.stdout.write("\nCreating admin user...")
        call_command("generate", admin_user=options["admin_password"])

        self.stdout.write(self.style.SUCCESS("\nDatabase reset complete."))

    def _project_migration_dirs(self):
        """
        The migrations dir of every first-party app that has one. Derived from the
        app registry so a newly added or removed app is picked up automatically
        instead of drifting from a hardcoded list.

        "First-party" means the app lives under BASE_DIR but not inside the
        virtualenv — pip installs Django and third-party apps into
        venv/.../site-packages, which is under BASE_DIR here and would otherwise
        match, causing this to wipe Django's own contrib migrations.
        """
        base_dir = settings.BASE_DIR.resolve()
        for config in apps.get_app_configs():
            app_path = getattr(config, "path", None)
            if not app_path:
                continue
            resolved = Path(app_path).resolve()
            if "site-packages" in resolved.parts:
                continue
            if base_dir not in resolved.parents:
                continue
            migrations_dir = resolved / "migrations"
            if migrations_dir.is_dir():
                yield migrations_dir

    def _run_git(self, cmd, cwd):
        result = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True)
        if result.stdout.strip():
            self.stdout.write(result.stdout.strip())
        if result.returncode != 0:
            raise CommandError(result.stderr.strip() or f"Command failed: {' '.join(cmd)}")
