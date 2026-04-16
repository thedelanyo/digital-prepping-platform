import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

const cert = "./certs/localhost.crt";
const key = "./certs/localhost.key";

export default defineConfig({
  server: { https: { cert, key }, proxy: {} },
  plugins: [sveltekit()],
});
