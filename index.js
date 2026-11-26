// Punto de entrada para Plugged Host (Calagopus Daemon / MAIN_FILE=index.js)
import fs from 'node:fs';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = __dirname;
const envPath = path.join(rootDir, '.env');
const setupDonePath = path.join(rootDir, '.tota', '.setup_complete');
const setupPath = path.join(rootDir, 'setup-nova.sh');
const startPath = path.join(rootDir, 'start-nova.sh');

if (!fs.existsSync(envPath) || !fs.existsSync(setupDonePath)) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const uid = process.env.TELEGRAM_ALLOWED_USER_ID;

  if (!fs.existsSync(envPath) && token && uid) {
    const content =
      [
        `TELEGRAM_BOT_TOKEN="${token}"`,
        `TELEGRAM_ALLOWED_USER_ID="${uid}"`,
        `HOME="${rootDir}"`,
        `TOTA_HOME="${rootDir}/.tota"`,
        `PLAYWRIGHT_BROWSERS_PATH="${rootDir}/pw-browsers"`,
        'OLLAMA_HOST="http://127.0.0.1:11434"',
        'PLUGGED_DB_ENGINE="mysql"',
      ].join('\n') + '\n';

    fs.writeFileSync(envPath, content, { mode: 0o600 });
    console.log('[Nova] .env generado desde variables del panel.');
  }

  if (fs.existsSync(setupPath)) {
    console.log('[Nova] Configuracion inicial pendiente. Ejecutando setup-nova.sh...');
    const res = spawnSync('bash', [setupPath], { stdio: 'inherit', cwd: rootDir });
    if (res.status !== 0) {
      process.exit(res.status ?? 1);
    }
  } else if (!fs.existsSync(envPath)) {
    console.error('[Nova] Falta .env y setup-nova.sh en ' + rootDir);
    process.exit(1);
  }
}

console.log('[Nova] Lanzando supervisor 24/7 (start-nova.sh)...');
const child = spawn('bash', [startPath], { stdio: 'inherit', cwd: rootDir });

process.on('SIGINT', () => child.kill('SIGINT'));
process.on('SIGTERM', () => child.kill('SIGTERM'));

child.on('exit', (code) => {
  process.exit(code ?? 0);
});
