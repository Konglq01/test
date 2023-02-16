import { OpacityType } from '@portkey/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
  passwordSeed: string;
  isLoading?: boolean | OpacityType;
}

export const initialState: UserState = {
  passwordSeed: '',
};

//it automatically uses the immer library to let you write simpler immutable updates with normal mutative code
export const userSlice = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {
    setPasswordSeed: (state, action: PayloadAction<string>) => {
      state.passwordSeed = action.payload;
    },
    setGlobalLoading: (state, action: PayloadAction<boolean | OpacityType>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setPasswordSeed, setGlobalLoading } = userSlice.actions;

export default userSlice.reducer;
