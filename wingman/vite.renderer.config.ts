import type { ConfigEnv, UserConfig } from 'vite';

import { TanStackRouterVite } from '@tanstack/router-vite-plugin'
import { defineConfig } from 'vite';

import { pluginExposeRenderer } from './vite.base.config';

// https://vitejs.dev/config
export default defineConfig((env) => {
  const forgeEnv = env as ConfigEnv<'renderer'>;
  const { forgeConfigSelf, mode, root } = forgeEnv;
  const name = forgeConfigSelf.name ?? '';

  return {
    base: './',
    build: {
      outDir: `.vite/renderer/${name}`,
    },
    clearScreen: false,
    mode,
    plugins: [pluginExposeRenderer(name), TanStackRouterVite()],
    resolve: {
      preserveSymlinks: true,
    },
    root,
  } as UserConfig;
});
