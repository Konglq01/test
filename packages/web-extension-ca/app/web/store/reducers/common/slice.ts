import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CommonState {
  isPrompt: boolean;
  isPopupInit: boolean;
}

export const initialState: CommonState = {
  isPrompt: false,
  isPopupInit: true,
};

//it automatically uses the immer library to let you write simpler immutable updates with normal mutative code
export const CommonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setIsPrompt: (state, action: PayloadAction<boolean>) => {
      state.isPrompt = action.payload;
    },
    setIsPopupInit: (state, action: PayloadAction<boolean>) => {
      state.isPopupInit = action.payload;
    },
  },
});

export const { setIsPrompt, setIsPopupInit } = CommonSlice.actions;

export default CommonSlice;
