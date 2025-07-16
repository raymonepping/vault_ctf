docker exec -it vanilla vault secrets enable database

docker exec -it vanilla vault secrets list

docker exec -it -e VAULT_ADDR=http://127.0.0.1:8200 vanilla vault write database/config/couchbase \
    plugin_name=couchbase-database-plugin \
    allowed_roles="readonly,readwrite" \
    hosts="couchbase://couchbase_db" \
    username="hashicorp" \
    password="hashicorp"