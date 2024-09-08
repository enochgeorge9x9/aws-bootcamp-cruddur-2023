import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
// https://vitejs.dev/config/

export default defineConfig(() => {
	// eslint-disable-next-line no-undef

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
	};
});
