import { defineConfig, globalIgnores } from "eslint/config";
import tailwindCanonicalClasses from 'eslint-plugin-tailwind-canonical-classes';
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    plugins: {
      'tailwind-canonical-classes': tailwindCanonicalClasses,
    },
    rules: {
      'tailwind-canonical-classes/tailwind-canonical-classes': [
        'warn', // or 'error'
        {
          cssPath: './app/globals.css', // Required
          rootFontSize: 12, // Optional, default: 12
          calleeFunctions: ['cn', 'clsx'], // Optional, default: ['cn', 'clsx', 'classNames', 'twMerge', 'cva']
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
