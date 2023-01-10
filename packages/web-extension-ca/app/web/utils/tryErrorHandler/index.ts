import { isVerifyApiError } from '@portkey/constants/apiErrorMessage';

export const verifyErrorHandler = (error: any) => {
  // let _error = isVerifyApiError(error);
  let _error: string;
  if (error?.type) _error = error.type;
  // if (_error) return _error;
  _error = error?.message || error?.error?.message || 'Something error';
  return _error;
};
