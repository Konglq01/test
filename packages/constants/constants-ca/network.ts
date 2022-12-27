import { ChainType, NetworkType } from '@portkey/types';

export type NetworkItem = {
  name: string;
  walletType: ChainType;
  networkType: NetworkType;
  isActive?: boolean;
  apiUrl: string;
};

export const NetworkList: NetworkItem[] = [
  {
    name: 'aelf Testnet',
    walletType: 'aelf',
    networkType: 'TESTNET',
    isActive: true,
    apiUrl: 'http://192.168.66.135:5577',
  },
  {
    name: 'aelf Mainnet',
    walletType: 'aelf',
    networkType: 'MAIN',
    apiUrl: '',
  },
];

export const ChainList = [
  {
    rpcUrl: 'http://192.168.67.77:8000',
    chainId: 'AELF',
    caContractAddress: '2LUmicHyH4RXrMjG4beDwuDsiWJESyLkgkwPdGTR8kahRzq5XS',
  },
  {
    rpcUrl: 'http://192.168.67.206:8000',
    chainId: 'tDVV',
    caContractAddress: 'RXcxgSXuagn8RrvhQAV81Z652EEYSwR6JLnqHYJ5UVpEptW8Y',
  },
];

export const DefaultChain = 'AELF';
