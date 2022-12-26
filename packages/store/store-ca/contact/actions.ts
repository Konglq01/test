import { fetchContactList, getContactEventList } from './api';
import { createAsyncThunk, createAction } from '@reduxjs/toolkit';
import { ContactItemType, GetContactEventListApiType } from '@portkey/types/types-ca/contact';
import { ContactState } from './slice';
import { FetchContractListAsyncPayloadType } from './type';
import { CONTACT_API_FETCH_SIZE, CONTACT_API_RETRY_LIMIT } from '@portkey/constants/contact';
import { aggregateEvent, transContactsToIndexes } from './utils';

export const fetchContractListAsync = createAsyncThunk<FetchContractListAsyncPayloadType, boolean | undefined>(
  'contact/fetchContractListAsync',
  async (isInit = false, thunkAPI) => {
    const state = (thunkAPI.getState() as any)['contact'] as ContactState;

    // init
    let contactList: ContactItemType[] = [];
    if (isInit || state.contactIndexList.length === 0) {
      let page = 1,
        errorTimes = 0,
        curLength = 0;

      while (page === 1 || curLength >= CONTACT_API_FETCH_SIZE) {
        try {
          console.log('fetchContactList', page, errorTimes);
          const response = await fetchContactList(page, CONTACT_API_FETCH_SIZE);
          contactList = contactList.concat(response);
          curLength = response.length;
          errorTimes = 0;
          page++;
        } catch (err) {
          errorTimes++;
          console.log('fetchContactList: error', errorTimes);
          if (errorTimes >= CONTACT_API_RETRY_LIMIT) {
            throw Error(`fetchContactList errorTimes too many ${err}`);
          }
        }
      }

      return {
        isInit: true,
        contactIndexList: transContactsToIndexes(contactList),
        lastModified: Date.now(),
      };
    }

    // update getContactEventList
    const preLastModified = state.lastModified;
    const newLastModified = Date.now();
    let eventList: GetContactEventListApiType | undefined = undefined;
    let errorTimes = 0;
    while (eventList === undefined) {
      try {
        console.log('getContactEventList', errorTimes);
        eventList = await getContactEventList(preLastModified);
      } catch (err) {
        errorTimes++;
        if (errorTimes >= CONTACT_API_RETRY_LIMIT) {
          throw Error(`getContactEventList errorTimes too many ${err}`);
        }
      }
    }

    eventList = aggregateEvent(eventList);
    return {
      isInit: false,
      eventList: eventList,
      lastModified: newLastModified,
    };
  },
);
