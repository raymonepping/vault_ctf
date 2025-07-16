# 🛡️ Vault Radar CTF

A modern, DevSecOps-style Capture The Flag (CTF) game powered by:
- 🔐 [HashiCorp Vault](https://www.vaultproject.io/) (local instance)
- 🛰️ [Vault Radar](https://www.vaultproject.io/docs/radar) (SaaS secret scanning)
- 🧠 Real Dev workflows (fixing code, pushing commits, protecting secrets)
- 🕹️ Arcade-style progression through 10 unique security levels

---

## 🎯 Goal

Simulate, detect, and **remediate secret leaks** in real-world code scenarios.
Players learn to:
- Identify unsafe patterns
- Fix and commit their code
- Monitor Radar results
- Survive with limited lives (🔑 keys) and progress level by level

---

## 🧩 Components

- **Express.js** backend (game logic, validation, scoring)
- **Nuxt 3** frontend (interactive UI)
- **Couchbase NoSQL** (score/state storage)
- **Vault (local dev)** for secret injection & validation
- **Vault Radar (SaaS)** for repo scanning

---

## 🚀 Getting Started

> ⚠️ Prerequisites:
> - GitHub account
> - Docker or Podman installed
> - VSCode (or editor of choice)

Clone the repo:

```bash
git clone https://github.com/raymonepping/vault_radar_ctf.git
cd vault_radar_ctf
Start the game:

./start_game.sh
This launches all services (Vault, backend, frontend, DB), and gives you access credentials + URLs for gameplay and editing.

---

🎮 Gameplay
Start with 3 keys 🔑

Each level requires solving a real-world security issue

Submit your fix via Git commit

If Vault Radar detects no issue — level up! 🆙

Make a mistake? Lose a key. Lose all 3? Game over.

---

🏁 Coming Soon
Global leaderboard (optional GitHub sync)

Bonus items (e.g., 🪪 security badge for fast progress)

CTF countdown timer (default 5 min/level, 60 min/game)

10 Levels: From Junior Dev to Guardian of the Galaxy

---

🧠 Why This?
Most CTFs break things.
This one teaches you to build securely.

Inspired by real security incidents. Powered by automation.

---

© MIT License
Built by Raymon Epping with ❤️ and paranoia.