import { NetworkType } from '@portkey/types';

export const NETWORK_CONFIG: {
  [key in NetworkType]: {
    name: string;
    nameEn: string;
    url: string;
  };
} = {
  MAIN: {
    name: '主网',
    nameEn: 'MAIN',
    url: 'https://app-wallet-api.aelf.io',
  },
  TESTNET: {
    name: '测试网',
    nameEn: 'TESTNET',
    url: 'https://wallet-app-api-test.aelf.io',
  },
} as const;
