export default {
  fetchACHToken: '/api/app/alchemy/token/get',
  getFiatList: {
    target: '/api/app/alchemy/fiatList',
    config: { method: 'GET' },
  },
  getCryptoList: {
    target: '/api/app/alchemy/cryptoList',
    config: { method: 'GET' },
  },
  fetchOrderQuote: '/api/app/alchemy/order/quote',
} as const;
