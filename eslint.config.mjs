import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import prettierPlugin from "eslint-plugin-prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.extends("next/core-web-vitals", "next/typescript"),
    // Add Prettier plugin and config
    {
        files: ["**/*.{js,jsx,ts,tsx}"],
        plugins: {
            prettier: prettierPlugin,
        },
        rules: {
            "prettier/prettier": "error", // Show prettier issues as ESLint errors
        },
    },
    ...compat.extends("prettier"), // turns off ESLint rules that conflict with Prettier
];

export default eslintConfig;
