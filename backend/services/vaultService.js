// backend/services/vaultService.js
const vault = require('node-vault')
const logger = require('../configurations/logger')

const VAULT_ADDR = process.env.VAULT_ADDR
const VAULT_TOKEN = process.env.VAULT_TOKEN

const vaultClient = vault({
  endpoint: VAULT_ADDR,
  token: VAULT_TOKEN,
})

// Vault service for centralized secret access
// - getCouchbaseConfig(): returns Couchbase credentials from Vault
// - getFlagSecret(): returns challenge flag value from Vault

async function getCouchbaseConfig() {
  try {
    const result = await vaultClient.read('secret/ctf/data/config') // KV v2
    const data = result?.data?.data || {}

    logger.debug(`[VAULT] Couchbase config from Vault:`, {
      url: data.COUCHBASE_URL,
      username: data.COUCHBASE_USERNAME,
      password: data.COUCHBASE_PASSWORD ? '******' : '(not set)',
    })

    return {
      url: data.COUCHBASE_URL,
      username: data.COUCHBASE_USERNAME,
      password: data.COUCHBASE_PASSWORD,
    }
  } catch (err) {
    logger.warn(`[VAULT] Failed to fetch Couchbase config: ${err.message}`)
    return null
  }
}

async function getFlagSecret() {
  try {
    const result = await vaultClient.read('secret/ctf'); // KV v1 or v2 (adjust if needed)
    const flag = result?.data?.data?.value || result?.data?.value;

    logger.debug(`[VAULT] Retrieved flag from Vault: ${flag ? '[REDACTED]' : '(none found)'}`);

    return flag;
  } catch (err) {
    logger.warn(`[VAULT] Could not read flag: ${err.message}`);
    return null;
  }
}

module.exports = {
  getCouchbaseConfig,
  getFlagSecret, 
};

