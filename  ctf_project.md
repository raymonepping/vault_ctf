Absolutely—your project is shaping up beautifully! Below is a **restructured and reordered version** of your `ctf_project.md` for your Vault CTF, designed for maximum clarity, onboarding flow, and technical completeness. This version is ready for **README.md** or handoff, with all critical elements highlighted and reorganized for better developer, player, or contributor onboarding.

---

# 🚩 Vault Radar CTF: DevOps Arcade with Vault & Real-World Secret Hygiene

A hands-on, containerized **Capture The Flag (CTF)** game for learning real-world secret management, detection, and remediation using **HashiCorp Vault**, Vault Radar, and a modern web stack.

---

## 📦 Project Overview

* **DevOps Arcade:** Local, containerized, and resettable—every player gets a private playground.
* **Stack:** Docker Compose (or Podman), Vault (dev mode), Couchbase, Express backend, Nuxt 3 frontend, Vault Radar SaaS.
* **Objective:** Progress through 10 security-themed levels. Fix, validate, and push your way up the leaderboard while mastering DevSecOps best practices.

---

## 🏗️ Project Structure

```
./
├── backend/         # Express API, Vault/Couchbase integration, validation logic
├── frontend/        # Nuxt 3 dashboard, level selection, validation, hints
├── nosql/           # Couchbase container, player state, progress, leaderboard
├── vault/           # Vault container, dev mode configs
├── docker-compose.yml
├── entrypoint.sh's  # Service orchestrators (dependency chain enforced)
├── list_containers.sh, list_versions.sh
├── README.md, ctf_project.md
├── .dockerignore, .gitignore, .yamllint
```

*Containers launch in sequence: Vault → Couchbase (nosql) → Backend → Frontend. Each entrypoint waits for the previous to be ready.*

---

## 🚀 Getting Started

### 1. **Fork & Clone**

* Fork this repo on GitHub
* Clone **your fork** locally:

  ```bash
  git clone https://github.com/<your-username>/vault_ctf.git
  cd vault_ctf
  ```

### 2. **Start the Game**

* Launch all containers with preflight checks:

  ```bash
  ./start_ctf.sh
  ```

  *(Checks Docker/Podman, ports, and credentials, then launches services.)*

### 3. **Open Dashboard**

