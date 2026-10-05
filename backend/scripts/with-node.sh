#!/usr/bin/env bash
set -euo pipefail

export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
# shellcheck disable=SC1091
if [ -s "$NVM_DIR/nvm.sh" ]; then
  . "$NVM_DIR/nvm.sh"
else
  echo "nvm not found at $NVM_DIR. Install nvm or use Node >= 20." >&2
  exit 1
fi

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if [ -f .nvmrc ]; then
  nvm use >/dev/null
fi

# Prefer local binaries over any globally installed Nest CLI
export PATH="$ROOT/node_modules/.bin:$PATH"

exec "$@"
