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
  GetUserNftProtocolInfoParamsType,
  GetUserNftInfoParamsType,
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
  UserNftInfoDto,
  UserNftProtocolInfoDto,
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

const getCAHolderManagerInfo = async (network: NetworkType, params: GetCaHolderManagerInfoParamsType) => {
  const apolloClient = getApolloClient(network);
  const result = await apolloClient.query<{ caHolderManagerInfo: CaHolderManagerDto[] }>({
    query: SEARCH_CA_HOLDER_MANAGER_INFO_QUERY,
    variables: params,
  });
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
        alias
        nftId
        url
      }
      previousBlockHash
      status
      timestamp
      tokenInfo {
        decimals
        symbol
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

const getCAHolderTransaction = async (network: NetworkType, params: GetCaHolderTransactionParamsType) => {
  const apolloClient = getApolloClient(network);

  const result = await apolloClient.query<{ caHolderTransaction: CaHolderTransactionDto[] }>({
    query: SEARCH_CA_HOLDER_TRANSACTION_QUERY,
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

// LoginGuardianType
const LOGIN_GUARDIAN_TYPE_QUERY = gql`
  query LoginGuardianTypeInfo(
    $caAddress: String
    $caHash: String
    $chainId: String
    $loginGuardianType: String
    $skipCount: Int = 0
    $maxResultCount: Int = 100
  ) {
    loginGuardianTypeInfo(
      dto: {
        caAddress: $caAddress
        caHash: $caHash
        chainId: $chainId
        loginGuardianType: $loginGuardianType
        skipCount: $skipCount
        maxResultCount: $maxResultCount
      }
    ) {
      caAddress
      caHash
      chainId
      id
      loginGuardianType
      type
    }
  }
`;

const getLoginGuardianType = async (network: NetworkType, params: GetLoginGuardianTypeParamsType) => {
  const apolloClient = getApolloClient(network);

  const result = await apolloClient.query<{ loginGuardianTypeInfo: LoginGuardianTypeDto[] }>({
    query: LOGIN_GUARDIAN_TYPE_QUERY,
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
      alias
      baseUri
      blockHash
      blockHeight
      chainId
      creator
      id
      imageUrl
      minter
      nftType
      owner
      previousBlockHash
      protocolName
      quantity
      symbol
      tokenHash
      tokenId
      totalQuantity
      uri
    }
  }
`;

const getNFTProtocolInfo = async (network: NetworkType, params: GetNftProtocolInfoParamsType) => {
  const apolloClient = getApolloClient(network);

  const result = await apolloClient.query<{ nftProtocolInfo: NftProtocolInfoDto[] }>({
    query: SEARCH_NFT_PROTOCOL_INFO_QUERY,
    variables: params,
  });
  return result;
};

// TokenInfo
const TOKEN_INFO_QUERY = gql`
  query TokenInfo($chainId: String, $symbol: String, $skipCount: Int = 0, $maxResultCount: Int = 100) {
    tokenInfo(dto: { chainId: $chainId, symbol: $symbol, skipCount: $skipCount, maxResultCount: $maxResultCount }) {
      blockHash
      blockHeight
      chainId
      decimals
      id
      isBurnable
      issueChainId
      issuer
      previousBlockHash
      symbol
      tokenContractAddress
      tokenName
      totalSupply
    }
  }
`;

const getTokenInfo = async (network: NetworkType, params: GetTokenInfoParamsType) => {
  const apolloClient = getApolloClient(network);

  const result = await apolloClient.query<{ tokenInfo: TokenInfoDto[] }>({
    query: TOKEN_INFO_QUERY,
    variables: params,
  });
  return result;
};

// UserNftInfo
const USER_NFT_INFO_QUERY = gql`
  query UserNFTInfo(
    $caAddress: String
    $chainId: String
    $symbol: String
    $tokenId: String
    $skipCount: Int = 0
    $maxResultCount: Int = 100
  ) {
    userNFTInfo(
      dto: {
        caAddress: $caAddress
        chainId: $chainId
        symbol: $symbol
        tokenId: $tokenId
        skipCount: $skipCount
        maxResultCount: $maxResultCount
      }
    ) {
      caAddress
      chainId
      id
      nftInfo {
        alias
        baseUri
        creator
        id
        imageUrl
        minter
        nftType
        owner
        protocolName
        quantity
        symbol
        tokenHash
        tokenId
        totalQuantity
        uri
      }
      quantity
    }
  }
`;

const getUserNftInfo = async (network: NetworkType, params: GetUserNftInfoParamsType) => {
  const apolloClient = getApolloClient(network);

  const result = await apolloClient.query<{ userNFTInfo: UserNftInfoDto[] }>({
    query: USER_NFT_INFO_QUERY,
    variables: params,
  });
  return result;
};

// UserNftProtocolInfo
const USER_NFT_PROTOCOL_INFO_QUERY = gql`
  query UserNFTProtocolInfo(
    $caAddress: String
    $chainId: String
    $symbol: String
    $skipCount: Int = 0
    $maxResultCount: Int = 100
  ) {
    userNFTProtocolInfo(
      dto: {
        caAddress: $caAddress
        chainId: $chainId
        symbol: $symbol
        skipCount: $skipCount
        maxResultCount: $maxResultCount
      }
    ) {
      caAddress
      chainId
      id
      nftProtocolInfo {
        baseUri
        creator
        id
        imageUrl
        isBurnable
        isTokenIdReuse
        issueChainId
        nftType
        protocolName
        supply
        symbol
        totalSupply
      }
      tokenIds
    }
  }
`;

const getUserNftProtocolInfo = async (network: NetworkType, params: GetUserNftProtocolInfoParamsType) => {
  const apolloClient = getApolloClient(network);

  const result = await apolloClient.query<{ userNFTProtocolInfo: UserNftProtocolInfoDto[] }>({
    query: USER_NFT_PROTOCOL_INFO_QUERY,
    variables: params,
  });
  return result;
};

// Custom
const getCAHolderByManager = async (network: NetworkType, params: GetCAHolderByManagerParamsType) => {
  const caResult = await getCAHolderManagerInfo(network, {
    ...params,
    skipCount: 0,
    maxResultCount: 1,
  });
  if (caResult.error) throw caResult.error;
  const result: {
    caHolderManagerInfo: CaHolderWithGuardian[];
  } = {
    caHolderManagerInfo: caResult.data.caHolderManagerInfo.map(item => ({ ...item, loginGuardianTypeInfo: [] })),
  };

  if (caResult.data.caHolderManagerInfo.length > 0) {
    const caHash = caResult.data.caHolderManagerInfo[0].caHash;
    const guardianResult = await getLoginGuardianType(network, {
      chainId: params.chainId,
      caHash,
    });

    if (guardianResult.error) throw guardianResult.error;
    result.caHolderManagerInfo[0].loginGuardianTypeInfo = guardianResult.data.loginGuardianTypeInfo;
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
