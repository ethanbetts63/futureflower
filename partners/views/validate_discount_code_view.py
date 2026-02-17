from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from partners.serializers import ValidateDiscountCodeSerializer


class ValidateDiscountCodeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ValidateDiscountCodeSerializer(
            data=request.data,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        return Response(serializer.apply_discount())
