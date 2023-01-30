import * as Types from '../__generated__/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type LoginGuardianTypeInfoQueryVariables = Types.Exact<{
  dto?: Types.InputMaybe<Types.GetLoginGuardianTypeInfoDto>;
}>;

export type LoginGuardianTypeInfoQuery = {
  __typename?: 'Query';
  loginGuardianTypeInfo?: Array<{
    __typename?: 'LoginGuardianTypeDto';
    id?: string | null;
    chainId?: string | null;
    caHash?: string | null;
    caAddress?: string | null;
    loginGuardianType?: string | null;
    type: number;
  } | null> | null;
};

export const LoginGuardianTypeInfoDocument = gql`
  query loginGuardianTypeInfo($dto: GetLoginGuardianTypeInfoDto) {
    loginGuardianTypeInfo(dto: $dto) {
      id
      chainId
      caHash
      caAddress
      loginGuardianType
      type
    }
  }
`;

/**
 * __useLoginGuardianTypeInfoQuery__
 *
 * To run a query within a React component, call `useLoginGuardianTypeInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useLoginGuardianTypeInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLoginGuardianTypeInfoQuery({
 *   variables: {
 *      dto: // value for 'dto'
 *   },
 * });
 */
export function useLoginGuardianTypeInfoQuery(
  baseOptions?: Apollo.QueryHookOptions<LoginGuardianTypeInfoQuery, LoginGuardianTypeInfoQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<LoginGuardianTypeInfoQuery, LoginGuardianTypeInfoQueryVariables>(
    LoginGuardianTypeInfoDocument,
    options,
  );
}
export function useLoginGuardianTypeInfoLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<LoginGuardianTypeInfoQuery, LoginGuardianTypeInfoQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<LoginGuardianTypeInfoQuery, LoginGuardianTypeInfoQueryVariables>(
    LoginGuardianTypeInfoDocument,
    options,
  );
}
export type LoginGuardianTypeInfoQueryHookResult = ReturnType<typeof useLoginGuardianTypeInfoQuery>;
export type LoginGuardianTypeInfoLazyQueryHookResult = ReturnType<typeof useLoginGuardianTypeInfoLazyQuery>;
export type LoginGuardianTypeInfoQueryResult = Apollo.QueryResult<
  LoginGuardianTypeInfoQuery,
  LoginGuardianTypeInfoQueryVariables
>;
