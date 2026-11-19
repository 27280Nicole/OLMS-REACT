import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // Any request the React app makes to /api/... gets silently forwarded
    // to our Express server on port 4000. Without this, the browser would
    // try (and fail) to find /api/register on Vite's own port 5173, since
    // Vite only serves the frontend, not this API.
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
});
