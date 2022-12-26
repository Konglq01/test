import { ContactEventItem, ContactIndexType } from '@portkey/types/types-ca/contact';
import { ContactState } from './slice';

export interface FetchContractListAsyncPayloadType {
  isInit: boolean;
  contactIndexList?: ContactIndexType[];
  eventList?: ContactEventItem[];
  lastModified: ContactState['lastModified'];
}
