from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def contact_form_submission(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            name = data.get('name')
            email = data.get('email')
            message = data.get('message')

            # Process the data (e.g., save to database, send email, etc.)
            print(f"Received contact form submission: {name}, {email}, {message}")

            return JsonResponse({'success': True, 'message': 'Form submitted successfully.'})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})
    return JsonResponse({'success': False, 'error': 'Invalid request method.'})
