import { useQuery, gql } from '@apollo/client';
import { NetworkType } from '@portkey/types';
import { getApolloClient } from './apollo';
import {
  SearchCAHolderManagerInfoParamsType,
  SearchLoginGuardianTypeParamsType,
  SearchNFTProtocolInfoParamsType,
  SearchCAHolderTransactionParamsType,
  SearchTokenInfoParamsType,
} from './types';
import {
  CaHolderManagerDto,
  CaHolderTransactionDto,
  GetCaHolderManagerInfoDto,
  GetCaHolderTransactionDto,
  GetLoginGuardianTypeInfoDto,
  GetNftProtocolInfoDto,
  GetTokenInfoDto,
  LoginGuardianTypeDto,
  NftProtocolInfoDto,
  TokenInfoDto,
} from './__generated__/resolversTypes';

// TokenInfo
const TOKEN_INFO_LIST_QUERY = gql`
  query TokenInfo($symbol: String, $chainId: String, $skipCount: Int!, $maxResultCount: Int!) {
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

const useTokenInfoList = (network: NetworkType, params: GetTokenInfoDto) => {
  const apolloClient = getApolloClient(network);

  const result = useQuery<TokenInfoDto>(TOKEN_INFO_LIST_QUERY, {
    client: apolloClient,
    variables: params,
  });

  return result;
};

const SEARCH_TOKEN_INFO_QUERY = gql`
  query TokenInfo($chainId: String, $symbol: String, $skipCount: Int!, $maxResultCount: Int!) {
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

const searchTokenInfo = async (network: NetworkType, params: SearchTokenInfoParamsType) => {
  const apolloClient = getApolloClient(network);

  const queryParams: GetTokenInfoDto = {
    ...params,
    skipCount: params.skipCount === undefined ? 0 : params.skipCount,
    maxResultCount: params.maxResultCount === undefined ? 100 : params.maxResultCount,
  };

  const result = await apolloClient.query<{ tokenInfo: TokenInfoDto[] }>({
    query: SEARCH_TOKEN_INFO_QUERY,
    variables: queryParams,
  });
  return result;
};

// NFTProtocolInfo
const SEARCH_NFT_PROTOCOL_INFO_QUERY = gql`
  query NftProtocolInfo($chainId: String, $symbol: String, $skipCount: Int!, $maxResultCount: Int!) {
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

const searchNFTProtocolInfo = async (network: NetworkType, params: SearchNFTProtocolInfoParamsType) => {
  const apolloClient = getApolloClient(network);

  const queryParams: GetNftProtocolInfoDto = {
    ...params,
    skipCount: params.skipCount === undefined ? 0 : params.skipCount,
    maxResultCount: params.maxResultCount === undefined ? 100 : params.maxResultCount,
  };

  const result = await apolloClient.query<{ nftProtocolInfo: NftProtocolInfoDto[] }>({
    query: SEARCH_NFT_PROTOCOL_INFO_QUERY,
    variables: queryParams,
  });
  return result;
};

// CAHolderTransaction
const SEARCH_CA_HOLDER_TRANSACTION_QUERY = gql`
  query CaHolderTransaction($chainId: String, $address: String, $skipCount: Int!, $maxResultCount: Int!) {
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

const searchCAHolderTransaction = async (network: NetworkType, params: SearchCAHolderTransactionParamsType) => {
  const apolloClient = getApolloClient(network);

  const queryParams: GetCaHolderTransactionDto = {
    ...params,
    skipCount: params.skipCount === undefined ? 0 : params.skipCount,
    maxResultCount: params.maxResultCount === undefined ? 100 : params.maxResultCount,
  };

  const result = await apolloClient.query<{ caHolderTransaction: CaHolderTransactionDto[] }>({
    query: SEARCH_CA_HOLDER_TRANSACTION_QUERY,
    variables: queryParams,
  });
  return result;
};

// CAHolderManager
const SEARCH_CA_HOLDER_MANAGER_INFO_QUERY = gql`
  query CaHolderManagerInfo($chainId: String, $caHash: String, $caAddress: String, $manager: String) {
    caHolderManagerInfo(
      dto: {
        chainId: $chainId
        caHash: $caHash
        caAddress: $caAddress
        manager: $manager
        skipCount: 0
        maxResultCount: 100
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

const searchCAHolderManagerInfo = async (network: NetworkType, params: SearchCAHolderManagerInfoParamsType) => {
  const apolloClient = getApolloClient(network);

  const queryParams: GetCaHolderManagerInfoDto = {
    ...params,
    skipCount: params.skipCount === undefined ? 0 : params.skipCount,
    maxResultCount: params.maxResultCount === undefined ? 100 : params.maxResultCount,
  };

  const result = await apolloClient.query<{ caHolderManagerInfo: CaHolderManagerDto[] }>({
    query: SEARCH_CA_HOLDER_MANAGER_INFO_QUERY,
    variables: queryParams,
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
    $skipCount: Int!
    $maxResultCount: Int!
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

const useLoginGuardianTypeList = (network: NetworkType, params: GetLoginGuardianTypeInfoDto) => {
  const apolloClient = getApolloClient(network);

  const result = useQuery<TokenInfoDto>(LOGIN_GUARDIAN_TYPE_LIST_QUERY, {
    client: apolloClient,
    variables: params,
  });

  return result;
};

const SEARCH_LOGIN_GUARDIAN_TYPE_QUERY = gql`
  query LoginGuardianTypeInfo($chainId: String, $caHash: String, $caAddress: String, $loginGuardianType: String) {
    loginGuardianTypeInfo(
      dto: {
        chainId: $chainId
        caHash: $caHash
        caAddress: $caAddress
        loginGuardianType: $loginGuardianType
        skipCount: 0
        maxResultCount: 100
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

const searchLoginGuardianType = async (network: NetworkType, params: SearchLoginGuardianTypeParamsType) => {
  const apolloClient = getApolloClient(network);

  const queryParams: GetLoginGuardianTypeInfoDto = {
    ...params,
    skipCount: params.skipCount === undefined ? 0 : params.skipCount,
    maxResultCount: params.maxResultCount === undefined ? 100 : params.maxResultCount,
  };

  const result = await apolloClient.query<{ loginGuardianTypeInfo: LoginGuardianTypeDto[] }>({
    query: SEARCH_LOGIN_GUARDIAN_TYPE_QUERY,
    variables: queryParams,
  });
  return result;
};

export {
  searchTokenInfo,
  searchNFTProtocolInfo,
  searchCAHolderTransaction,
  searchCAHolderManagerInfo,
  searchLoginGuardianType,
};
