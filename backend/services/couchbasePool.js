const couchbase = require("couchbase");
const logger = require("../configurations/logger");

const { getCouchbaseConfig } = require("./vaultService"); // ✅ GOOD (Vault import)

require("dotenv").config();

let cluster = null;
let bucket = null;

// Initialize Couchbase connection
async function initializeCouchbaseConnection() {
  try {
    // 🔑 Fetch Couchbase config
    const vaultConfig = (await getCouchbaseConfig()) || {}; // ✅ GOOD (Vault config load)

    // Fetch credentials and connection info from environment variables
    const clusterConnStr = vaultConfig.url; // ✅ GOOD (Vault)
    const username = vaultConfig.username; // ✅ GOOD (Vault)
    const password = vaultConfig.password; // ✅ GOOD (Vault)

    const bucketName = process.env.COUCHBASE_BUCKET || "game_users";

    logger.info("Initializing new Couchbase connection...");

    // Connect to the Couchbase cluster
    cluster = await couchbase.connect(clusterConnStr, {
      username,
      password,
      configProfile: process.env.COUCHBASE_CONFIG_PROFILE || "wanDevelopment",
    });

    // Open the specified bucket
    bucket = cluster.bucket(bucketName);
    logger.info(`Connected to Couchbase bucket: ${bucketName}`);

    return { cluster, bucket };
  } catch (err) {
    logger.error("Error initializing Couchbase connection:", err.message);
    throw err;
  }
}

// Get Couchbase connection
async function getConnection() {
  if (cluster && bucket) {
    logger.debug("Reusing existing Couchbase connection...");
    return { cluster, bucket };
  }
  return initializeCouchbaseConnection();
}

// Get Couchbase collection
async function getClusterCollection(collectionName, scopeName) {
  try {
    const { bucket } = await getConnection();
    const scope = bucket.scope(
      scopeName || process.env.COUCHBASE_SCOPE || "_default",
    );
    const collection = scope.collection(
      collectionName || process.env.COUCHBASE_COLLECTION || "_default",
    );

    logger.debug(
      `Connected to bucket: ${bucket.name}, scope: ${scope.name}, collection: ${collection.name}`,
    );
    return { cluster, collection };
  } catch (err) {
    logger.error("Error fetching cluster collection:", err.message);
    throw err;
  }
}

module.exports = {
  getConnection,
  getClusterCollection,
};
