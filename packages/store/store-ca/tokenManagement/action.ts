import { createAction } from '@reduxjs/toolkit';
import { HandleTokenArgTypes } from '@portkey/types/types-ca/token';

export const addTokenInCurrentAccount = createAction<HandleTokenArgTypes>('token/addTokenInCurrentAccount');

export const deleteTokenInCurrentAccount = createAction<HandleTokenArgTypes>('token/deleteTokenInCurrentAccount');
