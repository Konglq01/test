export const verifyErrorHandler = (error: any) => {
  if (typeof error === 'string') return error;
  let _error: string;
  if (error?.type) _error = error.type;
  // if (_error) return _error;
  _error = error?.message || error?.error?.message || 'Something error';
  return _error;
};

export const contractErrorHandler = (error: any) => {
  return error?.Error?.Message || error?.message?.Message || error?.message || error?.Error;
};
