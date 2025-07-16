// services/consul.js

const axios = require('axios');

const logger = require("../configurations/logger");

// Function to register a service with Consul
const registerService = async ({ name, id, address, port, tags }) => {
  const CONSUL_HTTP_ADDR = process.env.CONSUL_HTTP_ADDR || '';
  const CONSUL_HTTP_TOKEN = process.env.CONSUL_HTTP_TOKEN || '';

  try {
    const url = `${CONSUL_HTTP_ADDR}/v1/agent/service/register`;
    const headers = { 'X-Consul-Token': CONSUL_HTTP_TOKEN };
    const serviceDefinition = {
      Name: name,
      ID: id,
      Address: address,
      Port: port,
      Tags: tags,
    };

    await axios.put(url, serviceDefinition, { headers });
    logger.info(`Service "${name}" registered in Consul.`);
  } catch (err) {
    logger.debug(`Error registering service in Consul: ${err.message}`);
    throw err;
  }
};

// Function to retrieve a KV value from Consul
const getKVValue = async (keyPath) => {
  const CONSUL_HTTP_ADDR = process.env.CONSUL_HTTP_ADDR || '';
  const CONSUL_HTTP_TOKEN = process.env.CONSUL_HTTP_TOKEN || '';

  try {
    const url = `${CONSUL_HTTP_ADDR}/v1/kv/${keyPath}`;
    const headers = { 'X-Consul-Token': CONSUL_HTTP_TOKEN };
    const response = await axios.get(url, { headers });

    if (response.status === 200 && response.data.length > 0) {
      const base64Value = response.data[0].Value;
      const decodedValue = Buffer.from(base64Value, 'base64').toString('utf-8');
      return decodedValue;
    } else {
      logger.debug(`Key '${keyPath}' not found or empty.`);
      return null;
    }
  } catch (error) {
    logger.debug(`Error fetching key from Consul: ${error.message}`);
    throw error;
  }
};

module.exports = {
  registerService,
  getKVValue,
};
