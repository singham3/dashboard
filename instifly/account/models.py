from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    CHOICES = [
        ('warehouse_manager', 'Warehouse Manager'),
        ('store_manager', 'Store Manager'),
        ('admin', 'Admin'),
    ]
    full_name = models.CharField(max_length=100, null=True, blank=True)
    phone = models.CharField(max_length=15, null=True, blank=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    role = models.CharField(max_length=20, choices=CHOICES, default='warehouse_manager')
    
