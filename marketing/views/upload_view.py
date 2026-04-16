import json
from pathlib import Path
from django.http import JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.conf import settings

INBOX_DIR = Path(__file__).resolve().parent.parent / "inbox"


@method_decorator(csrf_exempt, name='dispatch')
class UploadPodcastView(View):
    def post(self, request):
        api_key = request.headers.get('X-Internal-API-Key', '')
        expected = getattr(settings, 'INTERNAL_API_KEY', None)
        if not expected or api_key != expected:
            return JsonResponse({'error': 'Unauthorized'}, status=401)

        try:
            entry = json.loads(request.body)
        except (json.JSONDecodeError, ValueError):
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

        email = entry.get('email', '').strip()
        if not email:
            return JsonResponse({'error': 'Missing email field'}, status=400)

        INBOX_DIR.mkdir(exist_ok=True)
        dest = INBOX_DIR / f"{email}.json"
        dest.write_text(json.dumps(entry, ensure_ascii=False), encoding='utf-8')

        return JsonResponse({'status': 'ok', 'file': dest.name})
