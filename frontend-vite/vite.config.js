import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/

export default defineConfig(({ mode }) => {
	// eslint-disable-next-line no-undef
	const env = loadEnv(mode, process.cwd(), '');
	return {
		plugins: [react(), svgr()],
		server: {
			watch: {
				usePolling: true,
			},
			host: true, // needed for the Docker Container port mapping to work
			strictPort: true,
			port: 3000, // you can replace this port with any port
		},
		define: {
			// 'process.env.YOUR_STRING_VARIABLE': JSON.stringify(env.YOUR_STRING_VARIABLE),
			// 'process.env.YOUR_BOOLEAN_VARIABLE': env.YOUR_BOOLEAN_VARIABLE,
			// If you want to exposes all env variables, which is not recommended
			'process.env': env,
		},
	};
});
