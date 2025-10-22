import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import path from 'path';

export default [
  ...tseslint.config({
    files: ['**/*.ts'],
    extends: [...tseslint.configs.recommended, prettier],
    parserOptions: {
      tsconfigRootDir: __dirname, // root of the server folder
      project: [path.resolve(__dirname, 'tsconfig.json')], // server tsconfig
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
    },
  }),
];
