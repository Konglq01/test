import { NetworkType } from '@portkey/types';
import { getApolloClient } from './apollo';
import { GetCAHolderByManagerParamsType, CaHolderWithGuardian } from './types';

import {
  CaHolderManagerChangeRecordInfoDocument,
  CaHolderManagerChangeRecordInfoQuery,
  CaHolderManagerChangeRecordInfoQueryVariables,
} from './hooks/caHolderManagerChangeRecordInfo';
import {
  CaHolderManagerInfoDocument,
  CaHolderManagerInfoQuery,
  CaHolderManagerInfoQueryVariables,
} from './hooks/caHolderManagerInfo';
import {
  CaHolderTokenBalanceInfoDocument,
  CaHolderTokenBalanceInfoQuery,
  CaHolderTokenBalanceInfoQueryVariables,
} from './hooks/caHolderTokenBalanceInfo';
import {
  CaHolderTransactionDocument,
  CaHolderTransactionQuery,
  CaHolderTransactionQueryVariables,
} from './hooks/caHolderTransaction';
import {
  CaHolderTransactionAddressInfoDocument,
  CaHolderTransactionAddressInfoQuery,
  CaHolderTransactionAddressInfoQueryVariables,
} from './hooks/caHolderTransactionAddressInfo';
import {
  LoginGuardianTypeChangeRecordInfoDocument,
  LoginGuardianTypeChangeRecordInfoQuery,
  LoginGuardianTypeChangeRecordInfoQueryVariables,
} from './hooks/loginGuardianTypeChangeRecordInfo';
import {
  LoginGuardianTypeInfoDocument,
  LoginGuardianTypeInfoQuery,
  LoginGuardianTypeInfoQueryVariables,
} from './hooks/loginGuardianTypeInfo';
import { NftProtocolInfoDocument, NftProtocolInfoQuery, NftProtocolInfoQueryVariables } from './hooks/nftProtocolInfo';
import { TokenInfoDocument, TokenInfoQuery, TokenInfoQueryVariables } from './hooks/tokenInfo';
import { UserNftInfoDocument, UserNftInfoQuery, UserNftInfoQueryVariables } from './hooks/userNFTInfo';
import {
  UserNftProtocolInfoDocument,
  UserNftProtocolInfoQuery,
  UserNftProtocolInfoQueryVariables,
} from './hooks/userNFTProtocolInfo';

// CaHolderManagerChangeRecord
const getCaHolderManagerChangeRecord = async (
  network: NetworkType,
  params: CaHolderManagerChangeRecordInfoQueryVariables,
) => {
  const apolloClient = getApolloClient(network);

  const result = await apolloClient.query<CaHolderManagerChangeRecordInfoQuery>({
    query: CaHolderManagerChangeRecordInfoDocument,
    variables: params,
  });
  return result;
};

// CAHolderManager
const getCAHolderManagerInfo = async (network: NetworkType, params: CaHolderManagerInfoQueryVariables) => {
  const apolloClient = getApolloClient(network);
  const result = await apolloClient.query<CaHolderManagerInfoQuery>({
    query: CaHolderManagerInfoDocument,
    variables: params,
  });
  return result;
};

// CAHolderTokenBalanceInfo
const getCaHolderTokenBalance = async (network: NetworkType, params: CaHolderTokenBalanceInfoQueryVariables) => {
  const apolloClient = getApolloClient(network);

  const result = await apolloClient.query<CaHolderTokenBalanceInfoQuery>({
    query: CaHolderTokenBalanceInfoDocument,
    variables: params,
  });
  return result;
};

// CAHolderTransaction
const getCAHolderTransaction = async (network: NetworkType, params: CaHolderTransactionQueryVariables) => {
  const apolloClient = getApolloClient(network);

  const result = await apolloClient.query<CaHolderTransactionQuery>({
    query: CaHolderTransactionDocument,
    variables: params,
  });
  return result;
};

// CAHolderTransactionAddressInfo
const getCaHolderTransactionAddress = async (
  network: NetworkType,
  params: CaHolderTransactionAddressInfoQueryVariables,
) => {
  const apolloClient = getApolloClient(network);

  const result = await apolloClient.query<CaHolderTransactionAddressInfoQuery>({
    query: CaHolderTransactionAddressInfoDocument,
    variables: params,
  });
  return result;
};

