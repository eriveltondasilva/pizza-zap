import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: "esm",
  splitting: false,
  minify: false,
  sourcemap: true,
  clean: true,
  dts: true,
  tsconfig: "./tsconfig.json",
});
