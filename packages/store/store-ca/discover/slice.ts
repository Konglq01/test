import { createSlice } from '@reduxjs/toolkit';
import { IRecordsItemType } from '@portkey-wallet/types/types-ca/discover';

interface DiscoverStateType {
  recordsList: IRecordsItemType[];
  tabs: any[];
}

const initialState: DiscoverStateType = {
  recordsList: [],
  tabs: [],
};

//it automatically uses the immer library to let you write simpler immutable updates with normal mutative code
export const activitySlice = createSlice({
  name: 'discover',
  initialState: initialState,
  reducers: {
    addRecordsItem: (state, { payload }: { payload: IRecordsItemType }) => {
      const targetItem = state.recordsList.find(item => item.url === payload.url);

      if (targetItem) {
        const arr = state.recordsList.filter(item => item.url !== payload.url);
        arr.push(targetItem);
      } else {
        state.recordsList.push(payload);
      }
    },
    upDateRecordsItem: (state, { payload }: { payload: IRecordsItemType }) => {
      state.recordsList = state.recordsList.map(item => {
        if (item.url === payload.url) {
          return payload;
        }
        return item;
      });
    },
    clearRecordsList: state => {
      state.recordsList = [];
    },
    clearDiscover: () => initialState,
  },
});

export const { addRecordsItem, upDateRecordsItem, clearRecordsList, clearDiscover } = activitySlice.actions;

export default activitySlice;
