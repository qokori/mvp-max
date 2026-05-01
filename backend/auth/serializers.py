from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework.authentication import get_user_model


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    email = serializers.CharField(required=False)
    password = serializers.CharField(
        required=True,
        validators=[
            validate_password,
        ],
    )

    def create(self, validated_data):
        return get_user_model().objects.create_user(**validated_data)


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True)
