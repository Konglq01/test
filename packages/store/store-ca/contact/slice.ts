import { createSlice } from '@reduxjs/toolkit';
import { ContactIndexType, ContactMapType } from '@portkey/types/types-ca/contact';
import { fetchContractListAsync, addContractAction, editContractAction, deleteContractAction } from './actions';
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
      .addCase(fetchContractListAsync.fulfilled, (state, action) => {
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
      .addCase(fetchContractListAsync.rejected, (state, action) => {
        console.log('fetchContractListAsync.rejected: error', action.error.message);
      })
      .addCase(addContractAction, (state, action) => {
        let _contactIndexList = [...state.contactIndexList];
        _contactIndexList = executeEventToContactIndexList(_contactIndexList, [action.payload]);
        state.contactIndexList = sortContactIndexList(_contactIndexList);
      })
      .addCase(editContractAction, (state, action) => {
        let _contactIndexList = [...state.contactIndexList];
        _contactIndexList = executeEventToContactIndexList(_contactIndexList, [action.payload]);
        state.contactIndexList = sortContactIndexList(_contactIndexList);
      })
      .addCase(deleteContractAction, (state, action) => {
        let _contactIndexList = [...state.contactIndexList];
        _contactIndexList = executeEventToContactIndexList(_contactIndexList, [action.payload]);
        state.contactIndexList = sortContactIndexList(_contactIndexList);
      });
  },
});

export default contactSlice;
