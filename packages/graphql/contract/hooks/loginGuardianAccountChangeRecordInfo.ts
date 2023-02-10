import * as Types from '../__generated__/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type LoginGuardianAccountChangeRecordInfoQueryVariables = Types.Exact<{
  dto?: Types.InputMaybe<Types.GetLoginGuardianAccountChangeRecordDto>;
}>;

export type LoginGuardianAccountChangeRecordInfoQuery = {
  __typename?: 'Query';
  loginGuardianAccountChangeRecordInfo?: Array<{
    __typename?: 'LoginGuardianAccountChangeRecordDto';
    changeType?: string | null;
    blockHeight: number;
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

export const LoginGuardianAccountChangeRecordInfoDocument = gql`
  query loginGuardianAccountChangeRecordInfo($dto: GetLoginGuardianAccountChangeRecordDto) {
    loginGuardianAccountChangeRecordInfo(dto: $dto) {
      changeType
      blockHeight
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
 * __useLoginGuardianAccountChangeRecordInfoQuery__
 *
 * To run a query within a React component, call `useLoginGuardianAccountChangeRecordInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useLoginGuardianAccountChangeRecordInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLoginGuardianAccountChangeRecordInfoQuery({
 *   variables: {
 *      dto: // value for 'dto'
 *   },
 * });
 */
export function useLoginGuardianAccountChangeRecordInfoQuery(
  baseOptions?: Apollo.QueryHookOptions<
    LoginGuardianAccountChangeRecordInfoQuery,
    LoginGuardianAccountChangeRecordInfoQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<LoginGuardianAccountChangeRecordInfoQuery, LoginGuardianAccountChangeRecordInfoQueryVariables>(
    LoginGuardianAccountChangeRecordInfoDocument,
    options,
  );
}
export function useLoginGuardianAccountChangeRecordInfoLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    LoginGuardianAccountChangeRecordInfoQuery,
    LoginGuardianAccountChangeRecordInfoQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    LoginGuardianAccountChangeRecordInfoQuery,
    LoginGuardianAccountChangeRecordInfoQueryVariables
  >(LoginGuardianAccountChangeRecordInfoDocument, options);
}
export type LoginGuardianAccountChangeRecordInfoQueryHookResult = ReturnType<
  typeof useLoginGuardianAccountChangeRecordInfoQuery
>;
export type LoginGuardianAccountChangeRecordInfoLazyQueryHookResult = ReturnType<
  typeof useLoginGuardianAccountChangeRecordInfoLazyQuery
>;
export type LoginGuardianAccountChangeRecordInfoQueryResult = Apollo.QueryResult<
  LoginGuardianAccountChangeRecordInfoQuery,
  LoginGuardianAccountChangeRecordInfoQueryVariables
>;
