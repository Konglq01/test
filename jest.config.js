/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  displayName: 'portkey',
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  coverageDirectory: 'coverage',
  testMatch: ['<rootDir>/packages/web-extension-ca/**/index.test.tsx'],
  // testMatch: ['<rootDir>/test/**/*.test.tsx', '<rootDir>/packages/hooks/**/*.test.tsx'],
  collectCoverageFrom: [
    '**/packages/hooks/hooks-ca/**/*.{ts,tsx}',
    'packages/web-extension-ca/app/web/components/DropdownSearch/*.{ts,tsx}',
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
