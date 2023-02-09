import { getContactList, getContactEventList } from './api';
import { createAsyncThunk, createAction } from '@reduxjs/toolkit';
import { ContactItemType } from '@portkey/types/types-ca/contact';
import { ContactState } from './slice';
import { FetchContractListAsyncPayloadType } from './type';
import { CONTACT_API_FETCH_SIZE, CONTACT_API_RETRY_LIMIT } from '@portkey/constants/contact';
import { transContactsToIndexes } from './utils';
import { WalletState } from '../wallet/type';
import { NetworkList } from '@portkey/constants/constants-ca/network';

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
          const response = await getContactList({
            baseUrl,
            userId,
            page,
            size: CONTACT_API_FETCH_SIZE,
            modificationTime,
          });
          response.items.forEach(item => (item.modificationTime = new Date(item.modificationTime).getTime()));
          contactList = contactList.concat(response.items);
          totalCount = response.totalCount;
          errorTimes = 0;
          page++;
        } catch (err) {
          errorTimes++;
          console.log('getContactList: error', errorTimes);
          if (errorTimes >= CONTACT_API_RETRY_LIMIT) {
            throw Error(`getContactList errorTimes too many ${err}`);
          }
        }
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
        const response = await getContactEventList({
          baseUrl,
          userId,
          modificationTime: lastModified,
          fetchTime,
        });
        eventList = response.items;
        eventList.forEach(item => (item.modificationTime = new Date(item.modificationTime).getTime()));
      } catch (err) {
        errorTimes++;
        if (errorTimes >= CONTACT_API_RETRY_LIMIT) {
          throw Error(`getContactEventList errorTimes too many ${err}`);
        }
      }
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
