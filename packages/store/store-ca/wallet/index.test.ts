import { ChainId, NetworkType } from '@portkey/types';
import { WalletInfoType } from '@portkey/types/wallet';
import { changeNetworkType, resetWallet, createWalletAction, setCAInfo } from './actions';
import { walletSlice } from './slice';
import { WalletError, WalletType } from './type';
import { checkPassword } from './utils';

const reducer = walletSlice.reducer;
jest.mock('./utils', () => ({
  checkPassword: jest.fn().mockReturnValue(true),
}));

describe('changeNetworkType', () => {
  const state = {
    walletAvatar: 'master6',
    walletType: 'aelf' as WalletType,
    walletName: 'Wallet 01',
    currentNetwork: 'MAIN' as NetworkType,
    chainList: [],
  };
  test('pre network is MAIN. set current network MAIN', () => {
    expect(reducer(state, changeNetworkType('MAIN'))).toEqual(state);
  });
  test('pre network is MAIN. set current network TESTNET', () => {
    expect(reducer(state, changeNetworkType('TESTNET'))).toEqual({ ...state, currentNetwork: 'TESTNET' });
  });
});

describe('resetWallet', () => {
  test('pre chainInfo is equal to current chainInfo', () => {
    const state = {
      walletAvatar: 'master1',
      walletType: 'aelf' as WalletType,
      walletName: 'Wallet 02',
      currentNetwork: 'TESTNET' as NetworkType,
      chainList: [],
      chainInfo: {
        TESTNET: [],
      },
    };
    expect(reducer(state, resetWallet())).toHaveProperty('chainInfo', { TESTNET: [] });
  });
  test('pre chainInfo does not exist, current chainInfo is undefined', () => {
    const state = {
      walletAvatar: 'master1',
      walletType: 'aelf' as WalletType,
      walletName: 'Wallet 02',
      currentNetwork: 'TESTNET' as NetworkType,
      chainList: [],
    };
    expect(reducer(state, resetWallet())).toHaveProperty('chainInfo', undefined);
  });
});

describe('createWalletAction', () => {
  test('AESEncryptMnemonic does not exist, throw Error', () => {
    const state = {
      walletAvatar: 'master1',
      walletType: 'aelf' as WalletType,
      walletName: 'Wallet 02',
      currentNetwork: 'TESTNET' as NetworkType,
      chainList: [],
      walletInfo: {
        BIP44Path: 'BIP44Path',
        address: 'address',
        AESEncryptPrivateKey: 'AESEncryptPrivateKey',
        AESEncryptMnemonic: 'AESEncryptMnemonic',
        caInfo: {
          TESTNET: {
            managerInfo: {
              managerUniqueId: 'manager-unique-id',
              requestId: 'requestid',
              loginAccount: '1@q.com',
              type: 0,
              verificationType: 1,
            },
            AELF: {
              caAddress: 'caAddress',
              caHash: 'caHash',
            },
            tDVV: {
              caAddress: 'caAddress',
              caHash: 'caHash',
            },
          },
        },
      },
    };
    const params = {
      walletInfo: {
        BIP44Path: 'BIP44Path',
        address: 'address',
        AESEncryptPrivateKey: 'AESEncryptPrivateKey',
        AESEncryptMnemonic: 'AESEncryptMnemonic',
      },
    };
    expect(reducer(state, createWalletAction(params))).toThrowError(WalletError.walletExists);
  });
});

