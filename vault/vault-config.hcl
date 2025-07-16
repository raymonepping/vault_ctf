listener "tcp" {
  address = "0.0.0.0:8200"
  tls_disable = 1
}

audit "file" {
  file_path = "/app/logs/vault_audit.log"
}

disable_mlock = true
ui = true
