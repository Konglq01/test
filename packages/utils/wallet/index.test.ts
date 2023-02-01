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
  checkPinInput
} from './index'
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
import aes from '../aes'
import AElf from 'aelf-sdk';
import { isExtension } from '@portkey/utils';

describe('handleWalletInfo', () => {
  // TODO: publicKey keyPair
  test('Params contain publicKey', () => {
    expect(Object.keys(handleWalletInfo({publicKey: 'publicKey'}))).toContain('publicKey')
  })
  // test('Params don`t contain publicKey, contain keyPair', () => {
  //   expect(Object.keys(handleWalletInfo({publicKey: 'publicKey', keyPair: 'keyPair'}))).toContain('publicKey')
  // })
  // test('returnValue does not contain keyPair and childWallet', () => {
  //   expect(Object.keys(handleWalletInfo({keyPair: 'keyPair', childWallet: 'childWallet'}))).not.toContain('keyPair')
  //   expect(Object.keys(handleWalletInfo({keyPair: 'keyPair', childWallet: 'childWallet'}))).not.toContain('childWallet')
  // })
})

describe('formatWalletInfo', () => {
  const password = '11111111', accountName = 'testName'
  // TODO: keyPair
  const walletInfoInput = {
    privateKey: 'privateKey',
    mnemonic: 'mnemonic',
    publicKey: 'publicKey',
    xPrivateKey: 'xPrivateKey',
    keyPair: 'keyPair',
  }
  test('walletInfoInput does not exist', () => {
    expect(formatWalletInfo(null, password, accountName)).toBeFalsy
  })
  test('walletInfoInput`privateKey exist but password does not exist', () => {
    expect(formatWalletInfo({privateKey: 'privateKey'}, '', accountName)).toBeFalsy
  })
  test('Correct input', () => {
    aes.encrypt = jest.fn()
    const res = formatWalletInfo(walletInfoInput, password, accountName)
    expect(aes.encrypt).toHaveBeenCalledTimes(2)
    expect(Object.keys(res)).toContain('walletInfo')
    expect(Object.keys(res)).toContain('accountInfo')
  })
  // TODO: keyPair
  // test('The walletInfoInput does not contain publicKey, contain keyPair', () => {
  //   const res = formatWalletInfo({keyPair: 'keyPair'}, password, accountName)
  //   expect(Object.keys(res['walletInfo'])).toContain('publicKey')
  //   expect(Object.keys(res['accountInfo'])).toContain('publicKey')
  // })
  // test('correct input, check returnValue of walletInfo', () => {
  //   const res = formatWalletInfo(walletInfoInput, password, accountName)
  //   expect(Object.keys(res['walletInfo'])).not.toContain('privateKey')
  //   expect(Object.keys(res['walletInfo'])).not.toContain('mnemonic')
  //   expect(Object.keys(res['walletInfo'])).not.toContain('xPrivateKey')
  //   expect(Object.keys(res['walletInfo'])).not.toContain('keyPair')
  //   expect(Object.keys(res['walletInfo'])).not.toContain('childWallet')
  //   expect(Object.keys(res['accountInfo'])).not.toContain('childWallet')
  // })
  // test('correct input, check returnValue of accountInfo', () => {
  //   const res = formatWalletInfo(walletInfoInput, password, accountName)
  //   expect(Object.keys(res['accountInfo'])).not.toContain('AESEncryptMnemonic')
  // })
})

describe('formatAccountInfo', () => {
  const password = '11111111', accountName = 'testName'
  const walletInfoInput = {
    privateKey: 'privateKey',
    mnemonic: 'mnemonic',
    publicKey: 'publicKey',
    xPrivateKey: 'xPrivateKey'
  }
  test('The input of walletInfoInput does not exist', () => {
    expect(formatAccountInfo({}, password, accountName)).toBeFalsy
  })
  test('walletInfoInput`privateKey exist but password does not exist', () => {
    expect(formatAccountInfo({privateKey: 'privateKey'}, '', accountName)).toBeFalsy
  })
  test('Correct input', () => {
    aes.encrypt = jest.fn()
    formatAccountInfo(walletInfoInput, password, accountName)
    expect(aes.encrypt).toHaveBeenCalledTimes(1)
  })
  // test('The walletInfoInput does not contain publicKey, contain keyPair', () => {
  //   const res = formatAccountInfo({keyPair: 'keyPair'}, password, accountName)
  //   expect(Object.keys(res)).toContain('publicKey')
  // })
  test('check the returnValue of accountInfo ', () => {
    const res = formatAccountInfo(walletInfoInput, password, accountName)
    expect(Object.keys(res)).toContain('accountName')
    expect(Object.keys(res)).toContain('accountType')
    expect(Object.keys(res)).not.toContain('privateKey')
    expect(Object.keys(res)).not.toContain('mnemonic')
    expect(Object.keys(res)).not.toContain('xPrivateKey')
    expect(Object.keys(res)).not.toContain('keyPair')
    expect(Object.keys(res)).not.toContain('childWallet')
  })
})

