import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';

export default defineConfig({
    server: {
        port: 3000,
    },
    plugins: [eslint()],
});