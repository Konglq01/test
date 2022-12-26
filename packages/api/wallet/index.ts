export default {
  registerWallet: '/api/app/account/register/managerAddress',
  recoveryWallet: '/api/app/account/recovery/managerAddress',
  queryRecovery: '/api/app/account/recovery/query',
  queryRegister: '/api/app/account/register/query',
  setWalletName: '/api/app/account/setNickname',
  getChainList: '/api/app/getChains',
} as const;
