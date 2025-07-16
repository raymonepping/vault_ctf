import json
import requests
import time
from datetime import timedelta
from couchbase.auth import PasswordAuthenticator
from couchbase.cluster import Cluster
from couchbase.options import ClusterOptions

# Couchbase connection details
username = "repping"
password = "@kkerMunt168!"
bucket_name = "demo"
scope_name = "baking"
collection_name = "ingredients"

# USDA API details
USDA_API_KEY = "A0AtRDhPXAr9CBfGtDgrpvbaKlPiTLQV0CizwySu"
USDA_SEARCH_API = "https://api.nal.usda.gov/fdc/v1/foods/search"
USDA_FOOD_API = "https://api.nal.usda.gov/fdc/v1/food/{fdcId}"

# FatSecret API details
FATSECRET_CONSUMER_KEY = "7f4b3f224a684a6bae4ba4fa2781dd2d"
FATSECRET_CONSUMER_SECRET = "24bd1311038f4e3ea0d6ab87b7805cc7"
FATSECRET_BASE_URL = "https://platform.fatsecret.com/rest/server.api"

# Allergen mapping
ALLERGEN_DICT = {
    "almond": ["tree nuts"],
    "milk": ["dairy"],
    "wheat": ["gluten"],
    "egg": ["egg"],
    "soy": ["soy"],
    "peanut": ["peanuts"],
    "shrimp": ["shellfish"],
    # Add more as needed
}

# Initialize Couchbase connection
auth = PasswordAuthenticator(username, password)
cluster = Cluster("couchbase://localhost", ClusterOptions(auth))
cluster.wait_until_ready(timedelta(seconds=5))
cb = cluster.bucket(bucket_name)
cb_coll = cb.scope(scope_name).collection(collection_name)

# FatSecret OAuth2 token retrieval
def get_fatsecret_access_token():
    """
    Fetch FatSecret API OAuth2 token.
    """
    token_url = "https://oauth.fatsecret.com/connect/token"
    data = {"grant_type": "client_credentials", "scope": "basic"}
    auth = (FATSECRET_CONSUMER_KEY, FATSECRET_CONSUMER_SECRET)
    response = requests.post(token_url, data=data, auth=auth)
    response.raise_for_status()
    return response.json()["access_token"]

def search_fatsecret_food(food_name):
    """
    Search for a food item using FatSecret API.
    """
    try:
        access_token = get_fatsecret_access_token()
        headers = {"Authorization": f"Bearer {access_token}"}
        params = {
            "method": "foods.search",
            "format": "json",
            "search_expression": food_name
        }
        response = requests.get(FATSECRET_BASE_URL, params=params, headers=headers)
        response.raise_for_status()
        results = response.json()
        if results.get("foods"):
            return results["foods"]["food"][0]  # Return the first result
        else:
            print(f"No FatSecret results found for '{food_name}'.")
            return None
    except Exception as e:
        print(f"Error searching FatSecret for {food_name}: {e}")
        return None

def get_fatsecret_food_data(food_id):
    """
    Retrieve detailed nutritional information from FatSecret API.
    """
    try:
        access_token = get_fatsecret_access_token()
        headers = {"Authorization": f"Bearer {access_token}"}
        params = {
            "method": "food.get",
            "format": "json",
            "food_id": food_id
        }
        response = requests.get(FATSECRET_BASE_URL, params=params, headers=headers)
        response.raise_for_status()
        return response.json()["food"]
    except Exception as e:
        print(f"Error retrieving FatSecret data for food_id {food_id}: {e}")
        return None

def search_usda_food(ingredient):
    """
    Search for a food item using USDA API.
    """
    try:
        params = {
            "api_key": USDA_API_KEY,
            "query": ingredient,
            "dataType": ["Foundation", "SR Legacy"],
            "pageSize": 1
        }
        response = requests.get(USDA_SEARCH_API, params=params)
        response.raise_for_status()
        search_results = response.json()

        if search_results.get("foods"):
            return search_results["foods"][0]["fdcId"]
        else:
            print(f"No USDA results found for '{ingredient}'.")
            return None
    except Exception as e:
        print(f"Error searching USDA for {ingredient}: {e}")
        return None

