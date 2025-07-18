const couchbase = require('couchbase');
const config = require('./couchbaseConfig');
const logger = require('./logger');

let cluster, bucket, collection;

// Function to connect to Couchbase
async function connectToCouchbase() {
  if (!cluster) {
    try {
      cluster = await couchbase.connect(config.connectionString, {
        username: config.username,
        password: config.password,
        configProfile: config.configProfile,
      });

      bucket = cluster.bucket(config.bucketName);
      collection = bucket.scope(config.scopeName).collection(config.collectionName);

      logger.info("Connected to Couchbase.");
    } catch (error) {
      logger.error("Failed to connect to Couchbase:", error);
      throw error;
    }
  }
  return { cluster, bucket, collection };
}

// Helper function to get the Couchbase bucket
const getBucket = async () => {
  const { bucket } = await connectToCouchbase();
  return bucket;
};

// Helper function to get the Couchbase collection
const getClusterCollection = async () => {
  const { collection } = await connectToCouchbase();
  return collection;
};

module.exports = {
  connectToCouchbase,
  getBucket,
  getClusterCollection,
};
