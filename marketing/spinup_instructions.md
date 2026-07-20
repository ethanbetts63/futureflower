# FutureFlower Marketing Pipeline Spin-Up Prompt

You are coordinating the podcast outreach pipeline. Work through the phases below in strict order, one phase at a time — never start a phase until the previous phase has fully completed. Tell the agents to summarise only any issues they have with their task. No issues no summaries. After launching an agent, wait silently until completion.

Run all commands from `C:\Users\ethan\coding\futureflower`.

**Agents in this pipeline run one at a time, never concurrently.** Every phase writes to a single shared file (`country_review.json` in Phase 2, `podcasts.jsonl` in Phase 3). Two agents editing the same file will silently lose each other's work. Do not parallelise to save time.

**Do not read `country_instructions.md` or `ai_instructions.md`. Just pass the paths on.**

If you inspect the data files with Python, set `PYTHONIOENCODING=utf-8` first. Podcast titles and descriptions contain non-ASCII characters and the default Windows codepage will crash on them.

---

## Dev Mode

If the user said to use `--dev`, you are in dev mode. Dev mode affects exactly one command:

- **Phase 4** — append `--dev` to the `upload` command so it targets `http://127.0.0.1:8000` instead of production

No other command takes `--dev`. `promote_outreach` is purely local, and `send_outreach` reads whichever inbox it is run against. Do not add the flag anywhere else — it will fail.

Dev mode requires the local Django server to already be running. If `upload --dev` fails to connect, say so rather than retrying against production.

If the user said nothing about `--dev`, do not mention it.

---

## Phase 1 — Scrape

Target: **50 scraped candidates** in `marketing/podcasts.jsonl`, unless the user named a different number.

This is a *scrape* target, not a finished-leads target. Phase 2 will discard most of these. Historically only about a third survive the country review, so 50 scraped yields roughly 15 Australian leads. **If the user asks for a number of Australian podcasts rather than a number to scrape, multiply by three and confirm the interpretation with them before starting.**

Count the entries already in `marketing/podcasts.jsonl` and scrape only the shortfall:

```powershell
python manage.py scrape_pods --batch <shortfall>
```

`--batch` is the number of qualifying entries to write, not a number of search terms or API results. The command keeps consuming search terms until it has written that many.

The scraper searches the iTunes AU store, but that only selects the store catalog — roughly four in five results will still be foreign podcasts. Phase 2 is what actually enforces the Australian filter. Do not try to judge podcasts yourself here.

Re-run the command if it stops short of the target. Stop and report to the user if either of these appears:

- `5 consecutive terms returned nothing` — repeatedly, meaning the search is drying up
- `All 676 terms exhausted` — the alphabet sweep is finished and needs new search terms

Once `podcasts.jsonl` holds roughly the target number of entries, proceed to Phase 2.

---

## Phase 2 — Country Review

Read `marketing/podcasts.jsonl` and collect the `podcast_name` and `feed_url` of every entry.

Then read `marketing/country_review.json` and drop from that collection any `feed_url` already recorded in one of its three lists. Those have been reviewed on a previous run and re-reviewing them wastes agent time. If nothing is left after this, skip straight to running `apply_country_review` below.

Split the remainder into batches of **15**. Then, one agent at a time:

- Give the agent its batch as an explicit list of `podcast_name` + `feed_url` pairs. Tell it this list is authoritative — it must review exactly these and nothing else, and must not read the rest of `podcasts.jsonl`.
- Give it the prompt at `C:\Users\ethan\coding\futureflower\marketing\country_instructions.md`.
- Tell it **not** to run `apply_country_review`. You run that once, after every batch is done.

Wait for each agent to finish before starting the next.

When all batches are complete, run:

```powershell
python manage.py apply_country_review
```

This drops the `not_aus` and `unsure` entries, leaving only Australian podcasts in the queue. If it warns that entries had no decision, an agent missed some — spin up one more agent for exactly those before continuing.

Report how many survived. Roughly one in three is normal.

- If **nothing** survived, stop and tell the user rather than proceeding with an empty queue.
- If **more than half** survived, the review agents may have been too lenient. Spot-check three of the `aus` calls yourself before starting Phase 3, and say what you found.

---

## Phase 3 — Intro Writing

Only the Australian podcasts remain in `marketing/podcasts.jsonl` now.

Split them into batches of **10** — or use a single agent if there are 10 or fewer. Then, one agent at a time:

- Give the agent its batch as an explicit list of `podcast_name` + `email` pairs. Tell it this list is authoritative — it must fill in exactly these entries and leave every other line in the file untouched, even though it will see them while editing. This matters: agents share this file, and one straying outside its batch will overwrite another's work.
- Give it the prompt at `C:\Users\ethan\coding\futureflower\marketing\ai_instructions.md`.
- Tell it **not** to run the scraper, and **not** to run `promote_outreach` or `upload` at the end. You handle those in Phase 4.

Wait for each agent to finish before starting the next.

This phase writes the actual email copy, so quality matters more than speed here. If an agent reports it could not write a natural intro for an entry — usually a thin or missing episode description — leave that entry's fields blank. `promote_outreach` skips unfilled entries, so it will simply stay in the queue.

---

## Phase 4 — Promote and Upload

Once Phase 3 is complete, verify the queue before uploading anything. Entries left deliberately blank by Phase 3 are fine and expected — `promote_outreach` skips them. What you are checking for is entries that are *partially* filled or obviously broken:

- A `subject` but no `custom_intro`, or the reverse
- A `custom_intro` that does not start with "I just listened to"
- Placeholder or template text that an agent left behind
- An email whose domain no longer resolves. Podcast feeds go stale and keep advertising dead domains. Check each one with `socket.gethostbyname()` on the part after the `@`, and drop any that fail — a hard bounce costs far more than a missed lead, because bounce rates on a cold-outreach Gmail account get the account throttled or suspended.

Fix or blank out anything suspect. **Upload is the last reversible step — once an entry reaches the server it is queued for a real cold email, and there is no delete endpoint.** Do not skip this check.

Then run:

```powershell
python manage.py promote_outreach
python manage.py upload
```

(Append `--dev` to the `upload` command if in dev mode.)

The first moves filled entries into `marketing/outbox/` as individual JSON files. The second pushes them to the server's `inbox/` and deletes the local copies as they succeed. Report the uploaded and failed counts.

---

## Phase 5 — Send

**Stop here. Do not send without the user's explicit go-ahead.**

This phase fires real cold emails from the dev Gmail account to real people. It cannot be undone. Report to the user how many entries are queued and waiting, and ask whether to send and how many.

Sending also runs **on the live server**, not locally — `send_outreach` reads from the server's `inbox/`, which is where Phase 4 just uploaded to. If you are not on the server, say so and hand off to the user rather than attempting it.

When the user has confirmed, and only then:

```powershell
python manage.py send_outreach --count <number the user gave>
```

Sent entries move to `contacted_podcasts.jsonl` automatically. The command waits 30 seconds between sends, so a large count takes a while — this is deliberate rate limiting, do not work around it.
