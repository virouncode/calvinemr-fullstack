module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  env: {
    node: true,
    es6: true,
  },
  rules: {
    // Add or customize rules here
    "@typescript-eslint/no-explicit-any": "error", // Example rule to catch `any` types
    "@typescript-eslint/explicit-module-boundary-types": "off",
  },
};