describe('getAccountByMnemonic', () => {
  const AESEncryptMnemonic = 'AESEncryptMnemonic', password = '11111111', BIP44Path = DefaultBIP44Path
  test('Correct input', () => {
    aes.decrypt = jest.fn().mockReturnValue(true)
    AElf.wallet.getWalletByMnemonic = jest.fn()
    const res = getAccountByMnemonic({AESEncryptMnemonic, password, BIP44Path})
    expect(aes.decrypt).toHaveBeenCalledTimes(1)
    expect(AElf.wallet.getWalletByMnemonic).toHaveBeenCalledTimes(1)
    expect(res).toBeFalsy
  })
  test('The mnemonic does not exist', () => {
    expect(getAccountByMnemonic({AESEncryptMnemonic: '', password, BIP44Path})).toBeFalsy
  })
})

describe('getAccountByPrivateKey', () => {
  beforeEach(() => {
    AElf.wallet.getWalletByPrivateKey = jest.fn().mockReturnValue({
      BIP44Path: DefaultBIP44Path
    })
  })
  const privateKey = '1111'
  test('Get wallet from privateKey', () => {
    getAccountByPrivateKey(privateKey)
    expect(AElf.wallet.getWalletByPrivateKey).toHaveBeenCalledTimes(1)
  })
  test('The returnValue is not BIP44Path', () => {
    const res = getAccountByPrivateKey(privateKey)
    expect(Object.keys(res)).not.toContain('BIP44Path')
  })
})

describe('getNextBIP44Path', () => {
  test('The input of BIP44Path is correct', () => {
    expect(getNextBIP44Path("m/44'/1616'/0'/0/0")).toBe("m/44'/1616'/0'/0/1")
  })
  test('The input of BIP44Path is wrong', () => {
    expect(getNextBIP44Path("m/44'/1616'/0'/0/a")).toBe(DefaultBIP44Path)
  })
})

describe('checkPasswordInput', () => {
  test('Password does not exist or the length less than 8', () => {
    expect(checkPasswordInput('')).toBe(PasswordErrorMessage.passwordNotLong)
    expect(checkPasswordInput('111111')).toBe(PasswordErrorMessage.passwordNotLong)
  })
  test('Password is invalid', () => {
    expect(checkPasswordInput('$#111111')).toBe(PasswordErrorMessage.invalidPassword)
  })
  test('The password is correct', () => {
    expect(checkPasswordInput('12345678')).toBeUndefined()
  })
})

describe('checkWalletNameInput', () => {
  test('walletName does not exist', () => {
    expect(checkWalletNameInput('')).toBe(WalletNameErrorMessage.enterWalletName)
  })
  test('The length of walletName more than 30', () => {
    expect(checkWalletNameInput('1111111110111111111011111111101')).toBe(WalletNameErrorMessage.walletNameToLong)
  })
  test('The walletName is not valid', () => {
    expect(checkWalletNameInput('``test')).toBe(WalletNameErrorMessage.invalidWalletName)
  })
  test('The walletName is correct', () => {
    expect(checkWalletNameInput('12345678')).toBeTruthy
  })
})

describe('checkAccountNameInput', () => {
  test('accountName does not exist', () => {
    expect(checkAccountNameInput('')).toBeUndefined()
  })
  test('The length of accountName more than 30', () => {
    expect(checkAccountNameInput('1111111110111111111011111111101')).toBe(AccountNameErrorMessage.walletNameToLong)
  })
  test('The accountName is not valid', () => {
    expect(checkAccountNameInput('``')).toBe(AccountNameErrorMessage.invalidWalletName)
  })
  test('The accountName is correct', () => {
    expect(checkAccountNameInput('12345678')).toBeUndefined()
  })
})

describe('checkPinInput', () => {
  jest.mock('@portkey/utils', () => ({
    isExtension: jest.fn().mockReturnValueOnce(true).mockReturnValue(false)
  }))
  // test('Extension platform', () => {
  //   const checkPasswordInput = jest.fn()
  //   checkPinInput('11111111')
  //   expect(checkPasswordInput).toHaveBeenCalledTimes(1)
  // })
  test('The pin is invalid', () => {
    expect(checkPinInput('11111111')).toBe(PinErrorMessage.invalidPin)
    expect(checkPinInput('')).toBe(PinErrorMessage.invalidPin)
    expect(checkPinInput('qqqqqq')).toBe(PinErrorMessage.invalidPin)
  })
  test('The pin is valid', () => {
    expect(checkPinInput('111111')).toBeUndefined()
  })
})
