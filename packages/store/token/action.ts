import { createAction } from '@reduxjs/toolkit';
import { HandleTokenArgTypes } from '@portkey/types/types-eoa/token';

export const addTokenInCurrentAccount = createAction<HandleTokenArgTypes>('token/addTokenInCurrentAccount');

export const deleteTokenInCurrentAccount = createAction<HandleTokenArgTypes>('token/deleteTokenInCurrentAccount');
