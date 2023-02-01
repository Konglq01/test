import { MINUTE } from '..';

export const SocketUrl = 'http://192.168.66.38:5577/ca';
export const listenList = ['caAccountRegister', 'caAccountRecover'] as const;
export const queryExpirationTime = 5 * MINUTE;
