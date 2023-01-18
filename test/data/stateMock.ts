const stateMock = {
  tokenBalance: {
    balances: {
      RpcUrl1: {
        Account1: {
          [Symbol('RpcUrl1Account1')]: 'value1',
        },
        Account2: {
          [Symbol('RpcUrl1Account2')]: 'value2',
        },
      },
      RpcUrl2: {
        Account1: {
          [Symbol('RpcUrl2Account1')]: 'value1',
        },
        Account2: {
          [Symbol('RpcUrl2Account2')]: 'value2',
        },
      },
    },
  },
  wallet: {
    accountList: [],
  },
};
