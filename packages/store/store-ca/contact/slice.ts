import { createSlice } from '@reduxjs/toolkit';
import { ContactIndexType, ContactMapType } from '@portkey/types/types-ca/contact';
import {
  fetchContactListAsync,
  addContactAction,
  editContactAction,
  deleteContactAction,
  resetContactAction,
} from './actions';
import { executeEventToContactIndexList, sortContactIndexList, transIndexesToContactMap } from './utils';

export interface ContactState {
  lastModified: number;
  contactIndexList: ContactIndexType[];
  contactMap: ContactMapType;
}

export const initialState: ContactState = {
  lastModified: 0,
  contactIndexList: [],
  contactMap: {},
};

export const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // getContactList
      .addCase(fetchContactListAsync.fulfilled, (state, action) => {
        const { isInit, lastModified, contactIndexList, eventList } = action.payload;
        if (isInit && contactIndexList !== undefined) {
          state.contactIndexList = sortContactIndexList(contactIndexList);
          state.lastModified = lastModified;
        }

        if (!isInit && eventList !== undefined) {
          let _contactIndexList = [...state.contactIndexList];
          _contactIndexList = executeEventToContactIndexList(_contactIndexList, eventList);
          state.contactIndexList = sortContactIndexList(_contactIndexList);
          state.lastModified = lastModified;
        }

        state.contactMap = transIndexesToContactMap(state.contactIndexList);
      })
      .addCase(fetchContactListAsync.rejected, (state, action) => {
        console.log('fetchContactListAsync.rejected: error', action.error.message);
      })
      .addCase(addContactAction, (state, action) => {
        let _contactIndexList = [...state.contactIndexList];
        _contactIndexList = executeEventToContactIndexList(_contactIndexList, [action.payload]);
        state.contactIndexList = sortContactIndexList(_contactIndexList);
      })
      .addCase(editContactAction, (state, action) => {
        let _contactIndexList = [...state.contactIndexList];
        _contactIndexList = executeEventToContactIndexList(_contactIndexList, [action.payload]);
        state.contactIndexList = sortContactIndexList(_contactIndexList);
      })
      .addCase(deleteContactAction, (state, action) => {
        let _contactIndexList = [...state.contactIndexList];
        _contactIndexList = executeEventToContactIndexList(_contactIndexList, [action.payload]);
        state.contactIndexList = sortContactIndexList(_contactIndexList);
      })
      .addCase(resetContactAction, state => {
        state.contactIndexList = [];
        state.contactMap = {};
        state.lastModified = 0;
      });
  },
});

export default contactSlice;
