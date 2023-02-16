import { ErrorInfo, OnErrorFunc } from '../types/error';
export declare const verifyErrorHandler: (error: any) => string;
export declare const contractErrorHandler: (error: any) => any;
export declare const errorTip: (errorInfo: ErrorInfo, isShowTip?: boolean, onError?: OnErrorFunc) => void;
