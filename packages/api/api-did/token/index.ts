export default {
  fetchAccountTokenList: '/api/app/user/assets/token',
  displayUserToken: {
    target: '/api/app/userTokens',
    config: { method: 'PUT' },
  },
} as const;
