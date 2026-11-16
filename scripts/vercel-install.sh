#!/usr/bin/env bash
set -euo pipefail

# Vercel Root Directory must be the repo root (empty), not "client".
# If Root Directory is "client", --prefix client resolves to client/client.
if [[ ! -f client/package.json ]]; then
  echo "ERROR: client/package.json not found."
  echo "In Vercel → Project Settings → General → Root Directory, clear it (use repo root)."
  echo "Do not set Root Directory to \"client\" — /api routes live at the repo root."
  exit 1
fi

npm install
npm install --prefix client
