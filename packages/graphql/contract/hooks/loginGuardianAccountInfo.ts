import * as Types from '../__generated__/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type LoginGuardianAccountInfoQueryVariables = Types.Exact<{
  dto?: Types.InputMaybe<Types.GetLoginGuardianAccountInfoDto>;
}>;

export type LoginGuardianAccountInfoQuery = {
  __typename?: 'Query';
  loginGuardianAccountInfo?: Array<{
    __typename?: 'LoginGuardianAccountDto';
    id?: string | null;
    chainId?: string | null;
    caHash?: string | null;
    caAddress?: string | null;
    manager?: string | null;
    loginGuardianAccount?: {
      __typename?: 'GuardianAccountDto';
      value?: string | null;
      guardian?: { __typename?: 'GuardianDto'; type: number; verifier?: string | null } | null;
    } | null;
  } | null> | null;
};

export const LoginGuardianAccountInfoDocument = gql`
  query loginGuardianAccountInfo($dto: GetLoginGuardianAccountInfoDto) {
    loginGuardianAccountInfo(dto: $dto) {
      id
      chainId
      caHash
      caAddress
      manager
      loginGuardianAccount {
        guardian {
          type
          verifier
        }
        value
      }
    }
  }
`;

/**
 * __useLoginGuardianAccountInfoQuery__
 *
 * To run a query within a React component, call `useLoginGuardianAccountInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useLoginGuardianAccountInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLoginGuardianAccountInfoQuery({
 *   variables: {
 *      dto: // value for 'dto'
 *   },
 * });
 */
export function useLoginGuardianAccountInfoQuery(
  baseOptions?: Apollo.QueryHookOptions<LoginGuardianAccountInfoQuery, LoginGuardianAccountInfoQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<LoginGuardianAccountInfoQuery, LoginGuardianAccountInfoQueryVariables>(
    LoginGuardianAccountInfoDocument,
    options,
  );
}
export function useLoginGuardianAccountInfoLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<LoginGuardianAccountInfoQuery, LoginGuardianAccountInfoQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<LoginGuardianAccountInfoQuery, LoginGuardianAccountInfoQueryVariables>(
    LoginGuardianAccountInfoDocument,
    options,
  );
}
export type LoginGuardianAccountInfoQueryHookResult = ReturnType<typeof useLoginGuardianAccountInfoQuery>;
export type LoginGuardianAccountInfoLazyQueryHookResult = ReturnType<typeof useLoginGuardianAccountInfoLazyQuery>;
export type LoginGuardianAccountInfoQueryResult = Apollo.QueryResult<
  LoginGuardianAccountInfoQuery,
  LoginGuardianAccountInfoQueryVariables
>;
