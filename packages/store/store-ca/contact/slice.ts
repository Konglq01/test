import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ContactIndexType, ContactItemType, ContactMapType } from '@portkey/types/types-ca/contact';
import { fetchContractListAsync } from './actions';
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
      // fetchContactList
      .addCase(fetchContractListAsync.fulfilled, (state, action) => {
        const { isInit, lastModified, contactIndexList, eventList } = action.payload;
        if (isInit && contactIndexList !== undefined) {
          // state.contactIndexList = sortContactIndexList(contactIndexList);
          // TODO: remove clean contacts
          state.contactIndexList = [];
          state.lastModified = lastModified;
        }

        if (!isInit && eventList !== undefined) {
          let _contactIndexList = [...state.contactIndexList];
          _contactIndexList = executeEventToContactIndexList(_contactIndexList, eventList);
          // state.contactIndexList = sortContactIndexList(_contactIndexList);
          // TODO: remove clean contacts
          state.contactIndexList = [];
          state.lastModified = lastModified;
        }

        // state.contactMap = transIndexesToContactMap(state.contactIndexList);
        // TODO: remove clean contacts
        state.contactMap = {};
      })
      .addCase(fetchContractListAsync.rejected, (state, action) => {
        console.log(action.error.message);
      });
  },
});

export default contactSlice;
