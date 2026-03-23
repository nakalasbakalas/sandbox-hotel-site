import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    // Global linter options — suppress warnings for legitimate eslint-disable comments
    linterOptions: {
      reportUnusedDisableDirectives: false,
    },
  },
  {
    // Worker source + tests
    files: ["src/**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        // Cloudflare Workers globals
        Request: "readonly",
        Response: "readonly",
        URL: "readonly",
        URLSearchParams: "readonly",
        Headers: "readonly",
        fetch: "readonly",
        crypto: "readonly",
        atob: "readonly",
        btoa: "readonly",
        TextEncoder: "readonly",
        TextDecoder: "readonly",
        console: "readonly",
        // Node.js test globals (index.test.js)
        process: "readonly",
      },
    },
    rules: {
      "no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "no-console": "off",
      "eqeqeq": ["error", "always", { "null": "ignore" }],
      "no-empty": ["error", { "allowEmptyCatch": true }],
      "no-var": "error",
      "prefer-const": "warn",
    },
  },
  {
    // Browser-side JS (homepage + admin)
    files: ["public/assets/js/**/*.js", "public/admin/app.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "script",
      globals: {
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        location: "readonly",
        history: "readonly",
        console: "readonly",
        fetch: "readonly",
        URL: "readonly",
        URLSearchParams: "readonly",
        localStorage: "readonly",
        sessionStorage: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        requestAnimationFrame: "readonly",
        cancelAnimationFrame: "readonly",
        IntersectionObserver: "readonly",
        ResizeObserver: "readonly",
        MutationObserver: "readonly",
        Event: "readonly",
        CustomEvent: "readonly",
        Element: "readonly",
        HTMLElement: "readonly",
        HTMLFormElement: "readonly",
        Node: "readonly",
        NodeList: "readonly",
        FormData: "readonly",
        XMLHttpRequest: "readonly",
        alert: "readonly",
        confirm: "readonly",
        gtag: "readonly",
      },
    },
    rules: {
      "no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "no-console": "off",
      "eqeqeq": ["error", "always", { "null": "ignore" }],
      "no-empty": ["error", { "allowEmptyCatch": true }],
      "no-var": "warn",
    },
  },
  {
    // Node.js utility scripts
    files: ["scripts/**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        process: "readonly",
        console: "readonly",
      },
    },
    rules: {
      "no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "no-console": "off",
      "eqeqeq": ["error", "always", { "null": "ignore" }],
      "no-empty": ["error", { "allowEmptyCatch": true }],
      "no-var": "error",
      "prefer-const": "warn",
    },
  },
  {
    ignores: [
      "node_modules/**",
      "packages/pms/**",
      "packages/api/**",
      "packages/shared/**",
      "packages/web/**",
      ".wrangler/**",
    ],
  },
];
