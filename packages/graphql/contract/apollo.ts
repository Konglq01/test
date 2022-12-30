import { ApolloClient, HttpLink, InMemoryCache, NormalizedCacheObject } from '@apollo/client';
import { NetworkType } from '@portkey/types';
import { CHAIN_GRAPHQL_URL } from '@portkey/constants/constants-ca/network';

const createApolloClient = (networkType: NetworkType) =>
  new ApolloClient({
    cache: new InMemoryCache(),
    queryDeduplication: false,
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
      },
    },
    link: new HttpLink({ uri: CHAIN_GRAPHQL_URL[networkType] }),
  });

export const networkClientMap: Record<NetworkType, ApolloClient<NormalizedCacheObject>> = {
  ['MAIN']: createApolloClient('MAIN'),
  ['TESTNET']: createApolloClient('TESTNET'),
};

export const getApolloClient = (networkType: NetworkType) => {
  return networkClientMap[networkType];
};
