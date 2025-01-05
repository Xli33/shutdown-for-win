import pluginVue from 'eslint-plugin-vue'
import vueTsEslintConfig from '@vue/eslint-config-typescript'
import pluginVitest from '@vitest/eslint-plugin'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default [
  {
    name: 'app/files-to-lint',
    files: [
      // '*.{ts,cjs}',
      'src/main/*.ts',
      'src/preload/*.ts',
      'src/renderer/src/**/*.{ts,mts,tsx,vue}'
    ]
  },

  {
    name: 'app/files-to-ignore',
    ignores: [
      '**/*.d.ts',
      '**/dist/**',
      '**/dist-ssr/**',
      '**/coverage/**',
      'out/*',
      'resources/*',
      'src/renderer/*.*',
      'src/renderer/public/*'
    ]
  },

  ...pluginVue.configs['flat/essential'],
  ...vueTsEslintConfig(),

  {
    ...pluginVitest.configs.recommended,
    files: ['src/**/__tests__/*']
  },
  skipFormatting,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'vue/multi-word-component-names': 'off'
    }
  }
]
