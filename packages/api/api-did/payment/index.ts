export default {
  fetchACHToken: '/api/app/alchemy/token/get',
  getFiatList: {
    target: '/api/app/alchemy/fiat/list',
    config: { method: 'GET' },
  },
  getCryptoList: {
    target: '/api/app/alchemy/crypto/list',
    config: { method: 'GET' },
  },
  fetchOrderQuote: '/api/app/alchemy/order/quote',
} as const;
