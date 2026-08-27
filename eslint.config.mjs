import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Vendored ffmpeg.wasm core, copied verbatim from @ffmpeg/core — not
    // authored here, shouldn't be linted (see lib/videoCompression.ts).
    "public/ffmpeg/**",
  ]),
]);

export default eslintConfig;
