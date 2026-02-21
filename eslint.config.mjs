import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  js.configs.recommended,
  ...compat.extends("next/core-web-vitals"),
  {
    ignores: [
      "src/generated/**",
      "node_modules/**",
      ".next/**",
      "**/*.d.ts",
    ],
  },
  {
    rules: {
      // Relax unused vars rules for better DX
      "no-unused-vars": "warn",
      // Allow unused imports in some cases
      "no-undef": "warn",
    },
  },
];

export default eslintConfig;
