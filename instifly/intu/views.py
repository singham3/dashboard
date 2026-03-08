from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from .serializers import FileUploadSerializer, UploadSerializer
from .models import Resource, Upload
from services.s3 import MAX_SIZE, initiate_multipart_upload, generate_presigned_part_url, complete_multipart_upload, list_uploaded_parts, delete_s3_file
from rest_framework.permissions import IsAuthenticated
import logging
import time
import re
import urllib.parse

logger = logging.getLogger(__name__)

class ListUploadedParts(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        key = request.data.get("key")
        upload_id = request.data.get("upload_id")

        parts_list = list_uploaded_parts(key, upload_id)

        parts = [
            {
                "PartNumber": p["PartNumber"],
                "ETag": p["ETag"].replace('"', "")
            }
            for p in parts_list
        ]

        return Response({"parts": parts})

class GetUploadPartURL(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        key = request.data.get("key")
        upload_id = request.data.get("upload_id")
        part_number = request.data.get("part_number")

        url = generate_presigned_part_url(
            key,
            upload_id,
            part_number
        )

        return Response({"url": url})

class GetMultiplePartURLs(APIView):
    def post(self, request):
        key = request.data.get("key")
        upload_id = request.data.get("upload_id")
        part_numbers = request.data.get("part_numbers")

        urls = [
            {
                "part_number": pn,
                "url": generate_presigned_part_url(key, upload_id, pn)
            }
            for pn in part_numbers
        ]

        return Response({"urls": urls})

class CompleteUpload(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        key = request.data.get("key")
        upload_id = request.data.get("upload_id")
        parts = request.data.get("parts")
        parts = sorted(parts, key=lambda x: x["PartNumber"])
        complete_multipart_upload(key, upload_id, parts)

        file_url = f"https://d2jkzcaf6it7he.cloudfront.net/{key}"
        
        # Update upload status
        Upload.objects.filter(upload_id=upload_id, user=request.user).update(
            status="completed",
            file_url=file_url
        )

        return Response({"file_url": file_url})


class InitiateUpload(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        file_name = request.data.get("file_name")
        content_type = request.data.get("content_type")
        file_size = int(request.data.get("file_size", 0))
        file_hash = request.data.get("file_hash")
        file_name = urllib.parse.unquote(file_name)
        # 🔹 sanitize filename
        file_name = re.sub(r"[^a-zA-Z0-9_.-]", "_", file_name)

        # 🔹 validate size
        if file_size > MAX_SIZE:
            return Response({"error": "File too large"}, status=400)

        # 🔹 duplicate check (only completed uploads)
        existing = Upload.objects.filter(
            file_hash=file_hash,
            user=request.user,
            status="completed"
        ).first()

        if existing:
            return Response({
                "message": "File already uploaded",
                "upload_id": existing.upload_id,
                "file_name": existing.file_name,
                "status": existing.status
            })

        start = time.time()


        try:
            upload_id = initiate_multipart_upload(
                request.user.id,
                file_name,
                content_type
            )
        except Exception as e:
            print(f"[UPLOAD ERROR] {str(e)}")
            logger.error(f"[UPLOAD ERROR] {str(e)}")
            return Response({"error": "Failed to initiate upload"}, status=500)

        end = time.time()

        logger.info(
            f"[UPLOAD START] user={request.user.id} "
            f"file={file_name} upload_id={upload_id} "
            f"time={end - start:.2f}s"
        )

        # 🔥 save using serializer
        serializer = UploadSerializer(data={
            "user": request.user.id,
            "file_name": file_name,
            "file_hash": file_hash,
            "upload_id": upload_id,
            "status": "initiated"
        })

        serializer.is_valid(raise_exception=True)
        serializer.save(file_size=file_size)

        return Response({
            "upload_id": upload_id,
            "key": f"raw/{request.user.id}/{file_name}"
        })

class GenerateUploadURL(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        key = request.data.get("key")
        content_type = request.data.get("content_type")
        part_number = request.data.get("part_number")

        url = generate_presigned_part_url(key, content_type, part_number)

        return Response({
            "upload_url": url,
            "file_url": f"https://d2jkzcaf6it7he.cloudfront.net/{key}"
        })

class Home(APIView):
    def get(self, request):
        return Response({"message": "Welcome to Instifly API!"})
    

class About(APIView):
    def get(self, request):
        return Response({"message": "About Instifly! This is a platform for managing and sharing educational resources."})
    
class FileUpload(ModelViewSet):
    serializer_class = FileUploadSerializer
    queryset = Resource.objects.all()    
        
class Health(APIView):
    def get(self, request):
        return Response({"status": "OK"})

class UploadPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class ListUploads(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        uploads = Upload.objects.filter(user=request.user, status="completed")
        paginator = UploadPagination()
        result_page = paginator.paginate_queryset(uploads, request)
        serializer = UploadSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)

class DeleteUpload(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        try:
            upload = Upload.objects.get(pk=pk, user=request.user)
            key = f"raw/{request.user.id}/{upload.file_name}"
            try:
                delete_s3_file(key)
            except Exception as e:
                logger.warning(f"Failed to delete S3 file: {e}")
            upload.delete()
            return Response({"message": "File deleted successfully"})
        except Upload.DoesNotExist:
            return Response({"error": "File not found"}, status=404)