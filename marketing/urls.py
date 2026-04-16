from django.urls import path
from marketing.views.upload_view import UploadPodcastView

urlpatterns = [
    path('upload/', UploadPodcastView.as_view(), name='marketing_upload'),
]
