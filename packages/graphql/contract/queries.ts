import { useQuery, gql } from '@apollo/client';
import { NetworkType } from '@portkey/types';
import { getApolloClient } from './apollo';
import {
  GetCaHolderManagerInfoParamsType,
  GetLoginGuardianTypeParamsType,
  GetNftProtocolInfoParamsType,
  GetCaHolderTransactionParamsType,
  GetTokenInfoParamsType,
  GetCAHolderByManagerParamsType,
  CaHolderWithGuardian,
  GetCaHolderTokenBalanceParamsType,
  GetCaHolderTransactionAddressParamsType,
} from './types';
import {
  CaHolderManagerChangeRecordDto,
  CaHolderManagerDto,
  CaHolderTokenBalanceDto,
  CaHolderTransactionAddressDto,
  CaHolderTransactionDto,
  GetCaHolderManagerChangeRecordDto,
  GetLoginGuardianTypeChangeRecordDto,
  LoginGuardianTypeChangeRecordDto,
  LoginGuardianTypeDto,
  NftProtocolInfoDto,
  TokenInfoDto,
} from './__generated__/resolversTypes';

// CaHolderManagerChangeRecord
const CA_HOLDER_MANAGER_CHANGE_RECORD_QUERY = gql`
  query CaHolderManagerChangeRecordInfo(
    $caHash: String
    $chainId: String
    $endBlockHeight: Int!
    $startBlockHeight: Int!
  ) {
    caHolderManagerChangeRecordInfo(
      dto: { caHash: $caHash, chainId: $chainId, endBlockHeight: $endBlockHeight, startBlockHeight: $startBlockHeight }
    ) {
      blockHeight
      caAddress
      caHash
      changeType
      manager
    }
  }
`;

const getCaHolderManagerChangeRecord = async (network: NetworkType, params: GetCaHolderManagerChangeRecordDto) => {
  const apolloClient = getApolloClient(network);

  const result = await apolloClient.query<{ caHolderManagerChangeRecordInfo: CaHolderManagerChangeRecordDto[] }>({
    query: CA_HOLDER_MANAGER_CHANGE_RECORD_QUERY,
    variables: params,
  });
  return result;
};

// CAHolderManager
const SEARCH_CA_HOLDER_MANAGER_INFO_QUERY = gql`
  query CaHolderManagerInfo(
    $caAddress: String
    $caHash: String
    $chainId: String
    $manager: String
    $maxResultCount: Int = 100
    $skipCount: Int = 0
  ) {
    caHolderManagerInfo(
      dto: {
        caAddress: $caAddress
        caHash: $caHash
        chainId: $chainId
        manager: $manager
        maxResultCount: $maxResultCount
        skipCount: $skipCount
      }
    ) {
      caAddress
      caHash
      chainId
      id
      managers {
        deviceString
        manager
      }
    }
  }
`;

const searchCAHolderManagerInfo = async (network: NetworkType, params: GetCaHolderManagerInfoParamsType) => {
  const apolloClient = getApolloClient(network);
  const result = await apolloClient.query<{ caHolderManagerInfo: CaHolderManagerDto[] }>({
    query: SEARCH_CA_HOLDER_MANAGER_INFO_QUERY,
    variables: params,
  });
  return result;
};

// TODO: It's not verified down here

// TokenInfo
const TOKEN_INFO_LIST_QUERY = gql`
  query TokenInfo($symbol: String, $chainId: String, $skipCount: Int = 0, $maxResultCount: Int = 100) {
    tokenInfo(dto: { symbol: $symbol, chainId: $chainId, skipCount: $skipCount, maxResultCount: $maxResultCount }) {
      id
      chainId
      blockHash
      blockHeight
      previousBlockHash
      symbol
      tokenContractAddress
      decimals
      totalSupply
      tokenName
      issuer
      isBurnable
      issueChainId
    }
  }
`;

const useTokenInfoList = (network: NetworkType, params: GetTokenInfoParamsType) => {
  const apolloClient = getApolloClient(network);

  const result = useQuery<TokenInfoDto>(TOKEN_INFO_LIST_QUERY, {
    client: apolloClient,
    variables: params,
  });

  return result;
};

const SEARCH_TOKEN_INFO_QUERY = gql`
  query TokenInfo($chainId: String, $symbol: String, $skipCount: Int = 0, $maxResultCount: Int = 100) {
    tokenInfo(dto: { chainId: $chainId, symbol: $symbol, skipCount: $skipCount, maxResultCount: $maxResultCount }) {
      id
      chainId
      blockHash
      blockHeight
      previousBlockHash
      symbol
      tokenContractAddress
      decimals
      totalSupply
      tokenName
      issuer
      isBurnable
      issueChainId
    }
  }
`;

