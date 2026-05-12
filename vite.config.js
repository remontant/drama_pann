var _a;
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
export default defineConfig({
    base: (_a = process.env.VITE_BASE_PATH) !== null && _a !== void 0 ? _a : '/dramapann/',
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
});
