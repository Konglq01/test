import { ApolloClient, HttpLink, InMemoryCache, NormalizedCacheObject } from '@apollo/client';
import { NetworkType } from '@portkey/types';
import { NetworkList } from '@portkey/constants/constants-ca/network';

const createApolloClient = (networkType: NetworkType) =>
  new ApolloClient({
    cache: new InMemoryCache(),
    queryDeduplication: false,
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
      },
      query: {
        fetchPolicy: 'network-only',
      },
    },
    link: new HttpLink({ uri: NetworkList.find(item => item.networkType === networkType)?.graphqlUrl || '' }),
  });

export const networkClientMap: Record<NetworkType, ApolloClient<NormalizedCacheObject>> = {
  ['MAIN']: createApolloClient('MAIN'),
  ['TESTNET']: createApolloClient('TESTNET'),
};

export const getApolloClient = (networkType: NetworkType) => {
  return networkClientMap[networkType];
};
