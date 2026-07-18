import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone

logger = logging.getLogger(__name__)

class DeleteUserView(APIView):
    """
    View for authenticated users to delete their own account.
    """
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        """
        Handles the DELETE request to deactivate the user's account.
        """
        user = request.user
        user.is_active = False
        user.deleted_at = timezone.now()
        user.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
