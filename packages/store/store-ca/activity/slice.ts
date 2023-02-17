import { createSlice } from '@reduxjs/toolkit';
import { NetworkType } from '@portkey/types/index';
import { the2ThFailedActivityItemType } from '@portkey/types/types-ca/activity';
import { getActivityListAsync } from './action';
import { ActivityStateType } from './type';

const initialState: ActivityStateType = {
  maxResultCount: 10,
  skipCount: 0,
  data: [],
  totalRecordCount: 0,
  isFetchingActivities: false,
  failedActivityMap: {},
};

//it automatically uses the immer library to let you write simpler immutable updates with normal mutative code
export const activitySlice = createSlice({
  name: 'activity',
  initialState: initialState,
  reducers: {
    addPage: (state, { payload }: { payload: NetworkType }) => {
      state.skipCount += state.maxResultCount;
    },
    addFailedActivity: (state, { payload }: { payload: the2ThFailedActivityItemType }) => {
      state.failedActivityMap[payload?.transactionId] = payload;
    },
    clearState: state => (state = initialState),
  },
  extraReducers: builder => {
    builder.addCase(getActivityListAsync.fulfilled, (state, action) => {
      const { data, totalRecordCount } = action.payload;
      state.data = [...state.data, ...data];
      state.totalRecordCount = totalRecordCount;
    });
  },
});

export const { addPage, addFailedActivity, clearState } = activitySlice.actions;

export default activitySlice;
