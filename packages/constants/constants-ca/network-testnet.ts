import { NetworkItem } from '@portkey/types/types-ca/network';

export const NetworkList: NetworkItem[] = [
  {
    name: 'aelf Testnet',
    walletType: 'aelf',
    networkType: 'TESTNET',
    isActive: true,
    apiUrl: 'https://did-portkey-test.portkey.finance',
    graphqlUrl: 'https://dapp-portkey-test.portkey.finance/Portkey_DID/PortKeyIndexerCASchema/graphql',
  },
  {
    name: 'aelf Mainnet',
    walletType: 'aelf',
    networkType: 'MAIN',
    apiUrl: '',
    graphqlUrl: '',
  },
];

export const DefaultChainId = 'AELF';
