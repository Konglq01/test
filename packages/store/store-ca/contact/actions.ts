import { createAsyncThunk, createAction } from '@reduxjs/toolkit';
import { ContactItemType } from '@portkey/types/types-ca/contact';
import { ContactState } from './slice';
import { FetchContractListAsyncPayloadType } from './type';
import { CONTACT_API_FETCH_SIZE, CONTACT_API_RETRY_LIMIT } from '@portkey/constants/constants-ca/contact';
import { transContactsToIndexes } from './utils';
import { WalletState } from '../wallet/type';
import { NetworkList } from '@portkey/constants/constants-ca/network';
import {
  getContactList as getContactListEs,
  getContactEventList as getContactEventListEs,
} from '@portkey/api/api-did/es/utils';

export const fetchContractListAsync = createAsyncThunk<FetchContractListAsyncPayloadType, boolean | undefined>(
  'contact/fetchContractListAsync',
  async (isInit = false, thunkAPI) => {
    const {
      contact: contactState,
      wallet: { currentNetwork, walletInfo },
    } = thunkAPI.getState() as {
      contact: ContactState;
      wallet: WalletState;
    };
    const baseUrl = NetworkList.find(item => item.networkType === currentNetwork)?.apiUrl;
    const userId = walletInfo?.caInfo[currentNetwork].AELF?.caHash;
    if (!userId || !baseUrl)
      return {
        isInit: true,
        contactIndexList: [],
        lastModified: 0,
      };

    // init
    let contactList: ContactItemType[] = [];
    if (isInit || contactState.contactIndexList.length === 0) {
      let page = 1,
        errorTimes = 0,
        totalCount = 0;

      const modificationTime = Date.now();
      while (page === 1 || contactList.length < totalCount) {
        try {
          console.log('getContactList', page, errorTimes);
          const response = await getContactListEs(baseUrl, {
            userId,
            page,
            size: CONTACT_API_FETCH_SIZE,
            modificationTime: new Date(modificationTime).toISOString(),
          });
          console.log('getContactList: response', response);
          response.items.forEach(item => (item.modificationTime = new Date(item.modificationTime).getTime()));
          contactList = contactList.concat(response.items);
          totalCount = response.totalCount;
          errorTimes = 0;
          page++;
        } catch (err) {
          errorTimes++;
          console.log('getContactList: error', errorTimes);
          if (errorTimes >= CONTACT_API_RETRY_LIMIT) {
            throw new Error(`getContactList errorTimes too many ${err}`);
          }
        }
      }

      if (contactList.length === 0) {
        throw new Error('getContactList no data');
      }

      return {
        isInit: true,
        contactIndexList: transContactsToIndexes(contactList),
        lastModified: modificationTime,
      };
    }

    // update getContactEventList
    const lastModified = contactState.lastModified;
    const fetchTime = Date.now();
    let eventList: ContactItemType[] | undefined = undefined;
    let errorTimes = 0;
    while (eventList === undefined) {
      try {
        console.log('getContactEventList', errorTimes);
        const response = await getContactEventListEs(baseUrl, {
          userId,
          modificationTime: new Date(lastModified).toISOString(),
          fetchTime: new Date(fetchTime).toISOString(),
        });
        console.log('getContactEventList: response', response);
        eventList = response.items;
        eventList.forEach(item => (item.modificationTime = new Date(item.modificationTime).getTime()));
      } catch (err) {
        errorTimes++;
        if (errorTimes >= CONTACT_API_RETRY_LIMIT) {
          throw Error(`getContactEventList errorTimes too many ${err}`);
        }
      }
    }

    if (eventList.length === 0) {
      throw new Error('getContactEventList no data');
    }

    return {
      isInit: false,
      eventList,
      lastModified: fetchTime,
    };
  },
);

export const addContractAction = createAction<ContactItemType>('contact/addContract');

export const editContractAction = createAction<ContactItemType>('contact/editContract');

export const deleteContractAction = createAction<ContactItemType>('contact/deleteContract');
