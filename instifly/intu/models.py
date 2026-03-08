from django.db import models
from django.contrib.auth.models import User

class Upload(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    file_name = models.CharField(max_length=255)
    file_hash = models.CharField(max_length=64, db_index=True)
    upload_id = models.CharField(max_length=255)
    file_url = models.URLField(blank=True, null=True)
    file_size = models.BigIntegerField(default=0)
    status = models.CharField(max_length=50, default="initiated")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.file_name

class Resource(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    file = models.URLField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

