import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { NetworkType } from '@portkey/types/index';
import { ActivityItemType } from '@portkey/types/types-ca/activity';
import { fetchActivities } from './api';
import { setActivityListAction, getActivityListAsync } from './action';

export type ActivityStateType = {
  MaxResultCount: number;
  skipCount: number;
  list: ActivityItemType[];
  totalCount: number;
  isFetchingActivities: boolean;
};

const initialState: ActivityStateType = {
  MaxResultCount: 10,
  skipCount: 0,
  list: [],
  totalCount: 0,
  isFetchingActivities: false,
};

//it automatically uses the immer library to let you write simpler immutable updates with normal mutative code
export const activitySlice = createSlice({
  name: 'activity',
  initialState: initialState,
  reducers: {
    addPage: (state, { payload }: { payload: NetworkType }) => {
      state.skipCount += state.MaxResultCount;
    },
    clearState: state => (state = initialState),
  },
  extraReducers: builder => {
    builder
      .addCase(setActivityListAction, (state: any, action: any) => {
        console.log('🌈 🌈 🌈 🌈 🌈 🌈 ', state, action);
      })
      .addCase(getActivityListAsync.pending, state => {
        console.log('🌈 🌈 🌈 🌈 🌈 🌈 pending state', state);
      })
      .addCase(getActivityListAsync.fulfilled, (state, action) => {
        console.log('🌈 🌈 🌈 🌈 🌈 🌈 fulfilled ====', state, action);
        // const { type, list, totalCount } = action.payload;
        // state.list = [...state.list, ...list];
        // state.totalCount = totalCount;
        // state.isFetchingActivities = false;
      })
      .addCase(getActivityListAsync.rejected, state => {
        console.log('🌈 🌈 🌈 🌈 🌈 🌈 rejected state', state);
      });
  },
});

export const { addPage, clearState } = activitySlice.actions;

export default activitySlice;
