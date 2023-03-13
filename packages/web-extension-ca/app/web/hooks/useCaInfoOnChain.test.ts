// import { renderHook } from '@testing-library/react-hooks';
// import { useCaInfoOnChain } from './useCaInfoOnChain';
// import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
// import { useCurrentWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
// import { getHolderInfoByContract } from 'utils/sandboxUtil/getHolderInfo';
// import { setCAInfo } from '@portkey-wallet/store/store-ca/wallet/actions';

// jest.mock('@portkey-wallet/hooks/hooks-ca/network');
// jest.mock('@portkey-wallet/hooks/hooks-ca/wallet');
// jest.mock('@portkey-wallet/store/store-ca/wallet/actions');
// jest.mock('utils/sandboxUtil/getHolderInfo');

// // TODO：Temporary solution mock useMemo，needs to be optimized
// jest.mock('store/Provider/hooks', () => {
//   return {
//     ...jest.requireActual('store/Provider/hooks'),
//     useAppDispatch: jest.fn(() => (fn: () => void) => {
//       return fn();
//     }),
//   };
// });

// const walletInfo: any = {
//   BIP44Path: "m/44'/1616'/0'/0/0",
//   address: '2fGQUF8oHT2zo6AGyPAzBarCKUNsVLU5UFabCrAAagyMzobQYp',
//   AESEncryptPrivateKey:
//     'U2FsdGVkX1/GSAcZOKwm32Daq8Ll7mBm59+5mQUM4GM3mdoP6VfX0KMellhRvLpKz/Jsco3F+bMeg31mLjMskJ5xjpM8QJxaRsxLNLuglEPQm4sX9SMaujRsQSovKaf7',
//   AESEncryptMnemonic:
//     'U2FsdGVkX1/F9yNDTMem8eziWdYWFS0IBKlhQATu9SwvqNxA6WUrIqHElN3Y8npYR6dlaq6mA+ojPDyXYoI4qIuaSKVPG4R2ZGJbtF2V+/6sPUTY3LeHdt6FMAR2L3/z',
//   publicKey: {
//     x: 'a4e03a86b25c569caf2c5e7fdf249eb363283c9c16fa5af0690172f339ff16bb',
//     y: 'ea0c89e99d096492c7ce8e220121904175282ffae1312d5419a0487681630c6',
//   },
//   managerInfo: {
//     managerUniqueId: '9d0792ad-bbd1-4ccd-861c-dff89056d432',
//     requestId: '8213f791d1754b56bfac4110531d079e',
//     loginAccount: 'yangkexin@portkey.finance',
//     type: 0,
//     verificationType: 1,
//   },
//   AELF: {
//     caAddress: '2tgCgt32ZBSgB26XPGSWdkeaizNsnykLrc7eoUzJ8dV6wrzap8',
//     caHash: 'f891ac1c866c0c99d63a629c68ceafb5bd7fc2a24572b2afcff48005f133538c',
//   },
//   tDVV: {
//     caAddress: '2XuBe7qrnvAEZTU1EoWk7C4bp5ab49jV2Y3Uaxkisy8crz2nkd',
//     caHash: 'f891ac1c866c0c99d63a629c68ceafb5bd7fc2a24572b2afcff48005f133538c',
//   },
//   caHash: 'f891ac1c866c0c99d63a629c68ceafb5bd7fc2a24572b2afcff48005f133538c',
//   caAddressList: [
//     '2tgCgt32ZBSgB26XPGSWdkeaizNsnykLrc7eoUzJ8dV6wrzap8',
//     '2XuBe7qrnvAEZTU1EoWk7C4bp5ab49jV2Y3Uaxkisy8crz2nkd',
//   ],
// };
// const chainList: any = [
//   {
//     chainId: 'AELF',
//     chainName: 'AELF',
//     endPoint: 'http://192.168.66.61:8000',
//     explorerUrl: 'http://192.168.66.61:8000',
//     caContractAddress: 'xsnQafDAhNTeYcooptETqWnYBksFGGXxfcQyJJ5tmu6Ak9ZZt',
//     lastModifyTime: '2023-03-02T07:43:54.5819059Z',
//     id: 'AELF',
//   },
//   {
//     chainId: 'tDVV',
//     chainName: 'tDVV',
//     endPoint: 'http://192.168.66.100:8000',
//     explorerUrl: 'http://192.168.66.100:8000',
//     caContractAddress: '2YkKkNZKCcsfUsGwCfJ6wyTx5NYLgpCg1stBuRT4z5ep3psXNG',
//     lastModifyTime: '2023-03-02T07:44:42.852515Z',
//     id: 'tDVV',
//   },
// ];
// const currentNetwork: any = {
//   name: 'aelf Testnet',
//   walletType: 'aelf',
//   networkType: 'TESTNET',
//   isActive: true,
//   apiUrl: 'http://192.168.67.51:5577',
//   graphqlUrl: 'http://192.168.67.84:8083/AElfIndexer_DApp/PortKeyIndexerCASchema/graphql',
//   connectUrl: 'http://192.168.67.51:8080',
// };
// describe('useCaInfoOnChain', () => {
//   test('01', () => {
//     jest.mocked(useCurrentWallet).mockReturnValue({
//       walletInfo: walletInfo,
//       chainList: chainList,
//       walletAvatar: '',
//       walletType: 'aelf',
//       walletName: '',
//       currentNetwork: 'TESTNET',
//     });
//     jest.mocked(useCurrentNetworkInfo).mockReturnValue(currentNetwork);
//     jest.mocked(getHolderInfoByContract).mockReturnValue(Promise.resolve({ code: '200', result: '' }));
//     jest.mocked(setCAInfo).mockImplementation();
//     // const { walletInfo, chainList } = useCurrentWallet();
//     // const currentNetwork = useCurrentNetworkInfo();
//     const { result } = renderHook(() => useCaInfoOnChain());
//     console.log('🌈 🌈 🌈 🌈 🌈 🌈 result', result.current);
//   });
// });

