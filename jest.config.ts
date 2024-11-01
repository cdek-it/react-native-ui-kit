import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  preset: 'jest-expo',
  collectCoverage: true,
  coverageDirectory: 'artifacts/reports/unit/coverage',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testRunner: 'jest-circus',
  maxWorkers: 4,
  rootDir: '.',
  moduleNameMapper: {
    '\\.svg': '<rootDir>/__mocks__/svgMock.js',
  },
  setupFiles: ['<rootDir>/jest.setup.js'],
}

export default config
