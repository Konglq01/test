export default {
  requestRegister: '/api/app/account/register/request',
  recoveryWallet: '/api/app/account/recovery/request',
  // TODO Test api
  hubPing: '/api/app/account/hub/ping',
  getCreateResponse: 'api/app/account/hub/response',
  queryRecovery: '/api/app/account/recovery/query',
  queryRegister: '/api/app/account/register/query',
  setWalletName: '/api/app/account/setNickname',
  getChainList: '/api/app/getChains',
  editWalletName: {
    target: '/api/app/account/nickname',
    config: { method: 'PUT' },
  },
} as const;
