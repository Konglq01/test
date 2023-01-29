import * as Types from '../__generated__/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CaHolderTransactionQueryVariables = Types.Exact<{
  dto?: Types.InputMaybe<Types.GetCaHolderTransactionDto>;
}>;


export type CaHolderTransactionQuery = { __typename?: 'Query', caHolderTransaction?: Array<{ __typename?: 'CAHolderTransactionDto', id?: string | null, chainId?: string | null, blockHash?: string | null, blockHeight: number, previousBlockHash?: string | null, transactionId?: string | null, methodName?: string | null, status: Types.TransactionStatus, timestamp: number, fromAddress?: string | null, tokenInfo?: { __typename?: 'TokenInfo', symbol?: string | null, decimals: number } | null, nftInfo?: { __typename?: 'NFTInfo', url?: string | null, alias?: string | null, nftId: number } | null, transferInfo?: { __typename?: 'TransferInfo', fromAddress?: string | null, toAddress?: string | null, amount: number, fromChainId?: string | null, toChainId?: string | null } | null, transactionFees?: Array<{ __typename?: 'TransactionFee', symbol?: string | null, amount: number } | null> | null } | null> | null };


export const CaHolderTransactionDocument = gql`
    query caHolderTransaction($dto: GetCAHolderTransactionDto) {
  caHolderTransaction(dto: $dto) {
    id
    chainId
    blockHash
    blockHeight
    previousBlockHash
    transactionId
    methodName
    tokenInfo {
      symbol
      decimals
    }
    nftInfo {
      url
      alias
      nftId
    }
    status
    timestamp
    transferInfo {
      fromAddress
      toAddress
      amount
      fromChainId
      toChainId
    }
    fromAddress
    transactionFees {
      symbol
      amount
    }
  }
}
    `;

/**
 * __useCaHolderTransactionQuery__
 *
 * To run a query within a React component, call `useCaHolderTransactionQuery` and pass it any options that fit your needs.
 * When your component renders, `useCaHolderTransactionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCaHolderTransactionQuery({
 *   variables: {
 *      dto: // value for 'dto'
 *   },
 * });
 */
export function useCaHolderTransactionQuery(baseOptions?: Apollo.QueryHookOptions<CaHolderTransactionQuery, CaHolderTransactionQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CaHolderTransactionQuery, CaHolderTransactionQueryVariables>(CaHolderTransactionDocument, options);
      }
export function useCaHolderTransactionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CaHolderTransactionQuery, CaHolderTransactionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CaHolderTransactionQuery, CaHolderTransactionQueryVariables>(CaHolderTransactionDocument, options);
        }
export type CaHolderTransactionQueryHookResult = ReturnType<typeof useCaHolderTransactionQuery>;
export type CaHolderTransactionLazyQueryHookResult = ReturnType<typeof useCaHolderTransactionLazyQuery>;
export type CaHolderTransactionQueryResult = Apollo.QueryResult<CaHolderTransactionQuery, CaHolderTransactionQueryVariables>;