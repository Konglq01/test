export default {
  fetchRecentTransactionUsers: {
    target: '/api/app/user/assets/recentTransactionUsers',
    config: { method: 'POST' },
  },
} as const;
