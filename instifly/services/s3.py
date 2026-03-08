import boto3
from django.conf import settings

s3 = boto3.client("s3", region_name=settings.AWS_REGION, config=boto3.session.Config(s3={"use_accelerate_endpoint": True}))


ALLOWED_TYPES = ["video/mp4", "video/x-matroska", "video/matroska"]
MAX_SIZE = 500 * 1024 * 1024  # 500MB


def initiate_multipart_upload(user_id, file_name, content_type):
    if content_type not in ALLOWED_TYPES:
        raise ValueError("Invalid content type")
    
    key = f"raw/{user_id}/{file_name}"

    return s3.create_multipart_upload(
        Bucket=settings.AWS_STORAGE_BUCKET_NAME,
        Key=key,
        ContentType=content_type,
    )["UploadId"]



def generate_presigned_part_url(key, upload_id, part_number):
    return s3.generate_presigned_url(
        ClientMethod="upload_part",
        Params={
            "Bucket": settings.AWS_STORAGE_BUCKET_NAME,
            "Key": key,
            "UploadId": upload_id,
            "PartNumber": part_number,
        },
        ExpiresIn=3600,
    )


def complete_multipart_upload(key, upload_id, parts):
    return s3.complete_multipart_upload(
        Bucket=settings.AWS_STORAGE_BUCKET_NAME,
        Key=key,
        UploadId=upload_id,
        MultipartUpload={"Parts": parts},
    )

def list_uploaded_parts(key, upload_id):
    response = s3.list_parts(
        Bucket=settings.AWS_STORAGE_BUCKET_NAME,
        Key=key,
        UploadId=upload_id,
    )
    return response.get("Parts", [])

def delete_s3_file(key):
    return s3.delete_object(
        Bucket=settings.AWS_STORAGE_BUCKET_NAME,
        Key=key
    )