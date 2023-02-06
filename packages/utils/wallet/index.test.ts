import {
  checkPasswordInput,
  checkWalletNameInput,
  checkAccountNameInput,
  getNextBIP44Path,
  handleWalletInfo,
  formatWalletInfo,
  formatAccountInfo,
  getAccountByMnemonic,
  getAccountByPrivateKey,
  checkPinInput,
} from './index';
import {
  AccountNameErrorMessage,
  FormatAccountInfo,
  GetAccountByMnemonic,
  GetAccountByPrivateKey,
  GetNextBIP44Path,
  PasswordErrorMessage,
  PinErrorMessage,
  WalletNameErrorMessage,
} from './types';
import { DefaultBIP44Path } from '@portkey/constants/wallet';
import aes from '../aes';
import AElf from 'aelf-sdk';
import { isExtension } from '@portkey/utils';

describe('handleWalletInfo', () => {
  test('params contain publicKey', () => {
    expect(handleWalletInfo({ publicKey: 'publicKey' })).toEqual(expect.objectContaining({ publicKey: 'publicKey' }));
  });
  test('params don`t contain publicKey, contain keyPair', () => {
    expect(() => handleWalletInfo({ keyPair: 'keyPair' })).toThrow();
  });
  test('returnValue does not contain keyPair and childWallet', () => {
    const res = handleWalletInfo({ publicKey: 'publicKey', keyPair: 'keyPair', childWallet: 'childWallet' });
    expect(Object.keys(res)).not.toContain('keyPair');
    expect(Object.keys(res)).not.toContain('childWallet');
  });
});

describe('formatWalletInfo', () => {
  const password = '11111111',
    accountName = 'testName';
  const walletInfoInput = {
    privateKey: 'privateKey',
    mnemonic: 'mnemonic',
    publicKey: 'publicKey',
    xPrivateKey: 'xPrivateKey',
    keyPair: 'keyPair',
  };
  test('walletInfoInput does not exist', () => {
    expect(formatWalletInfo(null, password, accountName)).toBeFalsy;
  });
  test('privateKey of walletInfoInput exist but password does not exist', () => {
    expect(formatWalletInfo({ privateKey: 'privateKey' }, '', accountName)).toBeFalsy;
  });
  test('keyPair does not exist', () => {
    expect(formatWalletInfo({}, password, accountName)).toThrowError;
  });
  // TODO: keyPair
  // test('the walletInfoInput does not contain publicKey, contain keyPair', () => {
  //   const res = formatWalletInfo({ keyPair: 'keyPair' }, password, accountName);
  //   expect(res).toEqual(expect.objectContaining({ publicKey: expect.any(String) }));
  // });
  test('correct input, check generate AESEncryptPrivateKey and AESEncryptMnemonic', () => {
    aes.encrypt = jest.fn();
    const res = formatWalletInfo(walletInfoInput, password, accountName);
    expect(aes.encrypt).toHaveBeenCalledTimes(2);
  });
  test('correct input, check returnValue', () => {
    const res = formatWalletInfo(walletInfoInput, password, accountName);
    expect(res).toHaveProperty('walletInfo');
    expect(res).toHaveProperty('accountInfo');
  });
});

describe('formatAccountInfo', () => {
  const password = '11111111',
    accountName = 'testName';
  const walletInfoInput = {
    privateKey: 'privateKey',
    mnemonic: 'mnemonic',
    publicKey: 'publicKey',
    xPrivateKey: 'xPrivateKey',
  };
  test('the input of walletInfoInput does not exist', () => {
    expect(formatAccountInfo({}, password, accountName)).toBeFalsy;
  });
  test('walletInfoInput`privateKey exist but password does not exist', () => {
    expect(formatAccountInfo({ privateKey: 'privateKey' }, '', accountName)).toBeFalsy;
  });
  // test('the walletInfoInput does not contain publicKey, contain keyPair', () => {
  //   const res = formatAccountInfo({ keyPair: 'keyPair' }, password, accountName);
  //   expect(res).toHaveProperty('publicKey');
  // });
  test('correct input, check generate AESEncryptPrivateKey', () => {
    aes.encrypt = jest.fn();
    formatAccountInfo(walletInfoInput, password, accountName);
    expect(aes.encrypt).toHaveBeenCalledTimes(1);
  });
  test('correct input, check the returnValue', () => {
    const res = formatAccountInfo(walletInfoInput, password, accountName);
    expect(res).toHaveProperty('accountName');
    expect(res).toHaveProperty('accountType');
    expect(res).not.toHaveProperty('privateKey');
    expect(res).not.toHaveProperty('mnemonic');
    expect(res).not.toHaveProperty('xPrivateKey');
    expect(res).not.toHaveProperty('keyPair');
    expect(res).not.toHaveProperty('childWallet');
  });
});

