from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Prize
from .serializers import PrizeSerializer

class PrizeListView(APIView):
    def get(self, request):
        prizes = Prize.objects.all()
        serializer = PrizeSerializer(prizes, many=True)
        return Response(serializer.data)
