import { fixupConfigRules } from "@eslint/compat";
import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import reactJsx from "eslint-plugin-react/configs/jsx-runtime.js";
import react from "eslint-plugin-react/configs/recommended.js";
import globals from "globals";
import ts from "typescript-eslint";

export default [
  { languageOptions: { globals: globals.browser } },
  js.configs.recommended,
  ...ts.configs.recommendedTypeChecked,
  ...fixupConfigRules([
    {
      ...react,
      settings: {
        react: { version: "detect" }
      },
      languageOptions: {
        parserOptions: {
          projectService: true,
          tsconfigRootDir: import.meta.dirname
        }
      }
    },
    reactJsx
  ]),
  {
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
    plugins: {
      "react-hooks": reactHooks
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react/prop-types": "off"
    }
  },
  { ignores: ["**/dist/*", "rsbuild.config.mjs", "eslint.config.mjs"] }
];
