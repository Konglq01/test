/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  displayName: 'portkey',
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  coverageDirectory: 'coverage',
  testMatch: ['<rootDir>/test/**/*.test.tsx', '<rootDir>/packages/hooks/**/*.test.tsx'],
  collectCoverageFrom: ['**/packages/hooks/**/*.{ts,tsx}', '!**/node_modules/**'],

  // projects: [
  //   {
  //     displayName: 'hooks',
  //     preset: 'ts-jest',
  //     testMatch: [
  //       '<rootDir>/packages/hooks/**/*.test.tsx'
  //     ],
  //     testEnvironment: 'jsdom',
  //   },
  //   {
  //     displayName: 'store',
  //     preset: 'ts-jest',
  //     testMatch: [
  //       '<rootDir>/packages/store/**/*.test.tsx'
  //     ],
  //     testEnvironment: 'jsdom',
  //   }
  // ]
};
