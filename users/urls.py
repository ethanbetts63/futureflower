from django.urls import path, include
from .views import email_verification_view
from .views.register_view import RegisterView
from .views.user_profile_view import UserProfileView
from .views.delete_user_view import DeleteUserView
from .views.change_password_view import ChangePasswordView
from .views.password_reset_request_view import PasswordResetRequestView
from .views.password_reset_confirm_view import PasswordResetConfirmView
from rest_framework.routers import DefaultRouter
from .views.emergency_contact_view import EmergencyContactViewSet

router = DefaultRouter()
router.register(r'emergency-contacts', EmergencyContactViewSet, basename='emergencycontact')


app_name = 'users'

urlpatterns = [
    path('', include(router.urls)),
    path(
        'verify-email/<str:uidb64>/<str:token>/',
        email_verification_view.EmailVerificationView.as_view(),
        name='email_verify'
    ),
    path(
        'resend-verification/',
        email_verification_view.ResendVerificationView.as_view(),
        name='resend_verification'
    ),
    path('me/', UserProfileView.as_view(), name='user-profile'),
    path('register/', RegisterView.as_view(), name='register'),
    path('delete/', DeleteUserView.as_view(), name='delete-user'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('password-reset/request/', PasswordResetRequestView.as_view(), name='password-reset-request'),
    path('password-reset/confirm/<uidb64>/<token>/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
]
