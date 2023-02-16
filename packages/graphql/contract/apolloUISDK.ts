import { ApolloClient, HttpLink, InMemoryCache, NormalizedCacheObject } from '@apollo/client';

export const networkClientMap: Record<string, ApolloClient<NormalizedCacheObject>> = {};

const createApolloClient = (link: string) =>
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
    link: new HttpLink({ uri: link }),
  });

export const getApolloClientByUri = (uri: string) => {
  if (!networkClientMap[uri]) networkClientMap[uri] = createApolloClient(uri);
  return networkClientMap[uri];
};
