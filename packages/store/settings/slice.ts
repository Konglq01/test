import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { LockingTimeType, SettingsState } from './types';

const initialState: SettingsState = {
  autoLockingTime: 60,
  leaveTime: -Infinity,
};

//it automatically uses the immer library to let you write simpler immutable updates with normal mutative code
export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    changeLockingTime: (
      state,
      action: PayloadAction<{
        time: LockingTimeType;
      }>,
    ) => {
      const { time } = action.payload;

      state.autoLockingTime = time;
      state.leaveTime = -Infinity;
    },
    initLeaveTime: state => {
      state.leaveTime = -Infinity;
    },
    // when leave the app
    setLeaveTime: state => {
      console.log('leaver', Date.now());
      state.leaveTime = Date.now();
    },
    resetSettings: state => {
      state.autoLockingTime = LockingTimeType['60s'];
      state.leaveTime = -Infinity;
    },
  },
});

export const { changeLockingTime, initLeaveTime, setLeaveTime, resetSettings } = settingsSlice.actions;

export default settingsSlice;
