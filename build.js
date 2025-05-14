import esbuild from "esbuild";

const ctx = await esbuild.context({
  outdir: "dist",
  entryPoints: ["src/index.ts"],
  bundle: true,
  sourcemap: true,
});

await ctx.watch();
