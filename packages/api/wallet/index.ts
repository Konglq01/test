export default {
  registerWallet: '/api/app/account/register/managerAddress',
  requestRegister: '/api/app/account/register/request',
  // TODO Test api
  hubPing: '/api/app/account/hub/ping',
  getResponse: '/api/app/account/hub/getResponse',
  recoveryWallet: '/api/app/account/recovery/managerAddress',
  queryRecovery: '/api/app/account/recovery/query',
  queryRegister: '/api/app/account/register/query',
  setWalletName: '/api/app/account/setNickname',
  getChainList: '/api/app/getChains',
} as const;
