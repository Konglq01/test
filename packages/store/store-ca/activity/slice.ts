import { createSlice } from '@reduxjs/toolkit';
import { the2ThFailedActivityItemType } from '@portkey-wallet/types/types-ca/activity';
import { getActivityListAsync } from './action';
import { ActivityStateType } from './type';
import { getCurrentActivityMapKey } from '@portkey-wallet/utils/activity';

const initialState: ActivityStateType = {
  activityMap: {},
  isFetchingActivities: false,
  failedActivityMap: {},
};

//it automatically uses the immer library to let you write simpler immutable updates with normal mutative code
export const activitySlice = createSlice({
  name: 'activity',
  initialState: initialState,
  reducers: {
    addFailedActivity: (state, { payload }: { payload: the2ThFailedActivityItemType }) => {
      state.failedActivityMap[payload?.transactionId] = payload;
    },
    removeFailedActivity: (state, { payload }: { payload: string }) => {
      delete state.failedActivityMap[payload];
    },
    clearActivity: state =>
      (state = {
        ...initialState,
        failedActivityMap: state.failedActivityMap,
      }),
    clearState: state => (state = initialState),
  },
  extraReducers: builder => {
    builder.addCase(getActivityListAsync.fulfilled, (state, action) => {
      const { data, totalRecordCount, skipCount, maxResultCount, chainId, symbol } = action.payload;
      const currentMapKey = getCurrentActivityMapKey(chainId, symbol);

      state.activityMap[currentMapKey] = {
        data: skipCount === 0 ? data : [...state.activityMap[currentMapKey].data, ...data],
        totalRecordCount,
        skipCount,
        maxResultCount,
        chainId,
        symbol,
      };
    });
  },
});

export const { addFailedActivity, removeFailedActivity, clearState, clearActivity } = activitySlice.actions;

export default activitySlice;
