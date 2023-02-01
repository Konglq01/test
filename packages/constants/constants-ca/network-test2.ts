import { NetworkItem } from '@portkey/types/types-ca/network';

export const NetworkList: NetworkItem[] = [
  {
    name: 'aelf Testnet',
    walletType: 'aelf',
    networkType: 'TESTNET',
    isActive: true,
    apiUrl: 'http://192.168.66.38:5577',
    graphqlUrl: 'http://192.168.66.150:8083/AElfIndexer_DApp/PortKeyIndexerCASchema/graphql',
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
