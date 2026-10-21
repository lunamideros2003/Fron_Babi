import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { execSync } from 'node:child_process';

// Puerto dedicado de BabyTrack. No se comparte con ningun otro proyecto para
// evitar que dos aplicaciones distintas respondan en la misma direccion.
const DEFAULT_PORT = 5180;
const DEFAULT_API = 'http://localhost:4001';

// Los errores de estos comandos no interesting: si la herramienta no existe,
// simplemente no hay forma de saber quien ocupa el puerto.
const SILENT = { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] };

function readCommand(command) {
  try {
    return execSync(command, SILENT);
  } catch {
    return '';
  }
}

function describePids(pids) {
  for (const pid of [...new Set(pids)].filter(Boolean)) {
    const command =
      readCommand(`wmic process where processid=${pid} get CommandLine /value`) ||
      readCommand(`ps -p ${pid} -o command=`);

    // Aunque no se pueda leer la linea de comandos, saber que el puerto esta
    // ocupado ya es motivo suficiente para avisar.
    if (!command) return `un proceso (PID ${pid})`;

    const match = command.match(/Proyectos_Mideros[\\/]([^\\"]+?)[\\/]+([^\\"\s]+)/);
    if (match) return `PID ${pid} de ${match[1]}/${match[2]}`;
    return `PID ${pid}`;
  }

  return null;
}

/**
 * Busca quien esta escuchando en un puerto.
 *
 * Windows usa netstat. En Linux `lsof` no siempre esta instalado (Vercel y
 * Docker no lo traen), por eso se prueban varias herramientas y, si ninguna
 * esta disponible, se sigue adelante sin avisar de nada.
 */
export function describePortOwner(port) {
  if (process.env.VERCEL || process.env.CI) return null;

  try {
    if (process.platform === 'win32') {
      const output = readCommand(`netstat -ano | findstr :${port}`);
      const pids = output
        .split('\n')
        .filter((line) => line.includes('LISTENING'))
        .map((line) => Number(line.trim().split(/\s+/).pop()))
        .filter(Boolean);

      return describePids(pids);
    }

    const lsof = readCommand(`lsof -ti :${port}`);
    if (lsof.trim()) {
      return describePids(lsof.split('\n').map((n) => Number(n.trim())).filter(Boolean));
    }

    const ss = readCommand(`ss -ltnp 2>/dev/null | grep ":${port}"`);
    if (ss.trim()) {
      return describePids([...ss.matchAll(/pid=(\d+)/g)].map((m) => Number(m[1])));
    }

    return null;
  } catch {
    /* nothing listening or the tool is unavailable */
  }

  return null;
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const port = Number(env.VITE_PORT ?? DEFAULT_PORT);
  const apiTarget = env.VITE_PROXY_TARGET ?? DEFAULT_API;

  const owner = describePortOwner(port);

  if (owner) {
    console.error('');
    console.error(`  El puerto ${port} ya esta ocupado por ${owner}.`);
    console.error('  BabyTrack usa puertos propios para no mezclarse con otros proyectos.');
    console.error('');
    console.error('  Libera el puerto:');
    console.error(`    taskkill /PID <numero> /F`);
    console.error('');
    console.error('  O cambia el puerto de BabyTrack en Fron_Babi/.env:');
    console.error(`    VITE_PORT=5181`);
    console.error('');
    process.exit(1);
  }

  return {
    plugins: [react()],
    server: {
      port,
      strictPort: true,
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
    preview: { port: port + 1, strictPort: true },
    build: {
      outDir: 'dist',
      sourcemap: false,
    },
  };
});
