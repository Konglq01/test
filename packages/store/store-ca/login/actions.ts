import { createAction } from '@reduxjs/toolkit';
import { loginInfo } from './type';

export const setLoginAccountAction = createAction<Omit<loginInfo, 'managerUniqueId'>>('login/setLoginAccount');
