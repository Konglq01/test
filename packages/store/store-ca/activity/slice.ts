import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { NetworkType } from '@portkey/types/index';
import { ActivityItemType } from '@portkey/types/types-ca/activity';
import { fetchActivities } from './api';

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
export const fetchActivitiesAsync = createAsyncThunk(
  '/api/app/user-activities',
  async ({ type }: { type: NetworkType }, { getState, dispatch }) => {
    const { activity } = getState() as { activity: ActivityStateType };
    const state = activity;
    const { skipCount, totalCount, MaxResultCount } = state;
    if (skipCount < totalCount || totalCount === 0) {
      dispatch(addPage(type));
      const response = await fetchActivities({ start: skipCount, limit: MaxResultCount });
      return { type, list: response.data.items, totalCount: response.data.total };
    }
    return { type, list: [], totalCount };
  },
);

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
      .addCase(fetchActivitiesAsync.pending, state => {})
      .addCase(fetchActivitiesAsync.fulfilled, (state, action) => {
        const { type, list, totalCount } = action.payload;
        state.list = [...state.list, ...list];
        state.totalCount = totalCount;
        state.isFetchingActivities = false;
      })
      .addCase(fetchActivitiesAsync.rejected, state => {});
  },
});

export const { addPage, clearState } = activitySlice.actions;

export default activitySlice;
