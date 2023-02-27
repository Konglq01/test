export default {
  fetchAccountTokenList: '/api/app/user/assets/token',
  fetchAccountNftProtocolList: '/api/app/user/assets/nftCollections',
  fetchAccountNftProtocolItemList: '/api/app/user/assets/nftItems',
  // nft and tokens
  fetchAccountAssetsByKeywords: '/api/app/user/assets/searchUserAssets',
  fetchTokenPrice: {
    target: '/api/app/tokens/prices',
    config: { method: 'GET' },
  },
  getSymbolImages: {
    target: '/api/app/user/assets/symbolImages',
    config: { method: 'GET' },
  },
} as const;
