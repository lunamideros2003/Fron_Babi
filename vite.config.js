import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { execSync } from 'node:child_process';

// Puerto dedicado de BabyTrack. No se comparte con ningun otro proyecto para
// evitar que dos aplicaciones distintas respondan en la misma direccion.
const DEFAULT_PORT = 5180;
const DEFAULT_API = 'http://localhost:4001';

function describePortOwner(port) {
  try {
    const isWindows = process.platform === 'win32';
    const output = execSync(
      isWindows ? `netstat -ano | findstr :${port}` : `lsof -ti :${port}`,
      { encoding: 'utf8' },
    );

    const pids = isWindows
      ? output
          .split('\n')
          .filter((line) => line.includes('LISTENING'))
          .map((line) => Number(line.trim().split(/\s+/).pop()))
          .filter(Boolean)
      : output.split('\n').map((n) => Number(n.trim())).filter(Boolean);

    for (const pid of [...new Set(pids)]) {
      let command = '';
      try {
        command = execSync(`wmic process where processid=${pid} get CommandLine /value`, {
          encoding: 'utf8',
        });
      } catch {
        try {
          command = execSync(`ps -p ${pid} -o command=`, { encoding: 'utf8' });
        } catch {
          continue;
        }
      }

      const match = command.match(/Proyectos_Mideros[\\/]([^\\"]+?)[\\/]+([^\\"\s]+)/);
      if (match) return `PID ${pid} de ${match[1]}/${match[2]}`;
      return `PID ${pid}`;
    }
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
