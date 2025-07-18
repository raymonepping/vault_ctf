# export VAULT_ADDR=http://127.0.0.1:8200
# export VAULT_TOKEN=hvs.I9qAQFf4ZhlWKBB6Vi6Sr3OL

# 07d197050919c1f0929c2ca9e7227246ed483041e6469870e649ea116ddbb5479d
# 5a82b36ec0f15f3dec324da9e9864abcff1dbcdecde681ab171f4eb54add523bf4
# 728f70ab92d11213747989538135d9f4b2a0f8945415331995d122c8108fe10f5a

# root_token": "hvs.I9qAQFf4ZhlWKBB6Vi6Sr3OL

vault secrets list
Path          Type         Accessor              Description
----          ----         --------              -----------
cubbyhole/    cubbyhole    cubbyhole_d0551809    per-token private secret storage
identity/     identity     identity_12cb7803     identity store
sys/          system       system_907efacc       system endpoints used for control, policy and debugging

✗ vault secrets enable -path=secret/ctf kv-v2

Success! Enabled the kv-v2 secrets engine at: secret/ctf/

✗ vault secrets list                         
Path           Type         Accessor              Description
----           ----         --------              -----------
cubbyhole/     cubbyhole    cubbyhole_d0551809    per-token private secret storage
identity/      identity     identity_12cb7803     identity store
secret/ctf/    kv           kv_e7938120           n/a
sys/           system       system_907efacc       system endpoints used for control, policy and debugging

vault kv put secret/ctf/config COUCHBASE_URL=couchbase://nosql

vault kv put secret/ctf/config \
  COUCHBASE_URL=couchbase://nosql \
  COUCHBASE_USERNAME=Administrator \
  COUCHBASE_PASSWORD="3x&ykzswuVyu9X"



COUCHBASE_USERNAME=Administrator
COUCHBASE_PASSWORD=3x&ykzswuVyu9X

===== Secret Path =====
secret/ctf/data/config

======= Metadata =======
Key                Value
---                -----
created_time       2025-07-18T12:03:34.678255541Z
custom_metadata    <nil>
deletion_time      n/a
destroyed          false
version            


    const clusterConnStr = vaultConfig.url  ;
    const username = vaultConfig.username   ;
    const password = vaultConfig.password   ;