from rest_framework import serializers
from .models import User
from django.contrib.auth import authenticate


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'full_name', 'phone',
            'profile_picture', 'bio', 'role', 'is_active',
            'is_staff', 'is_superuser', 'date_joined',
        ]
        read_only_fields = ['id', 'date_joined']


class UserCreateSerializer(serializers.ModelSerializer):
    phone = serializers.IntegerField(required=False, max_value=13, min_value=10)
    bio = serializers.CharField(required=False, allow_blank=True)
    profile_picture = serializers.ImageField(required=False, allow_null=True)
    password = serializers.CharField(write_only=True, min_length=6)
    role = serializers.CharField(required=True)

    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'full_name',
            'phone', 'bio', 'role', 'is_active', 'profile_picture',
        ]

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class UserUpdateSerializer(serializers.ModelSerializer):
    phone = serializers.IntegerField(required=False, max_value=13, min_value=10)
    
    class Meta:
        model = User
        fields = [
            'username', 'email', 'full_name', 'phone',
            'bio', 'role', 'is_active', 'profile_picture',
        ]

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class AdminChangePasswordSerializer(serializers.Serializer):
    new_password = serializers.CharField(required=True, min_length=6)
    confirm_password = serializers.CharField(required=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError(
                {'confirm_password': 'Passwords do not match.'}
            )
        return attrs


class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        if not username or not password:
            raise serializers.ValidationError(
                'Both username and password are required.'
            )

        user = authenticate(username=username, password=password)
        if not user:
            raise serializers.ValidationError('Invalid credentials.')

        attrs['user'] = user
        return attrs


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    confirm_password = serializers.CharField(required=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError(
                {'confirm_password': 'New password and confirm password do not match.'}
            )
        if attrs['old_password'] == attrs['new_password']:
            raise serializers.ValidationError(
                {'new_password': 'New password must be different from old password.'}
            )
        return attrs