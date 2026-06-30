const sharedRules = {
  "no-unused-vars": ["error", { argsIgnorePattern: "^_", caughtErrors: "none" }],
};

export default [
  {
    ignores: [
      ".wrangler/**",
      "node_modules/**",
      "packages/pms/**",
    ],
    linterOptions: {
      reportUnusedDisableDirectives: "off",
    },
  },
  {
    files: ["src/**/*.js", "scripts/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        console: "readonly",
        crypto: "readonly",
        fetch: "readonly",
        globalThis: "readonly",
        Headers: "readonly",
        Intl: "readonly",
        Request: "readonly",
        Response: "readonly",
        TextEncoder: "readonly",
        URL: "readonly",
      },
    },
    rules: sharedRules,
  },
  {
    files: ["public/assets/js/**/*.js", "public/admin/app.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: {
        cancelAnimationFrame: "readonly",
        clearTimeout: "readonly",
        console: "readonly",
        CustomEvent: "readonly",
        document: "readonly",
        fetch: "readonly",
        FormData: "readonly",
        history: "readonly",
        HTMLElement: "readonly",
        IntersectionObserver: "readonly",
        localStorage: "readonly",
        location: "readonly",
        matchMedia: "readonly",
        MutationObserver: "readonly",
        navigator: "readonly",
        performance: "readonly",
        requestAnimationFrame: "readonly",
        setTimeout: "readonly",
        sessionStorage: "readonly",
        URL: "readonly",
        URLSearchParams: "readonly",
        window: "readonly",
      },
    },
    rules: {},
  },
];
