import { ErrorInfo, OnErrorFunc } from '../types/error';
import { message } from 'antd';

export const verifyErrorHandler = (error: any) => {
  // let _error = isVerifyApiError(error);
  let _error: string;
  if (error?.type) {
    _error = error.type;
  } else if (typeof error === 'string') {
    _error = error;
  } else {
    _error = error?.message || error?.error?.message || 'Something error';
  }
  return _error;
};

export const contractErrorHandler = (error: any) => {
  if (typeof error === 'string') return error;
  return error?.Error?.Message || error?.message?.Message || error?.message || error?.Error;
};

export const errorTip = (errorInfo: ErrorInfo, isShowTip?: boolean, onError?: OnErrorFunc) => {
  if (isShowTip) message.error(errorInfo.error);
  onError?.(errorInfo);
};
