from rest_framework import status, viewsets
from rest_framework.authentication import authenticate
from rest_framework.authtoken.models import Token
from rest_framework.decorators import action
from rest_framework.response import Response

from .serializers import LoginSerializer, RegisterSerializer


class AuthViewSet(viewsets.ViewSet):
    @action(["POST"], detail=False)
    def register(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token, created = Token.objects.get_or_create(user=user)
        return Response(
            {
                "accessToken": token.key,
                "user": {"id": user.id, "email": user.email, "username": user.username},
            },
            status=status.HTTP_201_CREATED,
        )

    @action(["POST"], detail=False)
    def login(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = authenticate(
            request,
            username=request.data["username"],
            password=request.data["password"],
        )
        if not user:
            return Response({"message": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        token, created = Token.objects.get_or_create(user=user)
        return Response(
            {
                "accessToken": token.key,
                "user": {"id": user.id, "email": user.email, "username": user.username},
            },
            status=status.HTTP_200_OK,
        )

    @action(["GET"], detail=False)
    def me(self, request):
        if not request.user or not request.user.is_authenticated:
            return Response(
                {"message": "Access token was not provided"},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        return Response(
            {
                "user": {
                    "id": request.user.id,
                    "email": request.user.email,
                    "username": request.user.username,
                }
            },
            status=status.HTTP_200_OK,
        )
