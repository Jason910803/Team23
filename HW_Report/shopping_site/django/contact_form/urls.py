from django.urls import path
from .views import contact_form_submission

urlpatterns = [
    path('submit/', contact_form_submission, name='contact_form_submission'),
]