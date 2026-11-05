import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { execSync } from 'node:child_process';

const DEFAULT_PORT = 5180;
const DEFAULT_API = 'http://localhost:4001';

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

    if (!command) return `a process (PID ${pid})`;

    const match = command.match(/Proyectos_Mideros[\\/]([^\\"]+?)[\\/]+([^\\"\s]+)/);
    if (match) return `PID ${pid} de ${match[1]}/${match[2]}`;
    return `PID ${pid}`;
  }

  return null;
}

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
  }

  return null;
}

function buildVersion() {
  return {
    name: 'babytrack-build-version',
    apply: 'build',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'version.json',
        source: JSON.stringify({
          commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? 'local',
          builtAt: new Date().toISOString(),
        }),
      });
    },
  };
}

export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const port = Number(env.VITE_PORT ?? DEFAULT_PORT);
  const apiTarget = env.VITE_PROXY_TARGET ?? DEFAULT_API;

  const owner = command === 'build' ? null : describePortOwner(port);

  if (owner) {
    console.error('');
    console.error(`  Port ${port} is already in use by ${owner}.`);
    console.error('  BabyTrack uses its own ports so projects do not collide.');
    console.error('');
    console.error('  Free the port:');
    console.error('    taskkill /PID <number> /F');
    console.error('');
    console.error('  Or change the BabyTrack port in Fron_Babi/.env:');
    console.error('    VITE_PORT=5181');
    console.error('');
    process.exit(1);
  }

  return {
    plugins: [react(), buildVersion()],
    define: {
      'import.meta.env.VITE_BUILD_COMMIT': JSON.stringify(
        process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? '',
      ),
    },
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
