import adapter from "@sveltejs/adapter-cloudflare";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  compilerOptions: {
    runes: ({ filename }) =>
      filename.split(/[/\\]/).includes("node_modules") ? undefined : true,
  },
  kit: {
    adapter: adapter(),
    alias: {
      $components: "src/components",
      $styles: "src/styles",
      $db: "src/db",
    },
  },
};

export default config;
