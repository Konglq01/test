import { createSlice } from '@reduxjs/toolkit';
import { NetworkType } from '@portkey/types/index';
import { setActivityListAction, getActivityListAsync } from './action';
import { ActivityStateType } from './type';

const initialState: ActivityStateType = {
  maxResultCount: 10,
  skipCount: 0,
  data: [],
  totalRecordCount: 0,
};

//it automatically uses the immer library to let you write simpler immutable updates with normal mutative code
export const activitySlice = createSlice({
  name: 'activity',
  initialState: initialState,
  reducers: {
    addPage: (state, { payload }: { payload: NetworkType }) => {
      state.skipCount += state.maxResultCount;
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
      })
      .addCase(getActivityListAsync.rejected, state => {
        console.log('🌈 🌈 🌈 🌈 🌈 🌈 rejected state', state);
      });
  },
});

export const { addPage, clearState } = activitySlice.actions;

export default activitySlice;
