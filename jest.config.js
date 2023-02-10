/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  displayName: 'portkey',
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  coverageDirectory: 'coverage',
  testMatch: [
    // '<rootDir>/packages/hooks/**/*.test.{ts,tsx}',
    // '<rootDir>/packages/utils/**/*.test.{ts,tsx}',
    // '<rootDir>/packages/store/**/*.test.{ts,tsx}',
    // '<rootDir>/packages/web-extension-ca/**/*.test.tsx',
    // '<rootDir>/packages/web-extension-ca/app/web/store/reducers/**/*.test.{ts,tsx}',

    '<rootDir>/packages/store/store-ca/wallet/*.test.{ts,tsx}',
  ],
  // testMatch: ['<rootDir>/test/**/*.test.tsx', '<rootDir>/packages/hooks/**/*.test.tsx'],
  collectCoverageFrom: [
    // '**/packages/hooks/hooks-ca/**/*.{ts,tsx}',
    // 'packages/web-extension-ca/app/web/components/DropdownSearch/*.{ts,tsx}',
    // '**/packages/store/store-ca/guardians/*.{ts,tsx}',
    '**/packages/store/store-ca/wallet/*.{ts,tsx}',
    // '**/packages/web-extension-ca/app/web/store/reducers/**/*.{ts,tsx}',
    // '**/packages/utils/wallet/*.ts',
    '!**/node_modules/**',
  ],
  moduleNameMapper: {
    '\\.(css|less)$': 'identity-obj-proxy',
  },
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
