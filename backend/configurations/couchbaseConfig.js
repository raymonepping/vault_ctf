const apiKey = process.env.VAULT_API_KEY; // ✅ GOOD (use environment variable)

module.exports = {
  connectionString: process.env.COUCHBASE_CONNSTR || "couchbase://localhost",
  username: process.env.COUCHBASE_USERNAME || "Administrator",
  password: process.env.COUCHBASE_PASSWORD || "password",
  bucketName: process.env.COUCHBASE_BUCKET || "game_users",
  scopeName: process.env.COUCHBASE_SCOPE || "_default",
  collectionName: process.env.COUCHBASE_COLLECTION || "_default",
};
