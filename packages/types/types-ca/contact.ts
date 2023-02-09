import type { NetworkType } from '../index';
import { PartialOption } from '../common';

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
  isDeleted?: boolean;
  userId?: string;
}

export type EditContactItemApiType = PartialOption<ContactItemType, 'isDeleted' | 'modificationTime' | 'index'>;
export type AddContactItemApiType = PartialOption<EditContactItemApiType, 'id'>;

export type GetContractListApiType = {
  totalCount: number;
  items: Array<ContactItemType>;
};

export interface RecentContactItemType extends ContactItemType {
  transferTime: String | number;
}

export type ContactIndexType = Pick<ContactItemType, 'index'> & { contacts: ContactItemType[] };

export type ContactMapType = { [key: string]: ContactItemType[] };