const searchTokenInfo = async (network: NetworkType, params: GetTokenInfoParamsType) => {
  const apolloClient = getApolloClient(network);

  const result = await apolloClient.query<{ tokenInfo: TokenInfoDto[] }>({
    query: SEARCH_TOKEN_INFO_QUERY,
    variables: params,
  });
  return result;
};

// NFTProtocolInfo
const SEARCH_NFT_PROTOCOL_INFO_QUERY = gql`
  query NftProtocolInfo($chainId: String, $symbol: String, $skipCount: Int = 0, $maxResultCount: Int = 100) {
    nftProtocolInfo(
      dto: { chainId: $chainId, symbol: $symbol, skipCount: $skipCount, maxResultCount: $maxResultCount }
    ) {
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

const searchNFTProtocolInfo = async (network: NetworkType, params: GetNftProtocolInfoParamsType) => {
  const apolloClient = getApolloClient(network);

  const result = await apolloClient.query<{ nftProtocolInfo: NftProtocolInfoDto[] }>({
    query: SEARCH_NFT_PROTOCOL_INFO_QUERY,
    variables: params,
  });
  return result;
};

// CAHolderTransaction
const SEARCH_CA_HOLDER_TRANSACTION_QUERY = gql`
  query CaHolderTransaction(
    $address: String
    $blockHash: String
    $chainId: String
    $maxResultCount: Int = 100
    $methodNames: [String]
    $skipCount: Int = 0
    $symbol: String
    $transactionId: String
  ) {
    caHolderTransaction(
      dto: {
        address: $address
        blockHash: $blockHash
        chainId: $chainId
        maxResultCount: $maxResultCount
        methodNames: $methodNames
        skipCount: $skipCount
        symbol: $symbol
        transactionId: $transactionId
      }
    ) {
      blockHash
      blockHeight
      chainId
      fromAddress
      id
      methodName
      nftInfo {
        url
        alias
        nftId
      }
      previousBlockHash
      status
      timestamp
      tokenInfo {
        symbol
        decimals
      }
      transactionFees {
        amount
        symbol
      }
      transactionId
      transferInfo {
        amount
        fromAddress
        fromChainId
        toAddress
        toChainId
      }
    }
  }
`;

const searchCAHolderTransaction = async (network: NetworkType, params: GetCaHolderTransactionParamsType) => {
  const apolloClient = getApolloClient(network);

  const result = await apolloClient.query<{ caHolderTransaction: CaHolderTransactionDto[] }>({
    query: SEARCH_CA_HOLDER_TRANSACTION_QUERY,
    variables: params,
  });
  return result;
};

// LoginGuardianType
const LOGIN_GUARDIAN_TYPE_LIST_QUERY = gql`
  query LoginGuardianTypeInfo(
    $chainId: String
    $caHash: String
    $caAddress: String
    $loginGuardianType: String
    $skipCount: Int = 0
    $maxResultCount: Int = 100
  ) {
    loginGuardianTypeInfo(
      dto: {
        chainId: $chainId
        caHash: $caHash
        caAddress: $caAddress
        loginGuardianType: $loginGuardianType
        skipCount: $skipCount
        maxResultCount: $maxResultCount
      }
    ) {
      id
      chainId
      caHash
      caAddress
      loginGuardianType
    }
  }
`;

const useLoginGuardianTypeList = (network: NetworkType, params: GetLoginGuardianTypeParamsType) => {
  const apolloClient = getApolloClient(network);

  const result = useQuery<TokenInfoDto>(LOGIN_GUARDIAN_TYPE_LIST_QUERY, {
    client: apolloClient,
    variables: params,
  });

  return result;
};

const SEARCH_LOGIN_GUARDIAN_TYPE_QUERY = gql`
  query LoginGuardianTypeInfo(
    $chainId: String
    $caHash: String
    $caAddress: String
    $loginGuardianType: String
    $skipCount: Int = 0
    $maxResultCount: Int = 100
  ) {
    loginGuardianTypeInfo(
      dto: {
        chainId: $chainId
        caHash: $caHash
        caAddress: $caAddress
        loginGuardianType: $loginGuardianType
        skipCount: $skipCount
        maxResultCount: $maxResultCount
      }
    ) {
      id
      chainId
      caHash
      caAddress
      loginGuardianType
      type
    }
  }
