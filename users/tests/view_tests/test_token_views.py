import pytest
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken
from users.tests.factories.user_factory import UserFactory


@pytest.mark.django_db
class TestCookieTokenObtainPairView:
    """
    Tests for the login endpoint POST /api/token/.
    After a successful login, tokens must live in HttpOnly cookies — not in the
    response body where JavaScript could read them.
    """

    def setup_method(self):
        self.client = APIClient()
        self.url = '/api/token/'
        # UserFactory sets username to a random value; in the real app
        # RegisterSerializer always sets username=email, so we mirror that here.
        self.user = UserFactory()
        self.credentials = {'username': self.user.username, 'password': 'password'}

    def test_login_success_sets_access_token_cookie(self):
        response = self.client.post(
            self.url,
            self.credentials,
            format='json',
        )
        assert response.status_code == 200
        assert 'access_token' in response.cookies

    def test_login_access_token_cookie_is_httponly(self):
        response = self.client.post(
            self.url,
            self.credentials,
            format='json',
        )
        assert response.status_code == 200
        assert response.cookies['access_token']['httponly']

    def test_login_access_token_cookie_samesite_is_lax(self):
        response = self.client.post(
            self.url,
            self.credentials,
            format='json',
        )
        assert response.status_code == 200
        assert response.cookies['access_token']['samesite'] == 'Lax'

    def test_login_success_sets_refresh_token_cookie(self):
        response = self.client.post(
            self.url,
            self.credentials,
            format='json',
        )
        assert response.status_code == 200
        assert 'refresh_token' in response.cookies

    def test_login_refresh_token_cookie_is_httponly(self):
        response = self.client.post(
            self.url,
            self.credentials,
            format='json',
        )
        assert response.status_code == 200
        assert response.cookies['refresh_token']['httponly']

    def test_login_does_not_return_tokens_in_body(self):
        """
        Tokens must not appear in the JSON body. If they did, JavaScript (including
        any XSS payload) could read them directly from the response.
        """
        response = self.client.post(
            self.url,
            self.credentials,
            format='json',
        )
        assert response.status_code == 200
        assert 'access' not in response.data
        assert 'refresh' not in response.data

    def test_login_with_wrong_password_returns_401(self):
        response = self.client.post(
            self.url,
            {'username': self.user.username, 'password': 'wrongpassword'},
            format='json',
        )
        assert response.status_code == 401

    def test_login_failure_sets_no_auth_cookies(self):
        """
        A failed login must not set any auth cookies — even partial ones.
        """
        response = self.client.post(
            self.url,
            {'username': self.user.username, 'password': 'wrongpassword'},
            format='json',
        )
        assert 'access_token' not in response.cookies
        assert 'refresh_token' not in response.cookies

    def test_login_with_unknown_username_returns_401(self):
        response = self.client.post(
            self.url,
            {'username': 'doesnotexist', 'password': 'password'},
            format='json',
        )
        assert response.status_code == 401


@pytest.mark.django_db
class TestCookieTokenRefreshView:
    """
    Tests for POST /api/token/refresh/.
    The refresh token must be read from the HttpOnly cookie — the request body
    is empty. A new access token (and rotated refresh token) are issued as cookies.
    """

    def setup_method(self):
        self.client = APIClient()
        self.url = '/api/token/refresh/'
        self.user = UserFactory()

    def test_refresh_with_valid_cookie_returns_200(self):
        refresh = RefreshToken.for_user(self.user)
        self.client.cookies['refresh_token'] = str(refresh)

        response = self.client.post(self.url, format='json')

        assert response.status_code == 200

    def test_refresh_sets_new_access_token_cookie(self):
        refresh = RefreshToken.for_user(self.user)
        self.client.cookies['refresh_token'] = str(refresh)

        response = self.client.post(self.url, format='json')

        assert 'access_token' in response.cookies
        assert response.cookies['access_token']['httponly']

    def test_refresh_does_not_return_token_in_body(self):
        refresh = RefreshToken.for_user(self.user)
        self.client.cookies['refresh_token'] = str(refresh)

        response = self.client.post(self.url, format='json')

        assert response.status_code == 200
        assert 'access' not in response.data
        assert 'refresh' not in response.data

    def test_refresh_with_no_cookie_returns_401(self):
        """
        Without a refresh cookie there is nothing to exchange — must return 401.
        """
        response = self.client.post(self.url, format='json')

        assert response.status_code == 401

    def test_refresh_with_invalid_token_returns_401(self):
        self.client.cookies['refresh_token'] = 'not.a.valid.jwt'

        response = self.client.post(self.url, format='json')

        assert response.status_code == 401


@pytest.mark.django_db
class TestLogoutView:
    """
    Tests for POST /api/token/logout/.
    Logout must clear both HttpOnly auth cookies via the server — the frontend
    cannot do this itself because JavaScript cannot touch HttpOnly cookies.
    """

    def setup_method(self):
        self.client = APIClient()
        self.url = '/api/token/logout/'
        self.user = UserFactory()

    def test_logout_returns_200(self):
        response = self.client.post(self.url, format='json')
        assert response.status_code == 200

    def test_logout_clears_access_token_cookie(self):
        """
        Django's delete_cookie() overwrites the cookie with an empty value and
        an expiry in the past, which instructs the browser to discard it.
        """
        refresh = RefreshToken.for_user(self.user)
        self.client.cookies['access_token'] = str(refresh.access_token)

        response = self.client.post(self.url, format='json')

        assert response.cookies['access_token'].value == ''

    def test_logout_clears_refresh_token_cookie(self):
        refresh = RefreshToken.for_user(self.user)
        self.client.cookies['refresh_token'] = str(refresh)

        response = self.client.post(self.url, format='json')

        assert response.cookies['refresh_token'].value == ''

    def test_logout_succeeds_even_without_cookies(self):
        """
        Logout should always succeed regardless of auth state — it just clears
        whatever cookies are present.
        """
        response = self.client.post(self.url, format='json')
        assert response.status_code == 200
