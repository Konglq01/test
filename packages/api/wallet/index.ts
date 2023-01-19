export default {
  requestRegister: '/api/app/account/register/request',
  recoveryWallet: '/api/app/account/recovery/request',
  // TODO Test api
  hubPing: '/api/app/account/hub/ping',
  getResponse: '/api/app/account/hub/getResponse',
  queryRecovery: '/api/app/account/recovery/query',
  queryRegister: '/api/app/account/register/query',
  setWalletName: '/api/app/account/setNickname',
  getChainList: '/api/app/getChains',
} as const;
