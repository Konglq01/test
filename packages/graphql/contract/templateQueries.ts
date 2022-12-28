import { ApolloError, useQuery, gql } from '@apollo/client';
import { useMemo } from 'react';
import { apolloClient } from './apollo';

const query = gql`
  query FeeTierDistribution($token0: String!, $token1: String!) {
    _meta {
      block {
        number
      }
    }
    asToken0: pools(
      orderBy: totalValueLockedToken0
      orderDirection: desc
      where: { token0: $token0, token1: $token1 }
    ) {
      feeTier
      totalValueLockedToken0
      totalValueLockedToken1
    }
    asToken1: pools(
      orderBy: totalValueLockedToken0
      orderDirection: desc
      where: { token0: $token1, token1: $token0 }
    ) {
      feeTier
      totalValueLockedToken0
      totalValueLockedToken1
    }
  }
`;

// TODO: data type need to adjust
const useFeeTierDistributionQuery = (
  token0: string | undefined,
  token1: string | undefined,
  interval: number,
): { error: ApolloError | undefined; isLoading: boolean; data: any } => {
  const {
    data,
    loading: isLoading,
    error,
  } = useQuery(query, {
    variables: {
      token0: token0?.toLowerCase(),
      token1: token1?.toLowerCase(),
    },
    pollInterval: interval,
    client: apolloClient,
  });

  return useMemo(
    () => ({
      error,
      isLoading,
      data,
    }),
    [data, error, isLoading],
  );
};

export { useFeeTierDistributionQuery };
