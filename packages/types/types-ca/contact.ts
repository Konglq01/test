import type { NetworkType } from '../index';
export interface AddressItem {
  id: string;
  chainType: NetworkType;
  chainId: string; // AELF tDVV tDVW
  address: string;
}

export interface ContactItemType {
  id: string;
  index: string;
  name: string;
  addresses: AddressItem[];
  modificationTime: number;
  isDeleted: boolean;
}

export type GetContractListApiType = {
  totalCount: number;
  items: Array<ContactItemType>;
};

export interface RecentContactItemType extends ContactItemType {
  transferTime: String | number;
}

export type ContactIndexType = Pick<ContactItemType, 'index'> & { contacts: ContactItemType[] };

export type ContactMapType = { [key: string]: ContactItemType[] };
