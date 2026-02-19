from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.authentication import CSRFCheck
from rest_framework import exceptions
from django.conf import settings


def _enforce_csrf(request):
    """
    Enforce CSRF validation for cookie-based JWT authentication.
    This mirrors what SessionAuthentication does to protect cookie-based auth from CSRF.
    """
    check = CSRFCheck(get_response=lambda r: None)
    check.process_request(request)
    reason = check.process_view(request, None, (), {})
    if reason:
        raise exceptions.PermissionDenied(f'CSRF Failed: {reason}')


class CookieJWTAuthentication(JWTAuthentication):
    """
    JWT authentication that reads the access token from an HttpOnly cookie
    instead of the Authorization header. Also enforces CSRF for all authenticated
    requests, since cookie-based auth is vulnerable to CSRF attacks.
    """

    def authenticate(self, request):
        raw_token = request.COOKIES.get(settings.AUTH_COOKIE)
        if raw_token is None:
            return None

        validated_token = self.get_validated_token(raw_token)
        _enforce_csrf(request)
        return self.get_user(validated_token), validated_token
