## Level 01: Remove Hardcoded API Key

🧪 Description:
Replace hardcoded secrets with secure Vault-injected values.

🧪 Challenge:
Find the hardcoded API key in `couchbaseConfig.js` and refactor it to use `process.env.VAULT_API_KEY`.

🛠️ Before:
```js
const apiKey = 'my-super-secret-123456';
```

✅ After:
```js
const apiKey = process.env.VAULT_API_KEY;
```

