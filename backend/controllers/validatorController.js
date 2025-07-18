const { getClusterCollection } = require('../services/couchbasePool');
const fs = require('fs');
const path = require('path');

const { loadConfig } = require('../utilities/configLoader'); 

const validateLevel = async (req, res) => {
  try {
    const { username, level } = req.body;
    console.log(`[VALIDATOR] Username: ${username}, Level: ${level}`);

    const { collection } = await getClusterCollection();
    console.log(`[VALIDATOR] Connected to Couchbase collection.`);

    const getResult = await collection.get(username);
    const player = getResult.content;
    console.log(`[VALIDATOR] Loaded player doc:`, player);

    // 🛡️ Defender of the Gate
    if (level === 1) {
      const codePath = path.join(__dirname, '../configurations/couchbaseConfig.js');
      console.log(`[VALIDATOR] Reading code from: ${codePath}`);

      const code = fs.readFileSync(codePath, 'utf8');
      const hasHardcodedKey = /api[_-]?key\s*=\s*['"][A-Za-z0-9]+['"]/.test(code);
      const usesVaultEnv = /process\.env\.VAULT_API_KEY/.test(code);

      console.log(`[VALIDATOR] hasHardcodedKey:`, hasHardcodedKey);
      console.log(`[VALIDATOR] usesVaultEnv:`, usesVaultEnv);

      if (hasHardcodedKey) {
        console.log(`[VALIDATOR] FAIL: Found hardcoded key in code.`);
        return res.json({ success: false, message: 'Hardcoded key still found!' });
      }
      if (!usesVaultEnv) {
        console.log(`[VALIDATOR] FAIL: process.env.VAULT_API_KEY not found.`);
        return res.json({ success: false, message: 'Secret is not yet loaded from Vault/env.' });
      }

      // ✅ Passed level
      player.currentLevel = 2;
      player.levelsCompleted.push(1);
      await collection.upsert(username, player);
      console.log(`[VALIDATOR] PASS: Level 1 complete! Progress updated.`);

      return res.json({ success: true, message: 'Level 1 complete!', player });
    }

    // ✨ Enabler of Engines
    if (level === 2) {
    const codePath = path.join(__dirname, '../services/couchbasePool.js')
    const rawCode = fs.readFileSync(codePath, 'utf8')

    const hasVaultImport = /require\(['"`]\.\/vaultService['"`]\)/.test(rawCode)
    const hasVaultURL = /vaultConfig\s*\.\s*url/.test(rawCode)
    const hasVaultUsername = /vaultConfig\s*\.\s*username/.test(rawCode)
    const hasVaultPassword = /vaultConfig\s*\.\s*password/.test(rawCode)


    if (!hasVaultImport || !hasVaultURL || !hasVaultUsername || !hasVaultPassword) {
        console.log('[VALIDATOR] FAIL: Vault config not properly used in couchbasePool.js')
        return res.json({
        success: false,
        message: 'couchbasePool.js must use vaultService for all Couchbase credentials.',
        })
    }

    player.currentLevel = 3
    player.levelsCompleted.push(2)
    await collection.upsert(username, player)
    console.log(`[VALIDATOR] PASS: Level 2 complete!`)

    return res.json({ success: true, message: 'Level 2 complete!', player })
    }

    console.log(`[VALIDATOR] Unknown level: ${level}`);
    res.json({ success: false, message: 'Unknown level.' });

  } catch (error) {
    console.error('[VALIDATOR] Validator error:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

module.exports = { validateLevel };
