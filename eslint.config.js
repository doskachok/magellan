import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

// Roughly the rule set CRA's `react-app` config enforced before the move to Vite.
export default tseslint.config(
  { ignores: ['build', 'dev-dist'] },
  {
    files: ['**/*.{ts,tsx,js}'],
    languageOptions: {
      parser: tseslint.parser,
      globals: { ...globals.browser, ...globals.serviceworker },
    },
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
);
