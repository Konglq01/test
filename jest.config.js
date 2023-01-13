/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  displayName: 'portkey',
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  // testMatch: [
  //   '<rootDir>/packages/hooks/**/*.test.ts',
  //   '<rootDir>/packages/store/**/*.test.ts'
  // ],
  projects: [
    {
      displayName: 'hooks',
      preset: 'ts-jest',
      testMatch: [
        '<rootDir>/packages/hooks/**/*.test.ts'
      ]
    },
    {
      displayName: 'store',
      preset: 'ts-jest',
      testMatch: [
        '<rootDir>/packages/store/**/*.test.ts'
      ]
    }
  ]
};