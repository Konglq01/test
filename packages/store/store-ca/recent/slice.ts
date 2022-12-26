import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ContactItemType, RecentContactItemType } from '@portkey/types/types-ca/contact';

export interface RecentStateType {
  recentContactList: any[];
}

export const initialState: RecentStateType = {
  recentContactList: [],
};

export const recentSlice = createSlice({
  name: 'recent',
  initialState,
  reducers: {
    addRecentContact: (
      state,
      action: PayloadAction<{
        contact: ContactItemType;
      }>,
    ) => {
      const { contact } = action.payload;
      const contactItem: RecentContactItemType = {
        ...contact,
        name: contact.name ?? '',
        id: contact.id ?? contact.addresses[0]?.address,
        transferTime: Date.now(),
      };

      const len = state.recentContactList.length;

      // same contact
      if (contactItem.id === state.recentContactList[0].id) {
        state.recentContactList[0].transferTime = contactItem.transferTime;
      } else {
        // different contact
        if (len === 100) state.recentContactList.pop();
        state.recentContactList.unshift(contactItem);
      }

      // const existed: boolean = !!state.recentContactList.find(item => item?.id === contactItem?.id);
      // if (existed) {
      //   const tmpRecentList = state.recentContactList.filter(ele => ele.id !== contactItem.id);
      //   tmpRecentList.unshift(contactItem);
      //   state.recentContactList = tmpRecentList;
      // } else {
      //   if (len === 100) state.recentContactList.pop();
      //   state.recentContactList.unshift(contactItem);
      // }
    },
    upDateContact: (
      state,
      action: PayloadAction<{
        contact: ContactItemType;
      }>,
    ) => {
      const { contact } = action.payload;
      const index = state.recentContactList.findIndex(ele => ele.id === contact.id);

      state.recentContactList[index] = contact;
    },
    clearRecentContactList: state => {
      state.recentContactList = [];
    },
  },
});

export const { addRecentContact, clearRecentContactList } = recentSlice.actions;

export default recentSlice;
