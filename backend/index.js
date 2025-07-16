const express = require('express');
const fs = require('fs');
const process = require('process');

// Create an Express app
const app = express();

// Port setup
const PORT = process.env.PORT || 3000;

// Paths to secrets
const STATIC_SECRET_FILE = '/vault/secrets/secretfile';
const COUCHBASE_CREDS_FILE = '/vault/secrets/couchbase-creds';

// Initialize secrets objects
let staticSecrets = {};
let couchbaseCredentials = {};

// Function to load static secrets (Option A)
const loadStaticSecrets = () => {
  try {
    const data = fs.readFileSync(STATIC_SECRET_FILE, 'utf8');
    staticSecrets = data.split('\n').reduce((acc, line) => {
      const [key, value] = line.split(':');
      if (key && value) {
        acc[key.trim()] = value.trim();
      }
      return acc;
    }, {});
    console.log('Loaded static secrets:', staticSecrets);
  } catch (error) {
    console.error('Error reading static secrets:', error.message);
  }
};

// Function to load Couchbase credentials (Option B)
const loadCouchbaseCredentials = () => {
  try {
    const data = fs.readFileSync(COUCHBASE_CREDS_FILE, 'utf8');
    const lines = data.split('\n');
    const creds = lines.reduce((acc, line) => {
      const [key, value] = line.split(':');
      if (key && value) {
        acc[key.trim()] = value.trim();
      }
      return acc;
    }, {});
    couchbaseCredentials = creds;
    console.log('Loaded Couchbase credentials:', couchbaseCredentials);
  } catch (error) {
    console.error('Error reading Couchbase credentials:', error.message);
  }
};

// Initial load
loadStaticSecrets();
loadCouchbaseCredentials();

// Handle SIGHUP signal for reloading secrets
process.on('SIGHUP', () => {
  console.log('Received SIGHUP signal. Reloading secrets...');
  loadStaticSecrets();
  loadCouchbaseCredentials();
  // Implement logic to re-establish connections if necessary
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Minimal Butter app is running with Vault!' });
});

// Endpoint to demonstrate using Couchbase credentials
app.get('/connect-couchbase', (req, res) => {
  if (couchbaseCredentials.username && couchbaseCredentials.password) {
    // Here you would use `couchbaseCredentials.username` and `couchbaseCredentials.password` to connect to Couchbase
    res.status(200).json({
      status: 'Connected to Couchbase',
      credentials: couchbaseCredentials,
    });
  } else {
    res.status(500).json({ status: 'Error', message: 'Couchbase credentials not available' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
