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

mkdir -p "${TOTA_HOME}/soul" "${TOTA_HOME}/memory" "${TOTA_HOME}/logs" "${TOTA_HOME}/backups" "${TOTA_HOME}/runtime"
mkdir -p "${ROOT}/nova-workspace/notas" "${ROOT}/nova-workspace/docs" "${ROOT}/nova-workspace/scripts"
mkdir -p "${ROOT}/ollama/bin" "${ROOT}/ollama/models" "${ROOT}/pw-browsers"

if [ -f "${ROOT}/.env" ]; then
  set -a
  # shellcheck disable=SC1091
  source "${ROOT}/.env"
  set +a
else
  echo "[Nova] AVISO: Falta ${ROOT}/.env con TELEGRAM_BOT_TOKEN. Ejecuta: bash setup-nova.sh"
  exit 1
fi

if ! command -v tota >/dev/null 2>&1; then
  echo "[Nova] Instalando tota-agent..."
  if ! npm install -g tota-agent 2>/dev/null; then
    npm install --prefix "${TOTA_HOME}/runtime" tota-agent
  fi
fi

if [ -z "$(ls -A "${ROOT}/pw-browsers" 2>/dev/null)" ]; then
  echo "[Nova] Descargando Chromium headless para Playwright..."
  npx --yes playwright install chromium
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
  echo "[Nova] Arrancando tota-agent (Telegram + Playwright)..."
  tota up --config "${TOTA_HOME}/tota.config.json" >> "${TOTA_HOME}/logs/nova-agent.log" 2>&1 || true
  echo "[Nova] Proceso detenido. Reiniciando en 5 segundos..."
  sleep 5
done
