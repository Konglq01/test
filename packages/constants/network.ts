import { ChainType } from '@portkey/types';
import { ChainItemType } from '@portkey/types/chain';

export const DefaultChain: ChainItemType = {
  chainId: 'AELF',
  networkName: 'MainChain AELF',
  netWorkType: 'MAIN',
  rpcUrl: 'https://explorer.aelf.io/chain',
  chainType: 'aelf',
  blockExplorerURL: 'https://explorer.aelf.io/',
  key: 'https://explorer.aelf.io/chain&MainChain AELF',
  isCommon: true,
  isFixed: true,
  nativeCurrency: {
    id: '',
    name: 'ELF',
    symbol: 'ELF',
    decimal: 8,
    address: 'JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE',
  },
  basicContracts: { tokenContract: 'JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE' },
};

export const NetworkSeries: { label: string; chainType: ChainType }[] = [{ label: 'AELF series', chainType: 'aelf' }];
