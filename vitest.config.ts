import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

/**
 * Vitest needs the same `@/*` alias `tsconfig.json` gives the app, otherwise
 * tests have to import through relative paths that break the moment a file
 * moves.
 */
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
});
