import { ContactIndexType, ContactItemType } from '@portkey/types/types-ca/contact';
import { ContactState } from './slice';

export interface FetchContractListAsyncPayloadType {
  isInit: boolean;
  contactIndexList?: ContactIndexType[];
  eventList?: ContactItemType[];
  lastModified: ContactState['lastModified'];
}
