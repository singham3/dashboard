from rest_framework import serializers
from .models import Resource, Upload

class FileUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = ['id', 'title', 'description', 'file', 'created_at']

class UploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Upload
        fields = ['id', 'user', 'file_name', 'file_hash', 'upload_id', 'status', 'created_at']