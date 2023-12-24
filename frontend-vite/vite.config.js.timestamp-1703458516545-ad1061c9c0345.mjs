// vite.config.js
import { defineConfig, loadEnv } from "file:///app/node_modules/vite/dist/node/index.js";
import react from "file:///app/node_modules/@vitejs/plugin-react/dist/index.mjs";
import svgr from "file:///app/node_modules/vite-plugin-svgr/dist/index.js";
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react(), svgr()],
    server: {
      watch: {
        usePolling: true
      },
      host: true,
      // needed for the Docker Container port mapping to work
      strictPort: true,
      port: 3e3
      // you can replace this port with any port
    },
    define: {
      // 'process.env.YOUR_STRING_VARIABLE': JSON.stringify(env.YOUR_STRING_VARIABLE),
      // 'process.env.YOUR_BOOLEAN_VARIABLE': env.YOUR_BOOLEAN_VARIABLE,
      // If you want to exposes all env variables, which is not recommended
      "process.env": env
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvYXBwXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvYXBwL3ZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9hcHAvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgc3ZnciBmcm9tICd2aXRlLXBsdWdpbi1zdmdyJztcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4ge1xuXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZWZcblx0Y29uc3QgZW52ID0gbG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpLCAnJyk7XG5cdHJldHVybiB7XG5cdFx0cGx1Z2luczogW3JlYWN0KCksIHN2Z3IoKV0sXG5cdFx0c2VydmVyOiB7XG5cdFx0XHR3YXRjaDoge1xuXHRcdFx0XHR1c2VQb2xsaW5nOiB0cnVlLFxuXHRcdFx0fSxcblx0XHRcdGhvc3Q6IHRydWUsIC8vIG5lZWRlZCBmb3IgdGhlIERvY2tlciBDb250YWluZXIgcG9ydCBtYXBwaW5nIHRvIHdvcmtcblx0XHRcdHN0cmljdFBvcnQ6IHRydWUsXG5cdFx0XHRwb3J0OiAzMDAwLCAvLyB5b3UgY2FuIHJlcGxhY2UgdGhpcyBwb3J0IHdpdGggYW55IHBvcnRcblx0XHR9LFxuXHRcdGRlZmluZToge1xuXHRcdFx0Ly8gJ3Byb2Nlc3MuZW52LllPVVJfU1RSSU5HX1ZBUklBQkxFJzogSlNPTi5zdHJpbmdpZnkoZW52LllPVVJfU1RSSU5HX1ZBUklBQkxFKSxcblx0XHRcdC8vICdwcm9jZXNzLmVudi5ZT1VSX0JPT0xFQU5fVkFSSUFCTEUnOiBlbnYuWU9VUl9CT09MRUFOX1ZBUklBQkxFLFxuXHRcdFx0Ly8gSWYgeW91IHdhbnQgdG8gZXhwb3NlcyBhbGwgZW52IHZhcmlhYmxlcywgd2hpY2ggaXMgbm90IHJlY29tbWVuZGVkXG5cdFx0XHQncHJvY2Vzcy5lbnYnOiBlbnYsXG5cdFx0fSxcblx0fTtcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE4TCxTQUFTLGNBQWMsZUFBZTtBQUNwTyxPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBSWpCLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsS0FBSyxNQUFNO0FBRXpDLFFBQU0sTUFBTSxRQUFRLE1BQU0sUUFBUSxJQUFJLEdBQUcsRUFBRTtBQUMzQyxTQUFPO0FBQUEsSUFDTixTQUFTLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztBQUFBLElBQ3pCLFFBQVE7QUFBQSxNQUNQLE9BQU87QUFBQSxRQUNOLFlBQVk7QUFBQSxNQUNiO0FBQUEsTUFDQSxNQUFNO0FBQUE7QUFBQSxNQUNOLFlBQVk7QUFBQSxNQUNaLE1BQU07QUFBQTtBQUFBLElBQ1A7QUFBQSxJQUNBLFFBQVE7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQUlQLGVBQWU7QUFBQSxJQUNoQjtBQUFBLEVBQ0Q7QUFDRCxDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
