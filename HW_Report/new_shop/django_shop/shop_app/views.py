from django.shortcuts import render, get_object_or_404
from bson import ObjectId
from .models import Product
from django.http import HttpResponse
from bson.errors import InvalidId
from django.http import Http404
from .models import Product


# Create your views here.
def index(request):
    return render(request, "index.html", {"message": "Welcome to Shop App!"})
def about(request):
    return render(request, "about.html", {"message": "About Us"})
def products_list(request):
    products = Product.objects.all()
    return render(request, "products_list.html", {"products": products})
def product_detail(request, product_id):
    try:
        object_id = ObjectId(product_id)
    except InvalidId:
        raise Http404(f"Invalid recipe ID format: {product_id}")

    # Get the recipe or return 404
    product = get_object_or_404(Product, id=object_id)

    # Create context with all needed data
    context = {"product": product}

    return render(request, "product_detail.html", context)
