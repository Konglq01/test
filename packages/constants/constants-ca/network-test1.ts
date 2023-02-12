import { NetworkItem } from '@portkey/types/types-ca/network';

export const NetworkList: NetworkItem[] = [
  {
    name: 'aelf Testnet',
    walletType: 'aelf',
    networkType: 'TESTNET',
    isActive: true,
    apiUrl: 'http://192.168.66.38:5577',
    graphqlUrl: 'http://192.168.66.150:8083/AElfIndexer_DApp/PortKeyIndexerCASchema/graphql',
    connectUrl: 'http://192.168.66.38:8080',
  },
  {
    name: 'aelf Mainnet',
    walletType: 'aelf',
    networkType: 'MAIN',
    apiUrl: '',
    graphqlUrl: '',
    connectUrl: '',
  },
];

export const DefaultChainId = 'AELF';
