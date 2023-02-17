export default {
  fetchAccountTokenList: '/api/app/user/assets/token',
  fetchAccountNftProtocolList: '/api/app/user/assets/nftProtocols',
  fetchAccountNftProtocolItemList: '/api/app/user/assets/nftItems',
  // nft and tokens
  fetchAccountAssetsByKeywords: '/api/app/user/assets/nftCollections',
  fetchTokenPrice: {
    target: '/api/app/tokens/prices',
    config: { method: 'GET' },
  },
} as const;
