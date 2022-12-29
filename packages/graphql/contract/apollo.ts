import { ApolloClient, HttpLink, InMemoryCache, NormalizedCacheObject } from '@apollo/client';
import { NetworkType } from '@portkey/types';

// TODO: hide url
const CHAIN_SUBGRAPH_URL: Record<NetworkType, string> = {
  ['MAIN']: '',
  ['TESTNET']: 'http://192.168.66.255:8083/AElfIndexer_DApp/PortKeyIndexerCASchema/graphql',
};

const createApolloClient = (networkType: NetworkType) =>
  new ApolloClient({
    cache: new InMemoryCache(),
    queryDeduplication: false,
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
      },
    },
    link: new HttpLink({ uri: CHAIN_SUBGRAPH_URL[networkType] }),
  });

export const networkClientMap: Record<NetworkType, ApolloClient<NormalizedCacheObject>> = {
  ['MAIN']: createApolloClient('MAIN'),
  ['TESTNET']: createApolloClient('TESTNET'),
};

export const getApolloClient = (networkType: NetworkType) => {
  return networkClientMap[networkType];
};
