from datetime import timedelta

from couchbase.auth import PasswordAuthenticator
from couchbase.cluster import Cluster
from couchbase.options import ClusterOptions, QueryOptions

from sentence_transformers import SentenceTransformer
from transformers import AutoTokenizer, AutoModel

import torch

# Couchbase connection details
username = "repping"
password = "@kkerMunt168!"
bucket_name = "demo"
scope_name = "baking"
collection_name = "ingredients"

# Initialize Couchbase connection
auth = PasswordAuthenticator(username, password)
cluster = Cluster("couchbase://localhost", ClusterOptions(auth))
cluster.wait_until_ready(timedelta(seconds=5))
cb = cluster.bucket(bucket_name)
cb_coll = cb.scope(scope_name).collection(collection_name)

# Initialize vectorization models
sentence_model = SentenceTransformer("all-MiniLM-L6-v2")
hf_model_name = "sentence-transformers/all-MiniLM-L6-v2"
hf_tokenizer = AutoTokenizer.from_pretrained(hf_model_name)
hf_model = AutoModel.from_pretrained(hf_model_name)

# Hugging Face vectorization function
def generate_hf_embedding(text):
    inputs = hf_tokenizer(text, return_tensors="pt", truncation=True, max_length=512)
    with torch.no_grad():
        outputs = hf_model(**inputs)
        embeddings = outputs.last_hidden_state.mean(dim=1).squeeze().tolist()
    return embeddings

# Retrieve documents from Couchbase
def retrieve_ingredients():
    sql_query = f"SELECT META().id AS doc_id, * FROM `{bucket_name}`.`{scope_name}`.`{collection_name}`"
    inventory_scope = cb.scope(scope_name)
    result = inventory_scope.query(sql_query)
    return list(result)

# Upsert document with vector back into Couchbase
def upsert_vectorized_document(doc_id, vectorized_doc):
    try:
        cb_coll.upsert(doc_id, vectorized_doc)
        print(f"Document {doc_id} updated successfully.")
    except Exception as e:
        print(f"Error updating document {doc_id}: {e}")

# Process and vectorize documents
def process_documents():
    documents = retrieve_ingredients()
    for doc in documents:
        doc_id = doc["doc_id"]
        ingredient = doc[collection_name]  # Get the ingredient document
        
        # Combine name and description for vectorization
        text_to_vectorize = f"{ingredient['name']} {ingredient.get('description', '')}"
        
        # Generate vectors
        ingredient["sentence_transformer_vector"] = sentence_model.encode(text_to_vectorize).tolist()
        ingredient["hf_vector"] = generate_hf_embedding(text_to_vectorize)

        # Update document in Couchbase
        upsert_vectorized_document(doc_id, ingredient)

# Main execution
if __name__ == "__main__":
    process_documents()
