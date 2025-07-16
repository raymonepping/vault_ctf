const axios = require('axios');

// Consul Configurations
const CONSUL_HTTP_ADDR = 'http://127.0.0.1:8500';
const CONSUL_TOKEN = '50b306a5-9b92-cb6b-6a69-5839aec04bf9'; // Your valid Consul token
const CONSUL_KEY_PATH = 'vault/couchbase/bucket'; // Path of the key in Consul

async function fetchConsulKey() {
    try {
        const url = `${CONSUL_HTTP_ADDR}/v1/kv/${CONSUL_KEY_PATH}`;
        const headers = { 'X-Consul-Token': CONSUL_TOKEN };

        // Fetch data from Consul
        const response = await axios.get(url, { headers });

        if (response.status === 200 && response.data.length > 0) {
            const base64Value = response.data[0].Value; // Get base64 encoded value
            const decodedValue = Buffer.from(base64Value, 'base64').toString('utf-8'); // Decode the value
            console.log(`Successfully fetched key '${CONSUL_KEY_PATH}': ${decodedValue}`);
        } else {
            console.log(`Key '${CONSUL_KEY_PATH}' not found or empty.`);
        }
    } catch (error) {
        console.error(`Error fetching key from Consul: ${error.message}`);
    }
}

// Execute the function
fetchConsulKey();
