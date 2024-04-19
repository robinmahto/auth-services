/* eslint-env node */
module.exports = {
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended-type-checked",
        "prettier",
    ],
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint"],
    root: true,
    parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
    },
    rules: {
        "dot-notation": "error",
        "@typescript-eslint/no-unused-vars": "off", // Handled by TypeScript
        "no-undef": "off",
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-misused-promises": "off",
        "@typescript-eslint/no-floating-promises": "off",
        "@typescript-eslint/no-unsafe-member-access":"off"
    },
};
