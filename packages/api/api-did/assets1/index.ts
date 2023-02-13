export default {
  fetchAccountTokenList: {
    target: '/api/app/user/assets/token',
    config: { method: 'POST' },
  },
  fetchAccountNftProtocolList: {
    target: '/api/app/user/assets/nftProtocols',
    config: { method: 'POST' },
  },
  fetchAccountNftProtocolItemList: {
    target: '/api/app/user/assets/nftItems',
    config: { method: 'POST' },
  },
  // nft and tokens
  fetchAccountAssetsByKeywords: {
    target: '/api/app/user/assets/searchUserAssets',
    config: { method: 'POST' },
  },
} as const;
