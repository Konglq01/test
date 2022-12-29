import { isVerifyApiError } from '@portkey/constants/apiErrorMessage';

export const verifyErrorHandler = (error: any) => {
  let _error = isVerifyApiError(error);
  if (_error) return _error;
  if (error?.type) error.type;
  _error = error?.message || error?.error?.message || 'Something error';
  return _error;
};
