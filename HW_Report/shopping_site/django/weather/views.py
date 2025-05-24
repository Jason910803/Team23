from django.shortcuts import render
import requests
import os
from django.http import JsonResponse
# Create your views here.
api_key = os.environ.get('WEATHER_API_KEY')
def get_weather(request):
    url = f'http://api.openweathermap.org/data/2.5/weather?q=Taipei&appid={api_key}'
    weather = requests.get(url).json()
    return JsonResponse(weather)
