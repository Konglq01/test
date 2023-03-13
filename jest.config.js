/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  displayName: 'portkey',
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  coverageDirectory: 'coverage',
  testMatch: [
    '<rootDir>/packages/hooks/**/*.test.{ts,tsx}',
    '<rootDir>/packages/utils/**/*.test.{ts,tsx}',
    '<rootDir>/packages/store/**/*.test.{ts,tsx}',
    '<rootDir>/packages/web-extension-ca/**/*.test.tsx',
  ],
  // testMatch: ['<rootDir>/test/**/*.test.tsx', '<rootDir>/packages/hooks/**/*.test.tsx'],
  collectCoverageFrom: [
    '**/packages/hooks/hooks-ca/**/*.{ts,tsx}',
    'packages/web-extension-ca/app/web/components/DropdownSearch/*.{ts,tsx}',
    '**/packages/store/store-ca/guardians/*.{ts,tsx}',
    '**/packages/utils/wallet/*.ts',
    '!**/node_modules/**',
  ],
  moduleNameMapper: {
    '\\.(css|less)$': 'identity-obj-proxy',
  },

  // transform: {
  //   '^.+\\.(ts|tsx)$': [
  //     'ts-jest',
  //     {
  //       babelConfig: {
  //         presets: ['@babel/preset-typescript', '@babel/preset-react'],
  //         plugins: ['@babel/plugin-transform-modules-commonjs'],
  //       },
  //       babelConfig: './packages/web-extension-ca/.babelrc',
  //     },
  //   ],
  // },
  // transformIgnorePatterns: ['/node_modules/'],

  projects: [
    {
      displayName: 'hooks',
      preset: 'ts-jest',
      testMatch: ['<rootDir>/packages/web-extension-ca/app/web/hooks/useNetwork.test.{ts,tsx}'],
      testEnvironment: 'jsdom',
      transform: {
        '^.+\\.(ts|tsx)$': [
          `ts-jest`,
          { isolatedModules: true, tsconfig: './packages/web-extension-ca/tsconfig.json' },
        ],
      },
      roots: ['<rootDir>/packages/web-extension-ca'],
      moduleNameMapper: {
        '^utils/(.*)$': '<rootDir>/packages/web-extension-ca/app/web/utils/$1',
        '^store/(.*)$': '<rootDir>/packages/web-extension-ca/app/web/store/$1',
        '^constants/(.*)$': '<rootDir>/packages/web-extension-ca/app/web/constants/$1',
        '^messages/(.*)$': '<rootDir>/packages/web-extension-ca/app/web/messages/$1',
      },
    },
  ],
};
