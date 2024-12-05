import eslint from "@eslint/js";
import tseslint from 'typescript-eslint';
import tsParser from "@typescript-eslint/parser";
import globals from "globals";

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts"],

    rules: {
      "@typescript-eslint/no-explicit-any": 0,
    },

    languageOptions: {
      globals: {
        ...globals.builtin,
        ...globals.nodeBuiltin,
        ...globals.browser,
      },

      parser: tsParser,
      ecmaVersion: 2016,
      sourceType: "module",
    },
  }
];
