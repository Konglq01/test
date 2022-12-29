import { useQuery, gql } from '@apollo/client';
import { NetworkType } from '@portkey/types';
import { getApolloClient } from './apollo';
import {
  CAHolderManagerDto,
  GetCAHolderManagerInfoDto,
  GetLoginGuardianTypeInfoDto,
  GetTokenInfoDto,
  LoginGuardianTypeDto,
  SearchCAHolderManagerInfoParamsType,
  SearchLoginGuardianTypeParamsType,
  TokenInfoDto,
} from './types';

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

  const result = await apolloClient.query<{ loginGuardianTypeInfo: LoginGuardianTypeDto[] }>({
    query: SEARCH_LOGIN_GUARDIAN_TYPE_QUERY,
    variables: params,
  });
  return result;
};

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

  const result = await apolloClient.query<{ caHolderManagerInfo: CAHolderManagerDto[] }>({
    query: SEARCH_CA_HOLDER_MANAGER_INFO_QUERY,
    variables: params,
  });
  return result;
};

export { useTokenInfoList, useLoginGuardianTypeList, searchLoginGuardianType, searchCAHolderManagerInfo };