describe('getAccountByMnemonic', () => {
  const AESEncryptMnemonic = 'AESEncryptMnemonic',
    password = '11111111',
    BIP44Path = DefaultBIP44Path;
  test('correct input', () => {
    aes.decrypt = jest.fn().mockReturnValue(true);
    AElf.wallet.getWalletByMnemonic = jest.fn();
    const res = getAccountByMnemonic({ AESEncryptMnemonic, password, BIP44Path });
    expect(aes.decrypt).toHaveBeenCalledTimes(1);
    expect(AElf.wallet.getWalletByMnemonic).toHaveBeenCalledTimes(1);
    expect(res).toBeFalsy;
  });
  test('The mnemonic does not exist', () => {
    expect(getAccountByMnemonic({ AESEncryptMnemonic: '', password, BIP44Path })).toBeFalsy;
  });
});

describe('getAccountByPrivateKey', () => {
  beforeEach(() => {
    AElf.wallet.getWalletByPrivateKey = jest.fn().mockReturnValue({
      BIP44Path: DefaultBIP44Path,
    });
  });
  const privateKey = '1111';
  test('correct input, get wallet from privateKey', () => {
    getAccountByPrivateKey(privateKey);
    expect(AElf.wallet.getWalletByPrivateKey).toHaveBeenCalledTimes(1);
  });
  test('correct input, the returnValue is not BIP44Path', () => {
    const res = getAccountByPrivateKey(privateKey);
    expect(res).not.toHaveProperty('BIP44Path');
  });
});

describe('getNextBIP44Path', () => {
  test('the input of BIP44Path is right', () => {
    expect(getNextBIP44Path("m/44'/1616'/0'/0/0")).toBe("m/44'/1616'/0'/0/1");
  });
  test('the input of BIP44Path is wrong', () => {
    expect(getNextBIP44Path("m/44'/1616'/0'/0/a")).toBe(DefaultBIP44Path);
  });
});

describe('checkPasswordInput', () => {
  test('password does not exist or the length less than 8', () => {
    expect(checkPasswordInput('')).toBe(PasswordErrorMessage.passwordNotLong);
    expect(checkPasswordInput('111111')).toBe(PasswordErrorMessage.passwordNotLong);
  });
  test('password is invalid', () => {
    expect(checkPasswordInput('$#111111')).toBe(PasswordErrorMessage.invalidPassword);
  });
  test('password is correct', () => {
    expect(checkPasswordInput('12345678')).toBeUndefined();
  });
});

describe('checkWalletNameInput', () => {
  test('walletName does not exist', () => {
    expect(checkWalletNameInput('')).toBe(WalletNameErrorMessage.enterWalletName);
  });
  test('the length of walletName more than 30', () => {
    expect(checkWalletNameInput('1111111110111111111011111111101')).toBe(WalletNameErrorMessage.walletNameToLong);
  });
  test('the walletName is not valid', () => {
    expect(checkWalletNameInput('``test')).toBe(WalletNameErrorMessage.invalidWalletName);
  });
  test('the walletName is right', () => {
    expect(checkWalletNameInput('12345678')).toBeTruthy;
  });
});

describe('checkAccountNameInput', () => {
  test('accountName does not exist', () => {
    expect(checkAccountNameInput('')).toBeUndefined();
  });
  test('the length of accountName more than 30', () => {
    expect(checkAccountNameInput('1111111110111111111011111111101')).toBe(AccountNameErrorMessage.walletNameToLong);
  });
  test('the accountName is not valid', () => {
    expect(checkAccountNameInput('``')).toBe(AccountNameErrorMessage.invalidWalletName);
  });
  test('the accountName is right', () => {
    expect(checkAccountNameInput('12345678')).toBeUndefined();
  });
});

describe('checkPinInput', () => {
  jest.mock('@portkey/utils', () => ({
    isExtension: jest.fn().mockReturnValueOnce(true).mockReturnValue(false),
  }));
  // test('Extension platform', () => {
  //   const checkPasswordInput = jest.fn()
  //   checkPinInput('11111111')
  //   expect(checkPasswordInput).toHaveBeenCalledTimes(1)
  // })
  test('the pin is invalid', () => {
    expect(checkPinInput('11111111')).toBe(PinErrorMessage.invalidPin);
    expect(checkPinInput('')).toBe(PinErrorMessage.invalidPin);
    expect(checkPinInput('qqqqqq')).toBe(PinErrorMessage.invalidPin);
  });
  test('the pin is valid', () => {
    expect(checkPinInput('111111')).toBeUndefined();
  });
});
