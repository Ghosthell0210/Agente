#!/usr/bin/env bash
set -euo pipefail

# ==========================================================
# Arranque 24/7 de Nova en Plugged Host (GitHub + sin systemd)
# ==========================================================
if [ -d "/home/container" ] && [ -w "/home/container" ]; then
  ROOT="/home/container"
else
  ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
fi
TOTA_HOME="${ROOT}/.tota"

export HOME="${ROOT}"
export TOTA_HOME="${TOTA_HOME}"
export PATH="${ROOT}/ollama/bin:${TOTA_HOME}/runtime/node_modules/.bin:$PATH"
export OLLAMA_HOST="127.0.0.1:11434"
export OLLAMA_MODELS="${ROOT}/ollama/models"
export OLLAMA_NUM_PARALLEL="1"
export OLLAMA_MAX_LOADED_MODELS="1"
export OLLAMA_KEEP_ALIVE="15m"
export PLAYWRIGHT_BROWSERS_PATH="${ROOT}/pw-browsers"
export TMPDIR="${ROOT}/.tmp"
export TEMP="${ROOT}/.tmp"
export TMP="${ROOT}/.tmp"
export npm_config_allow_git="all"

mkdir -p "${TOTA_HOME}/soul" "${TOTA_HOME}/memory" "${TOTA_HOME}/logs" "${TOTA_HOME}/backups" "${TOTA_HOME}/runtime"
mkdir -p "${ROOT}/nova-workspace/notas" "${ROOT}/nova-workspace/docs" "${ROOT}/nova-workspace/scripts"
mkdir -p "${ROOT}/ollama/bin" "${ROOT}/ollama/models" "${ROOT}/pw-browsers" "${ROOT}/.tmp"

if [ -f "${ROOT}/.env" ]; then
  set -a
  # shellcheck disable=SC1091
  source "${ROOT}/.env"
  set +a
  cp -f "${ROOT}/.env" "${TOTA_HOME}/.env"
  chmod 600 "${TOTA_HOME}/.env"
else
  echo "[Nova] AVISO: Falta ${ROOT}/.env con TELEGRAM_BOT_TOKEN. Ejecuta: bash setup-nova.sh"
  exit 1
fi

[ -f "${TOTA_HOME}/tota.config.json" ] && cp -f "${TOTA_HOME}/tota.config.json" "${TOTA_HOME}/config.json"
[ -f "${TOTA_HOME}/soul/SOUL.md" ] && cp -f "${TOTA_HOME}/soul/SOUL.md" "${TOTA_HOME}/soul/soul.md"

if [ ! -f "${TOTA_HOME}/tota.yaml" ] || ! grep -q "botToken:" "${TOTA_HOME}/tota.yaml" 2>/dev/null; then
  OWNER_VAL="${OWNER_NAME:-Cristian}"
  OLLAMA_V1_URL="${OLLAMA_HOST:-http://127.0.0.1:11434}"
  OLLAMA_V1_URL="${OLLAMA_V1_URL%/}"
  [[ "$OLLAMA_V1_URL" != */v1 ]] && OLLAMA_V1_URL="${OLLAMA_V1_URL}/v1"

  cat << EOF_YAML > "${TOTA_HOME}/tota.yaml"
identity:
  name: Nova
  owner: "${OWNER_VAL}"
  creator: Nova Blueprint
providers:
  default: ollamaLocal
  ollamaLocal:
    name: ollamaLocal
    apiKey: ""
    baseUrl: "${OLLAMA_V1_URL}"
    model: nova-qwen25
    enabled: true
channels:
  telegram:
    enabled: true
    botToken: "${TELEGRAM_BOT_TOKEN}"
    webhookUrl: ""
    allowedChatIds:
      - ${TELEGRAM_ALLOWED_USER_ID}
    streaming: true
    admins:
      - userId: ${TELEGRAM_ALLOWED_USER_ID}
        chatId: ${TELEGRAM_ALLOWED_USER_ID}
        username: "${OWNER_VAL}"
        approvedAt: "2026-11-26T00:00:00.000Z"
    members: []
    pending: []
  api:
    enabled: false
    port: 3001
    apiKey: ""
  whatsapp:
    enabled: false
  ui:
    enabled: false
    port: 3002
webSearch:
  enabled: true
  provider: auto
  maxResults: 5
