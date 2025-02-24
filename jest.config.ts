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
  maxWorkers: 4,
  rootDir: '.',
  moduleNameMapper: {
    '\\.svg': '<rootDir>/__mocks__/svgMock.js',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
}

export default config
