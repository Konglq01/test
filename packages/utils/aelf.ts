import AElf from 'aelf-sdk';
import { COMMON_PRIVATE } from '@portkey/constants';
import { AElfInterface } from '@portkey/types/aelf';
const Wallet = AElf.wallet;
let wallet: any = null;

export function isEqAddress(a1?: string, a2?: string) {
  return a1?.toLocaleLowerCase() === a2?.toLocaleLowerCase();
}

export function isAelfAddress(value?: string) {
  if (!value) return false;
  if (/[\u4e00-\u9fa5]/.test(value)) return false;
  if (value.includes('_') && value.split('_').length < 3) return false;
  try {
    return !!AElf.utils.decodeAddressRep(value);
  } catch {
    return false;
  }
}

export const getChainNumber = (chainId: string) => {
  return AElf.utils.chainIdConvertor.base58ToChainId(chainId);
};

export function isDIDAelfAddress(value?: string) {
  if (!value) return false;
  if (/[\u4e00-\u9fa5]/.test(value)) return false;
  if (value.includes('_') && value.split('_').length === 2) {
    const arr = value.split('_');
    const res = arr[0].length > arr[1].length ? arr[0] : arr[1];
    try {
      return !!AElf.utils.decodeAddressRep(res);
    } catch {
      return false;
    }
  }
  try {
    return !!AElf.utils.decodeAddressRep(value);
  } catch {
    return false;
  }
}

export function getAelfAddress(value: string = '') {
  const arr = value.split('_');
  if (arr.length === 3) return arr[1];
  for (let i = 0; i < arr.length; i++) {
    if (isAelfAddress(arr[i])) return arr[i];
  }
  return value;
}

export function getWallet(privateKey = COMMON_PRIVATE) {
  return Wallet.getWalletByPrivateKey(privateKey);
}

export const getAelfInstance = (rpcUrl: string) => {
  return new AElf(new AElf.providers.HttpProvider(rpcUrl, 20000));
};

export const getELFContract = async (rpcUrl: string, tokenAddress: string, privateKey?: string) => {
  const aelf = getAelfInstance(rpcUrl);
  const wallet = privateKey ? Wallet.getWalletByPrivateKey(privateKey) : getWallet();
  return await aelf.chain.contractAt(tokenAddress, wallet);
};

const isWrappedBytes = (resolvedType: any, name: string) => {
  if (!resolvedType.name || resolvedType.name !== name) {
    return false;
  }
  if (!resolvedType.fieldsArray || resolvedType.fieldsArray.length !== 1) {
    return false;
  }
  return resolvedType.fieldsArray[0].type === 'bytes';
};

const isAddress = (resolvedType: any) => isWrappedBytes(resolvedType, 'Address');

const isHash = (resolvedType: any) => isWrappedBytes(resolvedType, 'Hash');

export function transformArrayToMap(inputType: any, origin: any[]) {
  if (!origin) return '';
  if (!Array.isArray(origin)) return origin;
  if (origin.length === 0) return '';
  if (isAddress(inputType) || isHash(inputType)) return origin[0];

  const { fieldsArray } = inputType || {};
  const fieldsLength = (fieldsArray || []).length;

  if (fieldsLength === 0) return origin;

  if (fieldsLength === 1) {
    const i = fieldsArray[0];
    return { [i.name]: origin[0] };
  }

  let result = origin;
  Array.isArray(fieldsArray) &&
    Array.isArray(origin) &&
    fieldsArray.forEach((i, k) => {
      result = {
        ...result,
        [i.name]: origin[k],
      };
    });
  return result;
}

export type EncodedParams = {
  instance: AElfInterface;
  functionName: string;
  paramsOption: any;
  contract: any;
};
/**
 * encodedTx
 * @returns raw string / { error: { message } }
 */
export const encodedTx = async ({ instance, functionName, paramsOption, contract }: EncodedParams) => {
  try {
    const chainStatus = await instance.chain.getChainStatus();
    const raw = await contract[functionName].getSignedTx(paramsOption, {
      height: chainStatus?.BestChainHeight,
      hash: chainStatus?.BestChainHash,
    });
    return raw;
  } catch (e) {
    return { error: e };
  }
};

/**
 *
 * @param address
 * @param currentChainId
 */
export const isCrossChain = (address: string, currentChainId: string) => {
  if (!address.includes('_')) return false;

  const arr = address.split('_');
  const addressChainId = arr[arr.length - 1];
  return addressChainId !== currentChainId;
};
