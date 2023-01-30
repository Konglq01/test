import * as Types from '../__generated__/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type UserNftInfoQueryVariables = Types.Exact<{
  dto?: Types.InputMaybe<Types.GetUserNftInfoDto>;
}>;


export type UserNftInfoQuery = { __typename?: 'Query', userNFTInfo?: Array<{ __typename?: 'UserNFTInfoDto', id?: string | null, chainId?: string | null, caAddress?: string | null, quantity: number, nftInfo?: { __typename?: 'NFTItemInfoDto', id?: string | null, protocolName?: string | null, symbol?: string | null, tokenId: number, owner?: string | null, minter?: string | null, quantity: number, alias?: string | null, baseUri?: string | null, uri?: string | null, creator?: string | null, nftType?: string | null, totalQuantity: number, tokenHash?: string | null, imageUrl?: string | null } | null } | null> | null };


export const UserNftInfoDocument = gql`
    query userNFTInfo($dto: GetUserNFTInfoDto) {
  userNFTInfo(dto: $dto) {
    id
    chainId
    caAddress
    quantity
    nftInfo {
      id
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
}
    `;

/**
 * __useUserNftInfoQuery__
 *
 * To run a query within a React component, call `useUserNftInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserNftInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserNftInfoQuery({
 *   variables: {
 *      dto: // value for 'dto'
 *   },
 * });
 */
export function useUserNftInfoQuery(baseOptions?: Apollo.QueryHookOptions<UserNftInfoQuery, UserNftInfoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UserNftInfoQuery, UserNftInfoQueryVariables>(UserNftInfoDocument, options);
      }
export function useUserNftInfoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserNftInfoQuery, UserNftInfoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UserNftInfoQuery, UserNftInfoQueryVariables>(UserNftInfoDocument, options);
        }
export type UserNftInfoQueryHookResult = ReturnType<typeof useUserNftInfoQuery>;
export type UserNftInfoLazyQueryHookResult = ReturnType<typeof useUserNftInfoLazyQuery>;
export type UserNftInfoQueryResult = Apollo.QueryResult<UserNftInfoQuery, UserNftInfoQueryVariables>;