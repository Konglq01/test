import * as Types from '../__generated__/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type LoginGuardianTypeChangeRecordInfoQueryVariables = Types.Exact<{
  dto?: Types.InputMaybe<Types.GetLoginGuardianTypeChangeRecordDto>;
}>;

export type LoginGuardianTypeChangeRecordInfoQuery = {
  __typename?: 'Query';
  loginGuardianTypeChangeRecordInfo?: Array<{
    __typename?: 'LoginGuardianTypeChangeRecordDto';
    id?: string | null;
    caHash?: string | null;
    caAddress?: string | null;
    changeType?: string | null;
    loginGuardianType?: string | null;
    blockHeight: number;
  } | null> | null;
};

export const LoginGuardianTypeChangeRecordInfoDocument = gql`
  query loginGuardianTypeChangeRecordInfo($dto: GetLoginGuardianTypeChangeRecordDto) {
    loginGuardianTypeChangeRecordInfo(dto: $dto) {
      id
      caHash
      caAddress
      changeType
      loginGuardianType
      blockHeight
    }
  }
`;

/**
 * __useLoginGuardianTypeChangeRecordInfoQuery__
 *
 * To run a query within a React component, call `useLoginGuardianTypeChangeRecordInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useLoginGuardianTypeChangeRecordInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLoginGuardianTypeChangeRecordInfoQuery({
 *   variables: {
 *      dto: // value for 'dto'
 *   },
 * });
 */
export function useLoginGuardianTypeChangeRecordInfoQuery(
  baseOptions?: Apollo.QueryHookOptions<
    LoginGuardianTypeChangeRecordInfoQuery,
    LoginGuardianTypeChangeRecordInfoQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<LoginGuardianTypeChangeRecordInfoQuery, LoginGuardianTypeChangeRecordInfoQueryVariables>(
    LoginGuardianTypeChangeRecordInfoDocument,
    options,
  );
}
export function useLoginGuardianTypeChangeRecordInfoLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    LoginGuardianTypeChangeRecordInfoQuery,
    LoginGuardianTypeChangeRecordInfoQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<LoginGuardianTypeChangeRecordInfoQuery, LoginGuardianTypeChangeRecordInfoQueryVariables>(
    LoginGuardianTypeChangeRecordInfoDocument,
    options,
  );
}
export type LoginGuardianTypeChangeRecordInfoQueryHookResult = ReturnType<
  typeof useLoginGuardianTypeChangeRecordInfoQuery
>;
export type LoginGuardianTypeChangeRecordInfoLazyQueryHookResult = ReturnType<
  typeof useLoginGuardianTypeChangeRecordInfoLazyQuery
>;
export type LoginGuardianTypeChangeRecordInfoQueryResult = Apollo.QueryResult<
  LoginGuardianTypeChangeRecordInfoQuery,
  LoginGuardianTypeChangeRecordInfoQueryVariables
>;
