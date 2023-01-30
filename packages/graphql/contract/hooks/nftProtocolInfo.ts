import * as Types from '../__generated__/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type NftProtocolInfoQueryVariables = Types.Exact<{
  dto?: Types.InputMaybe<Types.GetNftProtocolInfoDto>;
}>;

export type NftProtocolInfoQuery = {
  __typename?: 'Query';
  nftProtocolInfo?: Array<{
    __typename?: 'NFTProtocolInfoDto';
    id?: string | null;
    chainId?: string | null;
    blockHash?: string | null;
    blockHeight: number;
    previousBlockHash?: string | null;
    protocolName?: string | null;
    symbol?: string | null;
    tokenId: number;
    owner?: string | null;
    minter?: string | null;
    quantity: number;
    alias?: string | null;
    baseUri?: string | null;
    uri?: string | null;
    creator?: string | null;
    nftType?: string | null;
    totalQuantity: number;
    tokenHash?: string | null;
    imageUrl?: string | null;
  } | null> | null;
};

export const NftProtocolInfoDocument = gql`
  query nftProtocolInfo($dto: GetNFTProtocolInfoDto) {
    nftProtocolInfo(dto: $dto) {
      id
      chainId
      blockHash
      blockHeight
      previousBlockHash
      protocolName
      symbol
      tokenId
      owner
      minter
      quantity
      alias
      baseUri
      uri
      creator
      nftType
      totalQuantity
      tokenHash
      imageUrl
    }
  }
`;

/**
 * __useNftProtocolInfoQuery__
 *
 * To run a query within a React component, call `useNftProtocolInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useNftProtocolInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNftProtocolInfoQuery({
 *   variables: {
 *      dto: // value for 'dto'
 *   },
 * });
 */
export function useNftProtocolInfoQuery(
  baseOptions?: Apollo.QueryHookOptions<NftProtocolInfoQuery, NftProtocolInfoQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<NftProtocolInfoQuery, NftProtocolInfoQueryVariables>(NftProtocolInfoDocument, options);
}
export function useNftProtocolInfoLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<NftProtocolInfoQuery, NftProtocolInfoQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<NftProtocolInfoQuery, NftProtocolInfoQueryVariables>(NftProtocolInfoDocument, options);
}
export type NftProtocolInfoQueryHookResult = ReturnType<typeof useNftProtocolInfoQuery>;
export type NftProtocolInfoLazyQueryHookResult = ReturnType<typeof useNftProtocolInfoLazyQuery>;
export type NftProtocolInfoQueryResult = Apollo.QueryResult<NftProtocolInfoQuery, NftProtocolInfoQueryVariables>;
