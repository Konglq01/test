import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ModalState {
  accountConnectModal: boolean;
}

export const initialState: ModalState = {
  accountConnectModal: false,
};

//it automatically uses the immer library to let you write simpler immutable updates with normal mutative code
export const ModalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    setAccountConnectModal: (state, action: PayloadAction<boolean>) => {
      state.accountConnectModal = action.payload;
    },
  },
});

export const { setAccountConnectModal } = ModalSlice.actions;

export default ModalSlice;
