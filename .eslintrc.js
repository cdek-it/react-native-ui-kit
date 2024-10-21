module.exports = {
  root: true,
  env: {
    es6: true,
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  extends: ["expo", "./configs/eslint/base", "./configs/eslint/typescript", "./configs/eslint/prettier", "./configs/eslint/import", "./configs/eslint/react"],
  parserOptions: {
    project: "./tsconfig.json"
  },
  settings: {
    react: {
      version: "detect"
    }
  }
}
