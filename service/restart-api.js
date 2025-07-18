const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const app = express();
const port = 3999;

// Get the absolute path to your project root
const projectRoot = path.resolve(__dirname, '..');

app.post('/restart-backend', (req, res) => {
  const cmd = 'docker compose down backend && sleep 5 && docker compose up --build --no-deps backend -d';
  exec(cmd, { cwd: projectRoot }, (error, stdout, stderr) => {
    if (error) {
      console.error('Restart error:', error);
      return res.status(500).json({ success: false, error: error.message, stderr });
    }
    console.log('Backend rebuilt and started:', stdout);
    res.json({ success: true, message: 'Backend rebuilt and started!', output: stdout });
  });
});

app.listen(port, () => {
  console.log(`Orchestrator running at http://localhost:${port}`);
});


// This code is for a simple API to restart the backend service using Docker Compose.
// docker compose up --no-deps backend --build