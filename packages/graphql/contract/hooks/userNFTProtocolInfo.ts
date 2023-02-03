import * as Types from '../__generated__/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type UserNftProtocolInfoQueryVariables = Types.Exact<{
  dto?: Types.InputMaybe<Types.GetUserNftProtocolInfoDto>;
}>;

export type UserNftProtocolInfoQuery = {
  __typename?: 'Query';
  userNFTProtocolInfo?: Array<{
    __typename?: 'UserNFTProtocolInfoDto';
    id?: string | null;
    chainId?: string | null;
    caAddress?: string | null;
    tokenIds?: Array<number> | null;
    nftProtocolInfo?: {
      __typename?: 'NFTProtocolDto';
      id?: string | null;
      symbol?: string | null;
      creator?: string | null;
      nftType?: string | null;
      protocolName?: string | null;
      baseUri?: string | null;
      isTokenIdReuse: boolean;
      supply: number;
      totalSupply: number;
      issueChainId: number;
      isBurnable: boolean;
      imageUrl?: string | null;
    } | null;
  } | null> | null;
};

export const UserNftProtocolInfoDocument = gql`
  query userNFTProtocolInfo($dto: GetUserNFTProtocolInfoDto) {
    userNFTProtocolInfo(dto: $dto) {
      id
      chainId
      caAddress
      tokenIds
      nftProtocolInfo {
        id
        symbol
        creator
        nftType
        protocolName
        baseUri
        isTokenIdReuse
        supply
        totalSupply
        issueChainId
        isBurnable
        imageUrl
      }
    }
  }
`;

/**
 * __useUserNftProtocolInfoQuery__
 *
 * To run a query within a React component, call `useUserNftProtocolInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserNftProtocolInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserNftProtocolInfoQuery({
 *   variables: {
 *      dto: // value for 'dto'
 *   },
 * });
 */
export function useUserNftProtocolInfoQuery(
  baseOptions?: Apollo.QueryHookOptions<UserNftProtocolInfoQuery, UserNftProtocolInfoQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<UserNftProtocolInfoQuery, UserNftProtocolInfoQueryVariables>(
    UserNftProtocolInfoDocument,
    options,
  );
}
export function useUserNftProtocolInfoLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<UserNftProtocolInfoQuery, UserNftProtocolInfoQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<UserNftProtocolInfoQuery, UserNftProtocolInfoQueryVariables>(
    UserNftProtocolInfoDocument,
    options,
  );
}
export type UserNftProtocolInfoQueryHookResult = ReturnType<typeof useUserNftProtocolInfoQuery>;
export type UserNftProtocolInfoLazyQueryHookResult = ReturnType<typeof useUserNftProtocolInfoLazyQuery>;
export type UserNftProtocolInfoQueryResult = Apollo.QueryResult<
  UserNftProtocolInfoQuery,
  UserNftProtocolInfoQueryVariables
>;
