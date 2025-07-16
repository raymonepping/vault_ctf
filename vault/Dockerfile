FROM hashicorp/vault:1.20

# Set Vault's working directory
WORKDIR /app

# Expose the Vault API port
EXPOSE 8200

# Copy custom configuration files if needed
COPY vault-config.hcl /vault/config/vault-config.hcl

# Vault entrypoint
ENTRYPOINT ["vault"]
CMD ["server", "-config=/vault/config/vault-config.hcl"]
