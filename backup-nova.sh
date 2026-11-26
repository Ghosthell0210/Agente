#!/usr/bin/env bash
set -euo pipefail

# ==========================================================
# Backup seguro de Nova (SQLite hot-copy + Soul + Logs)
# ==========================================================
if [ -d "/home/container" ] && [ -w "/home/container" ]; then
  ROOT="/home/container"
else
  ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
fi
TOTA_HOME="${ROOT}/.tota"
BACKUP_DIR="${TOTA_HOME}/backups"
STAMP="$(date +%Y-%m-%d_%H-%M)"
TMP_DIR="${BACKUP_DIR}/tmp_$STAMP"
ARCHIVE="${BACKUP_DIR}/nova-backup-$STAMP.tar.gz"

mkdir -p "$TMP_DIR"

if [ -f "${TOTA_HOME}/memory/nova-brain.db" ]; then
  sqlite3 "${TOTA_HOME}/memory/nova-brain.db" ".backup '$TMP_DIR/nova-brain.db'"
fi

cp -r "${TOTA_HOME}/soul" "$TMP_DIR/soul"
cp "${TOTA_HOME}/tota.config.json" "$TMP_DIR/tota.config.json" 2>/dev/null || true

tar -czf "$ARCHIVE" -C "$TMP_DIR" .
rm -rf "$TMP_DIR"

ls -1t "$BACKUP_DIR"/nova-backup-*.tar.gz 2>/dev/null | tail -n +15 | xargs -r rm --

for logfile in "${TOTA_HOME}/logs/"*.log; do
  [ -f "$logfile" ] || continue
  SIZE=$(wc -c < "$logfile")
  if [ "$SIZE" -gt 20971520 ]; then
    tail -n 2000 "$logfile" > "$logfile.tmp" && mv "$logfile.tmp" "$logfile"
  fi
done

echo "[Backup] Completado: $ARCHIVE"