// describe('setCAInfo', () => {
//   const params = {
//     caInfo: {
//       caAddress: 'Atnft53c2KEmM8HbGjyAop2SsdLjtVwPuLv24gx99PTLLGPt5',
//       caHash: 'cd90d31dd7b911155eca3e4d18e59610f90205d5c06a95bad998a9c562e1dca0',
//     },
//     chainId: 'tDVV',
//     pin: '11111111',
//   };
//   const mockObj = {
//     walletAvatar: 'master4',
//     walletType: 'aelf',
//     walletName: 'Wallet 01',
//     currentNetwork: 'TESTNET',
//     chainList: [],
//     chainInfo: {
//       TESTNET: [
//         {
//           chainId: 'tDVV',
//           chainName: 'tDVV',
//           endPoint: 'http://192.168.0.4:8000',
//           explorerUrl: 'http://192.168.0.4:8000',
//           caContractAddress: 'caContractAddress',
//           lastModifyTime: '2023-02-08T07:17:46.7948889Z',
//           id: 'tDVV',
//         },
//         {
//           chainId: 'AELF',
//           chainName: 'AELF',
//           endPoint: 'http://192.168.0.125:8000',
//           explorerUrl: 'http://192.168.0.125:8000',
//           caContractAddress: 'caContractAddress',
//           lastModifyTime: '2023-02-08T07:19:07.0836917Z',
//           id: 'AELF',
//         },
//       ],
//     },
//     walletInfo: {
//       BIP44Path: "m/44'/1616'/0'/0/0",
//       address: 'address',
//       AESEncryptPrivateKey: 'AESEncryptPrivateKey',
//       AESEncryptMnemonic: 'AESEncryptMnemonic',
//       publicKey: {
//         x: 'xpublickey',
//         y: 'ypublickey',
//       },
//       caInfo: {
//         TESTNET: {
//           managerInfo: {
//             managerUniqueId: 'manager-unique-id',
//             requestId: 'requestid',
//             loginAccount: '1@q.com',
//             type: 0,
//             verificationType: 1,
//           },
//           AELF: {
//             caAddress: 'caAddress',
//             caHash: 'caHash',
//           },
//           tDVV: {
//             caAddress: 'caAddress',
//             caHash: 'caHash',
//           },
//         },
//       },
//     },
//     _persist: {
//       version: -1,
//       rehydrated: true,
//     },
//   };
//   test('AESEncryptMnemonic does not exist, throw error', () => {
//     const params = {
//       caInfo: {
//         caAddress: 'caAddress',
//         caHash: 'caHash',
//       },
//       pin: 'pin',
//       chainId: 'AELF' as ChainId,
//     };
//     const state = {
//       walletAvatar: 'master1',
//       walletType: 'aelf' as WalletType,
//       walletName: 'Wallet 02',
//       currentNetwork: 'TESTNET' as NetworkType,
//       chainList: [],
//       chainInfo: {},
//     };
//     expect(() => reducer(state, setCAInfo(params))).toThrowError(WalletError.noCreateWallet);
//   });
//   test('update chainInfo', () => {
//     const params = {
//       caInfo: {
//         caAddress: 'caAddress',
//         caHash: 'caHash',
//       },
//       pin: 'pin',
//       chainId: 'AELF' as ChainId,
//     };
//     const state = {
//       walletAvatar: 'master1',
//       walletType: 'aelf' as WalletType,
//       walletName: 'Wallet 02',
//       currentNetwork: 'TESTNET' as NetworkType,
//       chainList: [],
//       chainInfo: {},
//       walletInfo: {
//         BIP44Path: 'BIP44Path',
//         address: 'address',
//         AESEncryptPrivateKey: 'AESEncryptPrivateKey',
//         AESEncryptMnemonic: 'AESEncryptMnemonic',
//         caInfo: {
//           MAIN: {
//             managerInfo: {},
//             AELF: {},
//           },
//           TESTNET: {
//             managerInfo: {},
//             AELF: {},
//           },
//         },
//       },
//     };
//     const newState = {
//       walletAvatar: 'master1',
//       walletType: 'aelf',
//       walletName: 'Wallet 02',
//       currentNetwork: 'TESTNET',
//       chainList: [],
//       chainInfo: {
//         walletInfo: {
//           caInfo: {
//             TESTNET: {
//               chainId: {
//                 caAddress: '',
//                 caHash: '',
//               },
//             },
//           },
//         },
//       },
//     };
//     // expect(() => reducer(state, setCAInfo(params))).toThrow;
//   });
// });
