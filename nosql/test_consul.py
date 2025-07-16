import requests
import base64
import os
from dotenv import load_dotenv
from colorama import init, Fore, Style

# Load environment variables from .env file
load_dotenv()

# Initialize colorama for colored output
init()

# Consul Configuration
CONSUL_HTTP_TOKEN = os.getenv("CONSUL_HTTP_TOKEN", "50b306a5-9b92-cb6b-6a69-5839aec04bf9")  # Use the correct token
CONSUL_HTTP_ADDR = os.getenv("CONSUL_HTTP_ADDR", "http://127.0.0.1:8500")
CONSUL_KEY_PATH = "vault/couchbase/bucket"  # The specific KV path to fetch

def fetch_consul_kv(key_path):
    """
    Fetches a key-value from the Consul KV store.
    """
    headers = {"X-Consul-Token": CONSUL_HTTP_TOKEN}
    url = f"{CONSUL_HTTP_ADDR}/v1/kv/{key_path}"

    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            kv_data = response.json()[0]
            decoded_value = base64.b64decode(kv_data["Value"]).decode("utf-8")
            print(f"{Fore.GREEN}Successfully fetched key '{key_path}': {decoded_value}{Style.RESET_ALL}")
        else:
            print(f"{Fore.RED}Failed to fetch key '{key_path}'. Status code: {response.status_code}{Style.RESET_ALL}")
            print(response.text)
    except Exception as e:
        print(f"{Fore.RED}Error while fetching key '{key_path}': {str(e)}{Style.RESET_ALL}")

if __name__ == "__main__":
    print(f"{Fore.CYAN}Fetching KV value from Consul...{Style.RESET_ALL}")
    fetch_consul_kv(CONSUL_KEY_PATH)
