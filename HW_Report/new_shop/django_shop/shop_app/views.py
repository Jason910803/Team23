from django.shortcuts import render, get_object_or_404
from bson import ObjectId
from .models import Product
from django.http import HttpResponse
from bson.errors import InvalidId
from django.http import Http404
from .models import Product
import os
from pymongo import MongoClient
from urllib.parse import quote_plus

escaped_username = quote_plus("nuser")
escaped_password = quote_plus("mongo123")


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

def fuzzy_search(request):
    """
    Simple function-based view for fuzzy search using MongoDB Atlas Search
    """
    query = request.GET.get("q", "")
    products = []

    if query:
        print(f"Fuzzy search query: {query}")
        # Get MongoDB connection details from environment variables
        MONGO_URI = os.getenv(
            "MONGO_URI", f"mongodb+srv://{escaped_username}:{escaped_password}@cluster0.ncsalyb.mongodb.net/"
        )
        MONGO_DB = os.getenv("MONGO_DB", "DB")

        # Connect to MongoDB directly for Atlas Search
        client = MongoClient(MONGO_URI)
        db = client[MONGO_DB]
        collection = db["collection"]

        # Check if the collection exists
        if "collection" not in db.list_collection_names():
            raise Http404("Collection 'collection' does not exist in the database.")
        else:
            print("Collection 'collection' exists.")
            print(collection.count_documents({}))

        # Build the fuzzy search pipeline
        pipeline = [
            {
                "$search": {
                    "index": "default",  # Use the default index
                    "compound": {
                        "should": [
                            {
                                "text": {
                                    "query": query,
                                    "path": "name",
                                    "fuzzy": {"maxEdits": 2, "prefixLength": 2},
                                    "score": {"boost": {"value": 5}},
                                }
                            },
                            {
                                "text": {
                                    "query": query,
                                    "path": "description",
                                    "fuzzy": {"maxEdits": 2, "prefixLength": 1},
                                    "score": {"boost": {"value": 3}},
                                }
                            },
                            {
                                "text": {
                                    "query": query,
                                    "path": "features",
                                    "fuzzy": {"maxEdits": 2, "prefixLength": 1},
                                }
                            },
                            {
                                "text": {
                                    "query": query,
                                    "path": "keywords",
                                    "fuzzy": {"maxEdits": 2, "prefixLength": 1},
                                }
                            }
                        ]
                    },
                }
            },
            {
                "$project": {
                    "_id": 1,
                    "title": 1,
                    "ingredients": 1,
                    "instructions": 1,
                    "features": 1,
                    "score": {"$meta": "searchScore"},
                }
            },
            {"$sort": {"score": -1}},
            {"$limit": 50},  # Limit results
        ]

        # Execute the search
        search_results = list(collection.aggregate(pipeline))

        print(f"Search results count: {len(search_results)}")

        # Extract IDs from search results
        product_ids = [result["_id"] for result in search_results]
        print("number of product IDs:", len(product_ids))

        # Get Django model instances and preserve ordering
        id_to_position = {str(id): idx for idx, id in enumerate(product_ids)}
        products_unordered = Product.objects.filter(id__in=product_ids)
        print("number of products:", len(products_unordered))

        # Convert to list and sort by search score order
        products = list(products_unordered)
        products.sort(key=lambda r: id_to_position.get(str(r.id), 999))
        print("number of products after sorting:", len(products))

    # Render the template with results
    return render(request, "fuzzy_search.html", {"products": products, "query": query})
