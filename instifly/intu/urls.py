from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    Home, 
    About,
    Health, 
    FileUpload, 
    GenerateUploadURL, 
    InitiateUpload, 
    GetUploadPartURL, 
    CompleteUpload, 
    ListUploadedParts,
    GetMultiplePartURLs,
    ListUploads,
    DeleteUpload
)

router = DefaultRouter()
router.register(r'files', FileUpload, basename='files')

urlpatterns = [
    path("", Home.as_view(), name="home"),
    path("about/", About.as_view(), name="about"),
    path("health/", Health.as_view(), name="health"),
    path("upload-url/", GenerateUploadURL.as_view(), name="generate-upload-url"),
    path("upload/init/", InitiateUpload.as_view()),
    path("upload/part-url/", GetUploadPartURL.as_view()),
    path("upload/multiple-part-urls/", GetMultiplePartURLs.as_view()),
    path("upload/complete/", CompleteUpload.as_view()),
    path("upload/list-parts/", ListUploadedParts.as_view()),
    path("uploads/", ListUploads.as_view()),
    path("uploads/<int:pk>/", DeleteUpload.as_view()),
    path("", include(router.urls)),
]