memory:
  shortTermMaxMessages: 20
  secondBrain:
    enabled: true
    maxRecords: 50
heartbeat:
  intervalMinutes: 60
tokens:
  dailyBudget: 1000000
capabilities:
  computer:
    enabled: false
EOF_YAML
  chmod 600 "${TOTA_HOME}/tota.yaml"
  echo "[Nova] tota.yaml generado para Telegram + Ollama (nova-qwen25)."
fi

if ! command -v tota >/dev/null 2>&1 || [ ! -f "${TOTA_HOME}/runtime/node_modules/better-sqlite3/build/Release/better_sqlite3.node" ]; then
  echo "[Nova] Instalando/reparando tota-agent y binarios SQLite en ${TOTA_HOME}/runtime..."
  printf 'allow-git=all\n' > "${TOTA_HOME}/runtime/.npmrc"
  if [ ! -f "${TOTA_HOME}/runtime/package.json" ]; then
    cat << 'EOF_RT_PKG' > "${TOTA_HOME}/runtime/package.json"
{
  "name": "nova-tota-runtime",
  "version": "1.0.0",
  "private": true,
  "allowScripts": {
    "better-sqlite3": true,
    "protobufjs": true,
    "keytar": true,
    "@whiskeysockets/baileys": true
  }
}
EOF_RT_PKG
  fi
  npm install --prefix "${TOTA_HOME}/runtime" tota-agent playwright
  if [ ! -f "${TOTA_HOME}/runtime/node_modules/better-sqlite3/build/Release/better_sqlite3.node" ]; then
    (cd "${TOTA_HOME}/runtime" && npm install-scripts approve better-sqlite3 protobufjs keytar @whiskeysockets/baileys >/dev/null 2>&1 || true)
    npm rebuild --prefix "${TOTA_HOME}/runtime" better-sqlite3 keytar protobufjs || true
  fi
fi

if ! find "${ROOT}/pw-browsers" -maxdepth 4 -type f \( -name "chrome" -o -name "chrome-headless-shell" \) 2>/dev/null | grep -q .; then
  echo "[Nova] Descargando Chromium headless para Playwright en ${ROOT}/pw-browsers..."
  if [ -x "${TOTA_HOME}/runtime/node_modules/.bin/playwright" ]; then
    "${TOTA_HOME}/runtime/node_modules/.bin/playwright" install chromium
  else
    npm install --prefix "${TOTA_HOME}/runtime" --no-save playwright >/dev/null 2>&1 || true
    "${TOTA_HOME}/runtime/node_modules/.bin/playwright" install chromium || npx --yes playwright install chromium
  fi
  rm -rf "${ROOT}/.tmp/"* 2>/dev/null || true
fi

echo "[Nova] Iniciando servidor Ollama local..."
ollama serve > "${TOTA_HOME}/logs/ollama.log" 2>&1 &
OLLAMA_PID=$!

for i in $(seq 1 30); do
  if curl -sf "http://127.0.0.1:11434/api/tags" >/dev/null 2>&1; then
    break
  fi
  sleep 1
done

if ! ollama list | grep -q "qwen2.5:7b"; then
  echo "[Nova] Descargando modelo base qwen2.5:7b..."
  ollama pull "qwen2.5:7b"
fi

if [ -f "${TOTA_HOME}/Modelfile.nova" ]; then
  echo "[Nova] Actualizando Modelfile de Nova..."
  ollama create nova-qwen25 -f "${TOTA_HOME}/Modelfile.nova"
fi

cleanup() {
  echo "[Nova] Apagado limpio de procesos..."
  kill "$OLLAMA_PID" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

while true; do
  echo "[Nova] Arrancando tota-agent (Telegram + Ollama + Playwright)..."
  set +e
  if tota --help 2>/dev/null | grep -qw "start"; then
    tota start --daemon --verbose < /dev/null 2>&1 | tee -a "${TOTA_HOME}/logs/nova-agent.log"
  else
    tota up --config "${TOTA_HOME}/tota.config.json" < /dev/null 2>&1 | tee -a "${TOTA_HOME}/logs/nova-agent.log"
  fi
  EXIT_CODE=${PIPESTATUS[0]}
  set -e
  echo "[Nova] Proceso detenido (codigo $EXIT_CODE). Reiniciando en 5 segundos..."
  sleep 5
done

