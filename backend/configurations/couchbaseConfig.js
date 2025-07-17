const couchbase = require('couchbase');
const cluster = new couchbase.connect(process.env.COUCHBASE_ENDPOINT, {
  username: process.env.COUCHBASE_USERNAME,
  password: process.env.COUCHBASE_PASSWORD,
});
const bucket = cluster.bucket(process.env.COUCHBASE_BUCKET);
module.exports = { cluster, bucket };