import { renderHook } from '@testing-library/react-hooks';
import { useCaInfoOnChain } from './useCaInfoOnChain';

// Set up mock data
const chainList = [
  {
    chainId: 'AELF',
    endPoint: 'https://mainnet.infura.io/v3/your-project-id',
    caContractAddress: '0x1234567890abcdef',
  },
];
const walletInfo = {
  caHash: '0x9876543210abcdef',
};
const getSeedResult = {
  data: {
    privateKey: 'your-private-key',
  },
};

// Set up mock functions
const getHolderInfoByChainId = jest.fn();

// Mock dependencies
jest.mock('@portkey-wallet/hooks/hooks-ca/network', () => ({
  useCurrentNetworkInfo: jest.fn(() => ({
    walletType: 'AELF',
  })),
}));
jest.mock('@portkey-wallet/hooks/hooks-ca/wallet', () => ({
  useCurrentWallet: jest.fn(() => ({
    walletInfo,
    chainList,
  })),
}));
jest.mock('store/Provider/hooks', () => ({
  useAppDispatch: jest.fn(() => jest.fn()),
}));
jest.mock('@portkey-wallet/utils', () => ({
  isAddress: jest.fn(() => true),
}));
jest.mock('utils/sandboxUtil/getHolderInfo', () => ({
  getHolderInfoByContract: jest.fn(() => ({
    code: 1,
    result: {
      caAddress: '0x1234567890abcdef',
      caHash: '0x9876543210abcdef',
    },
  })),
}));
jest.mock('messages/InternalMessage', () => ({
  payload: jest.fn(() => ({
    send: jest.fn(() => Promise.resolve(getSeedResult)),
  })),
}));

jest.mock('react', () => {
  return {
    ...jest.requireActual('react'),
    useCallback: jest.fn((fn: () => void) => {
      return fn();
    }),
  };
});

describe('useCaInfoOnChain', () => {
  it('should fetch and set CA info on chain', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useCaInfoOnChain());

    // Run the hook
    result.current();

    // Wait for the hook to finish
    await waitForNextUpdate();

    // Expectations
    expect(getHolderInfoByChainId).toHaveBeenCalledTimes(1);
    expect(getHolderInfoByChainId).toHaveBeenCalledWith({
      chain: chainList[0],
      walletType: 'AELF',
      caHash: walletInfo.caHash,
      pin: getSeedResult.data.privateKey,
    });
  });
});
