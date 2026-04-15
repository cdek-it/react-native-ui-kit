import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  preset: 'jest-expo',
  cache: true,
  cacheDirectory: '.jest/cache',
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{ts,tsx}',
    '!**/*.stories.{ts,tsx}',
    '!**/index.ts',
    '!**/types.ts',
  ],
  coverageReporters: ['text', 'text-summary'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testRunner: 'jest-circus',
  maxWorkers: '100%',
  rootDir: '.',
  moduleNameMapper: {
    '\\.svg': '<rootDir>/__mocks__/svgMock.js',
    '^react-native-worklets$': 'react-native-worklets/lib/module/mock',
  },
  setupFiles: ['<rootDir>/jest.setup.ts'],
  setupFilesAfterEnv: ['jest-extended/all'],
}

export default config
