import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import lit from "eslint-plugin-lit";
import tseslint from "typescript-eslint";

export default defineConfig({
  files: ["**/*.{js,ts}"],
  extends: [
    js.configs.recommended,
    tseslint.configs.recommended,
    lit.configs["flat/recommended"],
  ],
});
