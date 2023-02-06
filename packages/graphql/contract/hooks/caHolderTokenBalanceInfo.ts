import * as Types from '../__generated__/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CaHolderTokenBalanceInfoQueryVariables = Types.Exact<{
  dto?: Types.InputMaybe<Types.GetCaHolderTokenBalanceDto>;
}>;

export type CaHolderTokenBalanceInfoQuery = {
  __typename?: 'Query';
  caHolderTokenBalanceInfo?: Array<{
    __typename?: 'CAHolderTokenBalanceDto';
    chainId?: string | null;
    caAddress?: string | null;
    balance: number;
    tokenInfo?: { __typename?: 'TokenInfo'; symbol?: string | null; decimals: number } | null;
  } | null> | null;
};

export const CaHolderTokenBalanceInfoDocument = gql`
  query caHolderTokenBalanceInfo($dto: GetCAHolderTokenBalanceDto) {
    caHolderTokenBalanceInfo(dto: $dto) {
      chainId
      caAddress
      tokenInfo {
        symbol
        decimals
      }
      balance
    }
  }
`;

/**
 * __useCaHolderTokenBalanceInfoQuery__
 *
 * To run a query within a React component, call `useCaHolderTokenBalanceInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useCaHolderTokenBalanceInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCaHolderTokenBalanceInfoQuery({
 *   variables: {
 *      dto: // value for 'dto'
 *   },
 * });
 */
export function useCaHolderTokenBalanceInfoQuery(
  baseOptions?: Apollo.QueryHookOptions<CaHolderTokenBalanceInfoQuery, CaHolderTokenBalanceInfoQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<CaHolderTokenBalanceInfoQuery, CaHolderTokenBalanceInfoQueryVariables>(
    CaHolderTokenBalanceInfoDocument,
    options,
  );
}
export function useCaHolderTokenBalanceInfoLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<CaHolderTokenBalanceInfoQuery, CaHolderTokenBalanceInfoQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<CaHolderTokenBalanceInfoQuery, CaHolderTokenBalanceInfoQueryVariables>(
    CaHolderTokenBalanceInfoDocument,
    options,
  );
}
export type CaHolderTokenBalanceInfoQueryHookResult = ReturnType<typeof useCaHolderTokenBalanceInfoQuery>;
export type CaHolderTokenBalanceInfoLazyQueryHookResult = ReturnType<typeof useCaHolderTokenBalanceInfoLazyQuery>;
export type CaHolderTokenBalanceInfoQueryResult = Apollo.QueryResult<
  CaHolderTokenBalanceInfoQuery,
  CaHolderTokenBalanceInfoQueryVariables
>;
