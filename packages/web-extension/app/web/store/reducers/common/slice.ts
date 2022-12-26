import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CommonState {
  isPrompt: boolean;
}

export const initialState: CommonState = {
  isPrompt: false,
};

//it automatically uses the immer library to let you write simpler immutable updates with normal mutative code
export const CommonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setIsPrompt: (state, action: PayloadAction<boolean>) => {
      state.isPrompt = action.payload;
    },
  },
});

export const { setIsPrompt } = CommonSlice.actions;

export default CommonSlice;
