import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve());
  const apiUrl = env.VITE_API_URL;

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api/': apiUrl,
        '/uploads/':apiUrl,
        '/profile/':apiUrl,
      },
    },
  };
});