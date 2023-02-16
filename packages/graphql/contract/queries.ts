import { NetworkType } from '@portkey/types';
import { getApolloClient } from './apollo';
import { getApolloClientByUri } from './apolloUISDK';
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
  LoginGuardianAccountChangeRecordInfoDocument,
  LoginGuardianAccountChangeRecordInfoQuery,
  LoginGuardianAccountChangeRecordInfoQueryVariables,
} from './hooks/loginGuardianAccountChangeRecordInfo';
import {
  LoginGuardianAccountInfoDocument,
  LoginGuardianAccountInfoQuery,
  LoginGuardianAccountInfoQueryVariables,
} from './hooks/loginGuardianAccountInfo';
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

const getCAHolderManagerInfoByUrl = async (uri: string, params: CaHolderManagerInfoQueryVariables) => {
  const apolloClient = getApolloClientByUri(uri);
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
const getLoginGuardianAccountChangeRecord = async (
  network: NetworkType,
  params: LoginGuardianAccountChangeRecordInfoQueryVariables,
) => {
  const apolloClient = getApolloClient(network);

  const result = await apolloClient.query<LoginGuardianAccountChangeRecordInfoQuery>({
    query: LoginGuardianAccountChangeRecordInfoDocument,
    variables: params,
  });
  return result;
};

// LoginGuardianType
const getLoginGuardianAccount = async (network: NetworkType, params: LoginGuardianAccountInfoQueryVariables) => {
  const apolloClient = getApolloClient(network);

  const result = await apolloClient.query<LoginGuardianAccountInfoQuery>({
    query: LoginGuardianAccountInfoDocument,
    variables: params,
  });
  return result;
};

const getLoginGuardianTypeByUri = async (uri: string, params: LoginGuardianAccountInfoQueryVariables) => {
  const apolloClient = getApolloClientByUri(uri);

  const result = await apolloClient.query<LoginGuardianAccountInfoQuery>({
    query: LoginGuardianAccountInfoDocument,
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
      ? caResult.data.caHolderManagerInfo.map(item => ({ ...item, loginGuardianAccountInfo: [] }))
      : [],
  };

  if (result.caHolderManagerInfo.length > 0) {
    const caHash = result.caHolderManagerInfo[0].caHash;
    const guardianResult = await getLoginGuardianAccount(network, {
      dto: {
        chainId: params.chainId,
        caHash,
        skipCount: 0,
        maxResultCount: 100,
      },
    });

    if (guardianResult.error) throw guardianResult.error;

    if (guardianResult.data.loginGuardianAccountInfo) {
      result.caHolderManagerInfo[0].loginGuardianAccountInfo = guardianResult.data.loginGuardianAccountInfo;
    } else {
      result.caHolderManagerInfo[0].loginGuardianAccountInfo = [];
    }
  }

  return result;
};

const getCAHolderByManagerByUrl = async (uri: string, params: GetCAHolderByManagerParamsType) => {
  const caResult = await getCAHolderManagerInfoByUrl(uri, {
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
      ? caResult.data.caHolderManagerInfo.map(item => ({ ...item, loginGuardianAccountInfo: [] }))
      : [],
  };

  if (result.caHolderManagerInfo.length > 0) {
    const caHash = result.caHolderManagerInfo[0].caHash;
    const guardianResult = await getLoginGuardianTypeByUri(uri, {
      dto: {
        chainId: params.chainId,
        caHash,
        skipCount: 0,
        maxResultCount: 100,
      },
    });

    if (guardianResult.error) throw guardianResult.error;
    if (guardianResult.data.loginGuardianAccountInfo) {
      result.caHolderManagerInfo[0].loginGuardianAccountInfo = guardianResult.data.loginGuardianAccountInfo;
    } else {
      result.caHolderManagerInfo[0].loginGuardianAccountInfo = [];
    }
  }

  return result;
};

export {
  getTokenInfo,
  getNFTProtocolInfo,
  getCAHolderTransaction,
  getCAHolderManagerInfo,
  getLoginGuardianAccount,
  getCAHolderByManager,
  getCAHolderByManagerByUrl,
  getCaHolderTokenBalance,
  getCaHolderTransactionAddress,
  getCaHolderManagerChangeRecord,
  getLoginGuardianAccountChangeRecord,
  getUserNftInfo,
  getUserNftProtocolInfo,
};
