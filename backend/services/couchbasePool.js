const couchbase = require('couchbase');
const vaultService = require('./vault');
const logger = require("../configurations/logger");

let cluster = null;
let bucketInstance = null;

async function fetchCouchbaseCredentials() {
  const path = 'database/creds/readwrite'; // Vault path for credentials
  return await vaultService.fetchDynamicCredentials(path);
}

async function initializeCouchbaseConnection() {
  try {
    logger.info('Initializing Couchbase connection...');

    const connectionString = 'couchbase://cb-example.default.svc.cluster.local';
    const bucketName = 'demo'; // Static bucket name
    const { username, password } = await fetchCouchbaseCredentials();

    cluster = await couchbase.connect(connectionString, { username, password });
    bucketInstance = cluster.bucket(bucketName);

    logger.info(`Connected to Couchbase bucket: ${bucketName}`);
    return { cluster, bucketInstance };
  } catch (err) {
    logger.error('Error initializing Couchbase connection:', err.message);
    throw err;
  }
}

async function getConnection() {
  if (cluster && bucketInstance) {
    logger.debug('Reusing existing Couchbase connection...');
    return { cluster, bucket: bucketInstance, scope: 'baking', collection: 'ingredients' };
  }
  return initializeCouchbaseConnection();
}

module.exports = {
  getConnection,
};