// LoginGuardianTypeChangeRecord
const getLoginGuardianTypeChangeRecord = async (
  network: NetworkType,
  params: LoginGuardianTypeChangeRecordInfoQueryVariables,
) => {
  const apolloClient = getApolloClient(network);

  const result = await apolloClient.query<LoginGuardianTypeChangeRecordInfoQuery>({
    query: LoginGuardianTypeChangeRecordInfoDocument,
    variables: params,
  });
  return result;
};

// LoginGuardianType
const getLoginGuardianType = async (network: NetworkType, params: LoginGuardianTypeInfoQueryVariables) => {
  const apolloClient = getApolloClient(network);

  const result = await apolloClient.query<LoginGuardianTypeInfoQuery>({
    query: LoginGuardianTypeInfoDocument,
    variables: params,
  });
  return result;
};

// NFTProtocolInfo
const getNFTProtocolInfo = async (network: NetworkType, params: NftProtocolInfoQueryVariables) => {
  const apolloClient = getApolloClient(network);

  const result = await apolloClient.query<NftProtocolInfoQuery>({
    query: NftProtocolInfoDocument,
    variables: params,
  });
  return result;
};

// TokenInfo
const getTokenInfo = async (network: NetworkType, params: TokenInfoQueryVariables) => {
  const apolloClient = getApolloClient(network);

  const result = await apolloClient.query<TokenInfoQuery>({
    query: TokenInfoDocument,
    variables: params,
  });
  return result;
};

// UserNftInfo
const getUserNftInfo = async (network: NetworkType, params: UserNftInfoQueryVariables) => {
  const apolloClient = getApolloClient(network);

  const result = await apolloClient.query<UserNftInfoQuery>({
    query: UserNftInfoDocument,
    variables: params,
  });
  return result;
};

// UserNftProtocolInfo

const getUserNftProtocolInfo = async (network: NetworkType, params: UserNftProtocolInfoQueryVariables) => {
  const apolloClient = getApolloClient(network);

  const result = await apolloClient.query<UserNftProtocolInfoQuery>({
    query: UserNftProtocolInfoDocument,
    variables: params,
  });
  return result;
};

// getCAHolderByManager
const getCAHolderByManager = async (network: NetworkType, params: GetCAHolderByManagerParamsType) => {
  const caResult = await getCAHolderManagerInfo(network, {
    dto: {
      ...params,
      skipCount: 0,
      maxResultCount: 1,
    },
  });
  if (caResult.error) throw caResult.error;
  const result: {
    caHolderManagerInfo: CaHolderWithGuardian[];
  } = {
    caHolderManagerInfo: caResult.data.caHolderManagerInfo
      ? caResult.data.caHolderManagerInfo.map(item => ({ ...item, loginGuardianTypeInfo: [] }))
      : [],
  };

  if (result.caHolderManagerInfo.length > 0) {
    const caHash = result.caHolderManagerInfo[0].caHash;
    const guardianResult = await getLoginGuardianType(network, {
      dto: {
        chainId: params.chainId,
        caHash,
        skipCount: 0,
        maxResultCount: 100,
      },
    });

    if (guardianResult.error) throw guardianResult.error;
    if (guardianResult.data.loginGuardianTypeInfo) {
      result.caHolderManagerInfo[0].loginGuardianTypeInfo = guardianResult.data.loginGuardianTypeInfo;
    } else {
      result.caHolderManagerInfo[0].loginGuardianTypeInfo = [];
    }
  }

  return result;
};

export {
  getTokenInfo,
  getNFTProtocolInfo,
  getCAHolderTransaction,
  getCAHolderManagerInfo,
  getLoginGuardianType,
  getCAHolderByManager,
  getCaHolderTokenBalance,
  getCaHolderTransactionAddress,
  getCaHolderManagerChangeRecord,
  getLoginGuardianTypeChangeRecord,
  getUserNftInfo,
  getUserNftProtocolInfo,
};
