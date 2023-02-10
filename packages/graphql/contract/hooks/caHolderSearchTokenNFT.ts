import * as Types from '../__generated__/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CaHolderSearchTokenNftQueryVariables = Types.Exact<{
  dto?: Types.InputMaybe<Types.GetCaHolderSearchTokenNftDto>;
}>;

export type CaHolderSearchTokenNftQuery = {
  __typename?: 'Query';
  caHolderSearchTokenNFT?: Array<{
    __typename?: 'CAHolderSearchTokenNFTDto';
    chainId?: string | null;
    caAddress?: string | null;
    balance: number;
    tokenInfo?: {
      __typename?: 'TokenSearchInfoDto';
      symbol?: string | null;
      tokenContractAddress?: string | null;
      decimals: number;
      totalSupply: number;
      tokenName?: string | null;
      issuer?: string | null;
      isBurnable: boolean;
      issueChainId: number;
    } | null;
    nftInfo?: {
      __typename?: 'NFTSearchInfoDto';
      protocolName?: string | null;
      symbol?: string | null;
      tokenId: number;
      nftContractAddress?: string | null;
      owner?: string | null;
      minter?: string | null;
      quantity: number;
      alias?: string | null;
      baseUri?: string | null;
      uri?: string | null;
    } | null;
  } | null> | null;
};

export const CaHolderSearchTokenNftDocument = gql`
  query caHolderSearchTokenNFT($dto: GetCAHolderSearchTokenNFTDto) {
    caHolderSearchTokenNFT(dto: $dto) {
      chainId
      caAddress
      balance
      tokenInfo {
        symbol
        tokenContractAddress
        decimals
        totalSupply
        tokenName
        issuer
        isBurnable
        issueChainId
      }
      nftInfo {
        protocolName
        symbol
        tokenId
        nftContractAddress
        owner
        minter
        quantity
        alias
        baseUri
        uri
      }
    }
  }
`;

/**
 * __useCaHolderSearchTokenNftQuery__
 *
 * To run a query within a React component, call `useCaHolderSearchTokenNftQuery` and pass it any options that fit your needs.
 * When your component renders, `useCaHolderSearchTokenNftQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCaHolderSearchTokenNftQuery({
 *   variables: {
 *      dto: // value for 'dto'
 *   },
 * });
 */
export function useCaHolderSearchTokenNftQuery(
  baseOptions?: Apollo.QueryHookOptions<CaHolderSearchTokenNftQuery, CaHolderSearchTokenNftQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<CaHolderSearchTokenNftQuery, CaHolderSearchTokenNftQueryVariables>(
    CaHolderSearchTokenNftDocument,
    options,
  );
}
export function useCaHolderSearchTokenNftLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<CaHolderSearchTokenNftQuery, CaHolderSearchTokenNftQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<CaHolderSearchTokenNftQuery, CaHolderSearchTokenNftQueryVariables>(
    CaHolderSearchTokenNftDocument,
    options,
  );
}
export type CaHolderSearchTokenNftQueryHookResult = ReturnType<typeof useCaHolderSearchTokenNftQuery>;
export type CaHolderSearchTokenNftLazyQueryHookResult = ReturnType<typeof useCaHolderSearchTokenNftLazyQuery>;
export type CaHolderSearchTokenNftQueryResult = Apollo.QueryResult<
  CaHolderSearchTokenNftQuery,
  CaHolderSearchTokenNftQueryVariables
>;
