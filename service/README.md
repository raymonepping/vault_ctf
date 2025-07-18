# data_scrub.sh 🌳

> "Structure isn't boring – it's your first line of clarity." — *You (probably during a cleanup)*

[![Install with Homebrew](https://img.shields.io/badge/brew--install-success-green?logo=homebrew)](https://github.com/raymonepping/homebrew-data_scrub.sh)
[![Version](https://img.shields.io/badge/version-1.1.0-blue)](https://github.com/raymonepping/homebrew-data_scrub.sh)

---

## 🧭 What Is This?

data_scrub.sh is a Homebrew-installable CLI that orchestrates **before/after state resets**, validation, and integrity checks for each challenge level in the *Vault Capture-The-Flag (CTF)* game.

Built for DevSecOps-style learning, it helps you:

- Revert or apply level-specific file changes
- Validate challenge progress and Vault integration
- Generate templated README docs per level
- Run full CTF resets safely and modularly

---

## 🚀 Quickstart

```bash
brew tap raymonepping/vault-ctf
brew install raymonepping/vault-ctf/data_scrub.sh
```

# List all levels
data_scrub.sh --list

# Reset level 1 to its original (vulnerable) state
data_scrub.sh --level 1 --state before

# Apply the secure (Vault-integrated) solution
data_scrub.sh --level 1 --state after

---

## 🔧 Customize (Optional)
export VAULT_CTF_HOME=/opt/homebrew/opt/data_scrub.sh/share/data_scrub.sh

---
## 📂 Project Structure

```
./
├── bin/
│   └── data_scrub.sh*
├── Formula/
├── lib/
│   ├── level_01.sh*
│   ├── level_02.sh*
│   ├── level_03.sh*
│   ├── level_04.sh*
│   ├── level_05.sh*
│   ├── level_06.sh*
│   ├── level_07.sh*
│   ├── level_08.sh*
│   ├── level_09.sh*
│   └── level_10.sh*
├── tpl/
│   ├── level_01_readme.tpl
│   ├── readme_01_header.tpl
│   ├── readme_02_project.tpl
│   ├── readme_03_structure.tpl
│   ├── readme_04_body.tpl
│   ├── readme_05_quote.tpl
│   ├── readme_06_article.tpl
│   └── readme_07_footer.tpl
├── package.json
├── README.md
└── restart-api.js

5 directories, 22 files
```

---

## 🔑 Key Features

- 🎯 Target specific challenge levels — or reset all at once
- ♻️ Toggle state: `before`, `after`, `validate`, `status`, or `init`
- 💥 Safe dry-run mode (`--dryrun`) to preview file transformations
- 🧩 Modular per-level logic (`lib/level_XX.sh`)
- 📄 Template-driven documentation support via `tpl/`
- ✅ Built-in self-checks (`--state validate`) to verify integrity

---

### 🔁 Reset a specific level to its vulnerable state

```bash
data_scrub.sh --level 1 --state before
```

### 🔐 Apply the secure Vault-based solution
```bash
data_scrub.sh --level 1 --state after
```

### ✅ Validate the transformation
```bash
data_scrub.sh --level 1 --state validate
```

### 🔄 Reset all levels with confirmation prompt
```bash
data_scrub.sh --level all --state before
```

### 🧪 Run dry-run for safety
```bash
data_scrub.sh --level 1 --state after --dryrun
```

---

### Auto-generate folder tree in Markdown
```bash
data_scrub.sh
```

### Use flags (skip wizard)
```bash
data_scrub.sh --output markdown --hidden
```

### Git mode: only tracked files
```bash
data_scrub.sh --git
```

### A preset (e.g. Terraform or Vue)
```bash
data_scrub.sh --preset terraform --output markdown
```

---

### ✨ Combine with

- `generate_project.sh` → create clean structure  
- `sanity_check.sh` → validate .gitignore / .dockerignore  
- `folder_tree` → auto-document structure  
- `commit_gh.sh` → push with clarity  

---

## 🧠 Philosophy

data_scrub.sh Vault Radar CTF isn’t just a game — it’s a hands-on, modular learning experience designed to:

- 🔐 Teach zero-trust security through real Vault usage
- 🧠 Blend DevOps, shell mastery, and secure coding under pressure
- ⚙️ Emphasize repeatability, traceability, and reversible change
- 📚 Turn lessons into muscle memory — one level at a time

> ""You don’t just capture flags — you capture knowledge, one secret at a time."

---
## 📘 Read the Full Medium.com article

📖 [Article](https://medium.com/continuous-insights/automating-project-structure-insights-with-folder-tree-ed18f683d7b0) 

---

© 2025 Raymon Epping  
🧠 Powered by folder_tree.sh — 🌐 Works locally, CI/CD, and via Brew