def get_usda_food_data(fdc_id):
    """
    Retrieve detailed nutritional information from USDA API.
    """
    try:
        response = requests.get(USDA_FOOD_API.format(fdcId=fdc_id), params={"api_key": USDA_API_KEY})
        response.raise_for_status()
        food_data = response.json()

        # Debug: print(json.dumps(food_data, indent=2))

        nutrients = food_data.get("foodNutrients", [])
        nutrient_map = {}

        # Safely extract nutrients
        for n in nutrients:
            nutrient_obj = n.get("nutrient", {})
            nutrient_name = nutrient_obj.get("name")
            nutrient_amount = n.get("amount")

            if nutrient_name and nutrient_amount is not None:
                nutrient_map[nutrient_name] = nutrient_amount

        enriched_data = {
            "calories": nutrient_map.get("Energy"),
            "fat": nutrient_map.get("Total lipid (fat)"),
            "protein": nutrient_map.get("Protein"),
            "carbohydrates": nutrient_map.get("Carbohydrate, by difference"),
            "fiber": nutrient_map.get("Fiber, total dietary"),
        }
        return enriched_data
    except Exception as e:
        print(f"Error retrieving USDA data for fdcId {fdc_id}: {e}")
        return None

def get_allergen_info(ingredient_name):
    """
    Retrieve allergen information from the predefined dictionary.
    """
    name_lower = ingredient_name.lower()
    for key in ALLERGEN_DICT.keys():
        if key in name_lower:
            return ALLERGEN_DICT[key]
    return ["No known allergens."]

def clean_nutritional_data(nutrition_data):
    """
    Remove unnecessary attributes from the nutritional data.
    """
    if not nutrition_data:
        return None

    # Define a list of fields to remove
    fields_to_remove = [
        "food_url", 
        "brand_name", 
        "food_id",
        "serving_id",
        "image_url",
        ]

    # Remove unwanted fields from the root level
    for field in fields_to_remove:
        nutrition_data.pop(field, None)

    # Clean servings if available
    servings = nutrition_data.get("servings", {}).get("serving", {})
    if isinstance(servings, dict):
        # Define fields to remove from servings
        serving_fields_to_remove = ["serving_url", "extra_serving_field"]
        for field in serving_fields_to_remove:
            servings.pop(field, None)
        nutrition_data["servings"]["serving"] = servings

    return nutrition_data


def fetch_and_combine_data(ingredient):
    """
    Fetch and combine data from USDA, FatSecret, and allergen sources.
    """
    # Fetch USDA data
    fdc_id = search_usda_food(ingredient)
    nutrition_data_usda = get_usda_food_data(fdc_id) if fdc_id else None

    # Fetch FatSecret data
    fatsecret_result = search_fatsecret_food(ingredient)
    if fatsecret_result:
        food_id = fatsecret_result.get("food_id")
        nutrition_data_fatsecret = get_fatsecret_food_data(food_id) if food_id else None
    else:
        nutrition_data_fatsecret = None

    # Merge nutrition data (FatSecret takes precedence)
    nutrition_data = nutrition_data_fatsecret or nutrition_data_usda

    # Clean nutritional data
    nutrition_data = clean_nutritional_data(nutrition_data)

    # Get allergen info
    allergen_info = get_allergen_info(ingredient)

    # Combine into a single document
    combined_data = {
        "name": ingredient.capitalize(),
        "nutritionalInformation": nutrition_data,
        "allergenInformation": allergen_info
    }
    return combined_data

def upsert_nutrient_data(key, nutrient_data):
    """
    Upsert combined data into Couchbase, merging with existing documents.
    """
    try:
        # Attempt to get the existing document
        try:
            existing_result = cb_coll.get(key)
            existing_doc = existing_result.content_as[dict]
        except:
            # If document doesn't exist, start with an empty dictionary
            existing_doc = {}

        # Merge existing document with new nutrient data
        updated_doc = {**existing_doc, **nutrient_data}

        # Upsert the merged document
        cb_coll.upsert(key, updated_doc)
        print(f"Document for {nutrient_data.get('name', key)} successfully merged and upserted.")
    except Exception as e:
        print(f"Error upserting document for {nutrient_data.get('name', key)}: {e}")

def process_ingredients(input_file):
    """
    Process a list of ingredients from a JSON file, enrich their data, and store in Couchbase.
    """
    try:
        with open(input_file, "r") as file:
            ingredients = json.load(file)

        for ingredient in ingredients:
            print(f"Processing: {ingredient}")
            key = f"ingredient_{ingredient.lower().replace(' ', '_')}"
            enriched_data = fetch_and_combine_data(ingredient)

            if enriched_data:
                upsert_nutrient_data(key, enriched_data)
            else:
                print(f"Skipping {ingredient} due to missing or invalid data.")

            time.sleep(1)  # Respect API rate limits
    except Exception as e:
        print(f"Error processing ingredients: {e}")

if __name__ == "__main__":
    input_file = "ingredients.json"
    process_ingredients(input_file)
