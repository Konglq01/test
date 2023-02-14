export default {
  fetchAccountTokenList: '/api/app/user/assets/token',
  fetchAccountNftProtocolList: '/api/app/user/assets/nftProtocols',
  fetchAccountNftProtocolItemList: '/api/app/user/assets/nftItems',
  // nft and tokens
  fetchAccountAssetsByKeywords: '/api/app/user/assets/searchUserAssets',

  fetchActivityList: '/api/app/user/activities/activities',
} as const;