* Visit [`http://localhost:3000`](http://localhost:3000)
* Dashboard shows: live instructions, challenge progress, credentials, and validation controls

### 4. **Play & Validate**

* Fix the issue for the current level (see "Level Design" below)
* Use the dashboard "Validate" button (or CLI) after each fix
* Validation: auto-commit, restart container, check via Vault Radar, unlock next level or give a hint

---

## 🎮 Gameplay Flow

* **Each level = real DevSecOps issue:** Hardcoded secrets, leaked envs, Docker image forensics, etc.
* **Validate each fix:** Only after validation does the next challenge unlock.
* **Strict progression:** No skipping ahead; state tracked in Couchbase/local file.
* **All actions accessible:** Web UI and CLI are both fully supported.
* **Hints available:** Trade a 🔑 "key" for hints if stuck.

---

## 🏆 Levels & Challenges

| Level | Name                   | Challenge                                            | Core Skill                   | How to Win                                          |
| ----- | ---------------------- | ---------------------------------------------------- | ---------------------------- | --------------------------------------------------- |
| 1     | Defender of the Gate   | Hardcoded API key in backend code                    | Spot static secrets          | Move to Vault, remove from code, validate, and push |
| 2     | Env File Sentry        | Tracked `.env` file with secrets                     | .gitignore & Vault           | Remove from git, ignore, migrate secrets to Vault   |
| 3     | History Hunter         | Secret removed from code, but present in git history | Git forensics, rotation      | Clean git, rotate secret, validate                  |
| 4     | CI/CD Canary           | CI leaks secret in build logs                        | Masking, CI hygiene          | Mask, rotate secret, logs & Radar clean             |
| 5     | Keeper of the Shards   | Vault unseal key in committed config                 | Config mgmt, secret rotation | Remove, rotate, purge from code & Radar             |
| 6     | Policy Locksmith       | Over-privileged Vault token used                     | Least privilege, RBAC        | Use scoped token, validate                          |
| 7     | Rotkeeper’s Trial      | Expired fallback secret present                      | Rotation hygiene             | Remove fallback, use only live secret               |
| 8     | The Phantom Layer      | Secret in Docker image layer                         | Image forensics              | Rebuild image, scan, validate                       |
| 9     | Policy Paradox         | Overbroad Vault policy (\*)                          | Policy review/testing        | Restrict, verify access                             |
| 10    | Guardian of the Galaxy | Flag split across code, DB, and history              | Full-stack forensics         | Find/submit flag, validate all fixes                |

*Each level teaches a distinct, modern DevSecOps lesson!*

---

## ⏳ Progression, Keys, Timers

* **Sequential:** Progress, lives (keys), and timer tracked in Couchbase and frontend.
* **Keys ("Lives"):** Start with 3. Use a key for a hint; lose all, game resets.
* **Timers:** Default 5 min/level, 60 min total; overridable via env/CLI.

  ```bash
  export LEVEL_TIME=10
  export GAME_TIME=120
  ./start_ctf.sh
  ```
* **Bonus:** Reach Level 6 quickly? Earn a badge, leaderboard highlight, and extra life.

---

## 🌍 Leaderboard & Rewards

* **Leaderboard Sync:** On completion, submit score via GitHub Issue (CLI or dashboard button).
* **Public Standings:** Viewable in a table/summary, fields: nickname, levels, time, keys, badge.
* **Security Badge/Lock Pick:** Fast players unlock badge, extra key, and optional bonus.

---

## 🦾 Accessibility

* **All info is textual:** CLI and UI, screen-reader and keyboard-friendly.
* **"Accessible mode":** Adjustable timers, extra lives, future TTS support.
* **No color/mouse-only puzzles.** All credentials, URLs, hints: always copyable.

---

## 🛠️ Tech Stack & Automation

* **Nuxt 3 Frontend:** Dashboard, challenge browser, validation, hints, progress.
* **Express Backend:** APIs for validation, level logic, auto-commit/restart, player state.
* **Couchbase:** Stores player progress, leaderboard, and in-game state.
* **Vault (Dev Mode):** Powers secret management, levels evolve from static to dynamic secrets.
* **Vault Radar SaaS:** Used for code/commit/image validation on secret exposure.
* **Entrypoint Orchestration:** Each service waits for its dependency—no broken chains!

---

## 🧑‍💻 How Validation Works

1. **Fix** the issue for your current level.
2. **Validate** via dashboard/CLI (auto-commit, restart, scan with Vault Radar if needed).
3. **Pass:** Unlock next level, timer continues, progress saved.
4. **Fail:** Retry, or use a key (🔑) for a hint.
5. **Run out of keys:** Game resets. Progress, leaderboard, and lives shown in dashboard.

---

## 🧩 Example Flow (Level 1)

1. Find and remove the hardcoded API key in backend code.
2. Refactor to fetch the secret from Vault.
3. Click "Validate"—script auto-commits, restarts backend, checks Radar.
4. Success? Frontend unlocks Level 2.
5. Failure? Use a key for a hint or retry.

---

## ❓ FAQ & Troubleshooting

* **Container won’t start?**
  Check Docker/Podman is running; free up required ports.

* **Git push fails?**
  Remote must be HTTPS; use personal access token if prompted.

* **Radar scan fails?**
  Check SaaS token, retry, or check logs for rate limits.

* **Lost all keys or stuck?**
  `./start_ctf.sh --reset` to restore starting state.

---

## 🧾 Checklist

### Gameplay & Flow

* [x] Locked level progression
* [x] Keys, hints, bonus badge logic
* [x] Timers (overridable)
* [x] Resettable game state

### Tech & Infra

* [x] Docker/Podman detection
* [x] Nuxt dashboard & CLI
* [x] URLs/creds/hints visible
* [x] Single-script reset

### Accessibility

* [x] CLI-only mode
* [x] All info as text
* [x] Adjustable timer/lives

### Security & Privacy

* [x] No real secrets in images/scripts
* [x] Vault Radar integration
* [x] Anonymous/alias leaderboard
* [x] HTTPS-only pushes

### Community/Leaderboard

* [x] Sync via GitHub Issue
* [x] Public leaderboard
* [x] Badge/extra key for speed

### Troubleshooting/Support

* [x] Actionable error messages
* [x] README/FAQ coverage
* [x] Reset instructions
* [x] Mac + one other OS tested

---

# 🕹️ Ready to Play?

**Clone your fork, run the script, open the dashboard, and enter the DevOps CTF Arcade!**

---

*This doc is structured for easy handoff, onboarding, and future updates.
Need a step-by-step playbook or contributor guide? Let us know!*

---

### Attribution

*Inspired by real-world DevSecOps best practices. Built for the community, by the community.*

---

Let me know if you want this version adapted for public-facing README, contributor docs, or with visual branding! If you want **next steps for actual level implementation** or **detailed playbook for maintainers**, just say the word.
