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
        console.log('🌈 🌈 🌈 🌈 🌈 🌈 setActivityListAction', state, action);
      })
      .addCase(getActivityListAsync.pending, state => {
        console.log('❌ pending state', state);
      })
      .addCase(getActivityListAsync.fulfilled, (state, action) => {
        console.log(
          '🌈 🌈 🌈 🌈 🌈 🌈 fulfilled state ====',
          state.totalRecordCount,
          state.data,
          state.maxResultCount,
          state.skipCount,
        );
        console.log('🌈 🌈 🌈 🌈 🌈 🌈 fulfilled action ====', action);
        const { data, totalRecordCount } = action.payload;
        state.data = [...state.data, ...data];
        state.totalRecordCount = totalRecordCount;
      })
      .addCase(getActivityListAsync.rejected, state => {
        console.log('❌ ❌ rejected state', state);
      });
  },
});

export const { addPage, clearState } = activitySlice.actions;

export default activitySlice;
