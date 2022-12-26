import { CONTACT_EVENT_TYPE } from '@portkey/constants/contact';
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
}

export type FetchContractListApiType = Array<ContactItemType>;

export interface ContactEventItem {
  type: CONTACT_EVENT_TYPE;
  contactId: ContactItemType['id'];
  updateTime: number;
  contact?: ContactItemType;
}

export type GetContactEventListApiType = Array<ContactEventItem>;

export interface RecentContactItemType extends ContactItemType {
  transferTime: String | number;
}

export type ContactIndexType = Pick<ContactItemType, 'index'> & { contacts: ContactItemType[] };

export type ContactMapType = { [key: string]: ContactItemType[] };
