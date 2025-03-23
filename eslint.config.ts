import { MobileConfig } from '@cdek/eslint-config-mobile'
import tseslint from 'typescript-eslint'

export default tseslint.config([
  ...MobileConfig,
  { ignores: ['dist/**/*', '.storybook/**/*'] },
])