`;

const searchLoginGuardianType = async (network: NetworkType, params: GetLoginGuardianTypeParamsType) => {
  const apolloClient = getApolloClient(network);

  const result = await apolloClient.query<{ loginGuardianTypeInfo: LoginGuardianTypeDto[] }>({
    query: SEARCH_LOGIN_GUARDIAN_TYPE_QUERY,
    variables: params,
  });
  return result;
};

const getCAHolderByManager = async (network: NetworkType, params: GetCAHolderByManagerParamsType) => {
  const caResult = await searchCAHolderManagerInfo(network, {
    ...params,
    skipCount: 0,
    maxResultCount: 1,
  });
  console.log(caResult, '====caResult');

  if (caResult.error) throw caResult.error;
  const result: {
    caHolderManagerInfo: CaHolderWithGuardian[];
  } = {
    caHolderManagerInfo: caResult.data.caHolderManagerInfo.map(item => ({ ...item, loginGuardianTypeInfo: [] })),
  };

  if (caResult.data.caHolderManagerInfo.length > 0) {
    const caHash = caResult.data.caHolderManagerInfo[0].caHash;
    const guardianResult = await searchLoginGuardianType(network, {
      chainId: params.chainId,
      caHash,
    });

    if (guardianResult.error) throw guardianResult.error;
    result.caHolderManagerInfo[0].loginGuardianTypeInfo = guardianResult.data.loginGuardianTypeInfo;
  }

  return result;
};

// CAHolderTokenBalanceInfo
const CA_HOLDER_TOKEN_BALANCE_INFO_QUERY = gql`
  query CaHolderTokenBalanceInfo(
    $caAddress: String
    $chainId: String
    $symbol: String
    $skipCount: Int = 0
    $maxResultCount: Int = 100
  ) {
    caHolderTokenBalanceInfo(
      dto: {
        caAddress: $caAddress
        chainId: $chainId
        symbol: $symbol
        skipCount: $skipCount
        maxResultCount: $maxResultCount
      }
    ) {
      balance
      caAddress
      chainId
      tokenInfo {
        decimals
        symbol
      }
    }
  }
`;

const getCaHolderTokenBalance = async (network: NetworkType, params: GetCaHolderTokenBalanceParamsType) => {
  const apolloClient = getApolloClient(network);

  const result = await apolloClient.query<{ caHolderTokenBalanceInfo: CaHolderTokenBalanceDto[] }>({
    query: CA_HOLDER_TOKEN_BALANCE_INFO_QUERY,
    variables: params,
  });
  return result;
};

// CAHolderTransactionAddressInfo
const CA_HOLDER_TRANSACTION_ADDRESS_QUERY = gql`
  query CaHolderTransactionAddressInfo(
    $caAddress: String
    $chainId: String
    $skipCount: Int = 0
    $maxResultCount: Int = 100
  ) {
    caHolderTransactionAddressInfo(
      dto: { caAddress: $caAddress, chainId: $chainId, skipCount: $skipCount, maxResultCount: $maxResultCount }
    ) {
      address
      addressChainId
      caAddress
      chainId
      transactionTime
    }
  }
`;

const getCaHolderTransactionAddress = async (network: NetworkType, params: GetCaHolderTransactionAddressParamsType) => {
  const apolloClient = getApolloClient(network);

  const result = await apolloClient.query<{ caHolderTransactionAddressInfo: CaHolderTransactionAddressDto[] }>({
    query: CA_HOLDER_TRANSACTION_ADDRESS_QUERY,
    variables: params,
  });
  return result;
};

// LoginGuardianTypeChangeRecord
const LOGIN_GUARDIAN_TYPE_CHANGE_RECORD_QUERY = gql`
  query LoginGuardianTypeChangeRecordInfo(
    $caHash: String
    $chainId: String
    $endBlockHeight: Int!
    $startBlockHeight: Int!
  ) {
    loginGuardianTypeChangeRecordInfo(
      dto: { caHash: $caHash, chainId: $chainId, endBlockHeight: $endBlockHeight, startBlockHeight: $startBlockHeight }
    ) {
      blockHeight
      caAddress
      caHash
      changeType
      id
      loginGuardianType
    }
  }
`;

const getLoginGuardianTypeChangeRecord = async (network: NetworkType, params: GetLoginGuardianTypeChangeRecordDto) => {
  const apolloClient = getApolloClient(network);

  const result = await apolloClient.query<{ loginGuardianTypeChangeRecordInfo: LoginGuardianTypeChangeRecordDto[] }>({
    query: LOGIN_GUARDIAN_TYPE_CHANGE_RECORD_QUERY,
    variables: params,
  });
  return result;
};

export {
  searchTokenInfo,
  searchNFTProtocolInfo,
  searchCAHolderTransaction,
  searchCAHolderManagerInfo,
  searchLoginGuardianType,
  getCAHolderByManager,
  getCaHolderTokenBalance,
  getCaHolderTransactionAddress,
  getCaHolderManagerChangeRecord,
  getLoginGuardianTypeChangeRecord,
};
