// backend/services/vaultService.js
const vault = require('node-vault')
const logger = require('../configurations/logger')

const VAULT_ADDR = process.env.VAULT_ADDR || 'http://127.0.0.1:8200'
const VAULT_TOKEN = process.env.VAULT_TOKEN || 'hvs.I9qAQFf4ZhlWKBB6Vi6Sr3OL'

const vaultClient = vault({
  endpoint: VAULT_ADDR,
  token: VAULT_TOKEN,
})

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

module.exports = { getCouchbaseConfig }
