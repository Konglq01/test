import { ChainId, ChainType } from '@portkey-wallet/types';
import { isAddress as web3IsAddress } from 'web3-utils';
import { isAelfAddress, isDIDAelfAddress } from './aelf';
import * as uuid from 'uuid';

/**
 * format address like "aaa...bbb" to "ELF_aaa...bbb_AELF"
 * @param address
 * @param chainId
 * @param chainType
 * @returns
 */
export const addressFormat = (
  address: string = 'address',
  chainId: ChainId = 'AELF',
  chainType: ChainType = 'aelf',
): string => {
  if (chainType !== 'aelf') return address;
  const arr = address.split('_');
  if (address.includes('_') && arr.length < 3) return address;
  if (address.includes('_')) return `ELF_${arr[1]}_${chainId}`;
  return `ELF_${address}_${chainId}`;
};

export function isAddress(address: string, chainType: ChainType = 'aelf') {
  if (chainType === 'aelf') return isAelfAddress(address);
  return web3IsAddress(address);
}

export function isDIDAddress(address: string, chainType: ChainType = 'aelf') {
  if (chainType === 'aelf') return isDIDAelfAddress(address);
  return web3IsAddress(address);
}

export const getChainIdByAddress = (address: string, chainType: ChainType = 'aelf') => {
  // if (!isAddress(address)) throw Error(`${address} is not address`);

  if (chainType === 'aelf') {
    if (address.includes('_')) {
      const arr = address.split('_');
      return arr[arr.length - 1];
    } else {
      return 'AELF';
    }
  }
  throw Error('Not support');
};

const protocolAndDomainRE = /^(?:\w+:)?\/\/(\S+)$/;
const localhostDomainRE = /^localhost[\:?\d]*(?:[^\:?\d]\S*)?$/;
const nonLocalhostDomainRE = /^[^\s\.]+\.\S{2,}$/;

export function isUrl(string: string) {
  if (typeof string !== 'string') {
    return false;
  }

  const match = string.match(protocolAndDomainRE);
  if (!match) {
    return false;
  }

  const everythingAfterProtocol = match[1];
  if (!everythingAfterProtocol) {
    return false;
  }

  if (localhostDomainRE.test(everythingAfterProtocol) || nonLocalhostDomainRE.test(everythingAfterProtocol)) {
    return true;
  }

  return false;
}

export const enumToMap = (v: object) => {
  const newMap: any = {};
  Object.entries(v).forEach(([index, value]) => {
    newMap[index] = value;
    newMap[value] = index;
  });
  return newMap;
};

export function formatRpcUrl(rpc: string) {
  rpc = rpc.trim();
  const length = rpc.length;
  if (rpc[length - 1] === '/') return rpc.slice(0, length - 1);
  return rpc;
}

export function strIncludes(str1: string, str2: string) {
  return str1.toLowerCase().includes(str2.toLowerCase().trim());
}

export const sleep = (time: number) => {
  return new Promise<void>(resolve => {
    const timeout = setTimeout(() => {
      clearTimeout(timeout);
      resolve();
    }, time);
  });
};

export function getExploreLink(
  explorerUrl: string,
  data: string,
  type: 'transaction' | 'token' | 'address' | 'block' = 'address',
): string {
  const prefix = explorerUrl[explorerUrl.length - 1] !== '/' ? explorerUrl + '/' : explorerUrl;
  switch (type) {
    case 'transaction': {
      return `${prefix}tx/${data}`;
    }
    case 'token': {
      return `${prefix}token/${data}`;
    }
    case 'block': {
      return `${prefix}block/${data}`;
    }
    case 'address':
    default: {
      return `${prefix}address/${data}`;
    }
  }
}

export function isPrivateKey(privateKey?: string) {
  try {
    if (privateKey && typeof privateKey === 'string')
      return Uint8Array.from(Buffer.from(privateKey, 'hex')).length === 32;
  } catch (error) {
    return false;
  }
  return false;
}

export const isExtension = () => process.env.DEVICE === 'extension';

export const randomId = () => uuid.v4().replace(/-/g, '');

export const handleError = (error: any, errorText?: string) => {
  error = error?.error || error;
  if (typeof error === 'string') return error;
  if (typeof error.message === 'string') return error.message;
  return errorText;
};

export const chainShowText = (chain: ChainId) => (chain === 'AELF' ? 'MainChain' : 'SideChain');
