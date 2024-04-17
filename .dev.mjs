import esbuild from "esbuild";

// Create a context for incremental builds
const context = await esbuild.context({
  entryPoints: ["src/script.ts"],
  bundle: true,
  sourcemap: true,
  outdir: "build",
  target: "es2022",
  platform: "browser",
  banner: {
    js: `new EventSource('/esbuild').addEventListener('change', () => location.reload());`,
  },
  logLevel: "info",
});

// Enable watch mode
await context.watch();

// Enable serve mode
await context.serve({
  servedir: ".",
});

// // Dispose of the context
// context.dispose();
