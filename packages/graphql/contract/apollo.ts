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

export const networkClientMap: Record<string, ApolloClient<NormalizedCacheObject>> = {};

export const getApolloClient = (networkType: NetworkType) => {
  if (!networkClientMap[networkType]) networkClientMap[networkType] = createApolloClient(networkType);
  return networkClientMap[networkType];
};
