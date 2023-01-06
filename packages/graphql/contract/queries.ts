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
  CaHolderManagerDto,
  CaHolderTransactionDto,
  LoginGuardianTypeDto,
  NftProtocolInfoDto,
  TokenInfoDto,
} from './__generated__/resolversTypes';

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
  query CaHolderTransaction($chainId: String, $address: String, $skipCount: Int = 0, $maxResultCount: Int = 100) {
    caHolderTransaction(
      dto: { chainId: $chainId, address: $address, skipCount: $skipCount, maxResultCount: $maxResultCount }
    ) {
      id
      chainId
      blockHash
      blockHeight
      previousBlockHash
      transactionId
      transactionType
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

const searchCAHolderTransaction = async (network: NetworkType, params: GetCaHolderTransactionParamsType) => {
  const apolloClient = getApolloClient(network);

  const result = await apolloClient.query<{ caHolderTransaction: CaHolderTransactionDto[] }>({
    query: SEARCH_CA_HOLDER_TRANSACTION_QUERY,
    variables: params,
  });
  return result;
};

// CAHolderManager
const SEARCH_CA_HOLDER_MANAGER_INFO_QUERY = gql`
  query CaHolderManagerInfo(
    $chainId: String
    $caHash: String
    $caAddress: String
    $manager: String
    $skipCount: Int = 0
    $maxResultCount: Int = 100
  ) {
    caHolderManagerInfo(
      dto: {
        chainId: $chainId
        caHash: $caHash
        caAddress: $caAddress
        manager: $manager
        skipCount: $skipCount
        maxResultCount: $maxResultCount
      }
    ) {
      id
      chainId
      caHash
      caAddress
      managers {
        manager
        deviceString
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
      symbol
    }
  }
`;

const getCaHolderTokenBalance = async (network: NetworkType, params: GetCaHolderTokenBalanceParamsType) => {
  const apolloClient = getApolloClient(network);

  const result = await apolloClient.query<{ caHolderManagerInfo: CaHolderManagerDto[] }>({
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

  const result = await apolloClient.query<{ caHolderManagerInfo: CaHolderManagerDto[] }>({
    query: CA_HOLDER_TRANSACTION_ADDRESS_QUERY,
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
};
