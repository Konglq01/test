/// <reference types="react-scripts" />
interface Window {
  NightElf?: any;
  portkey_ca?: {
    on: (eventName: string, listener: (...args: any[]) => void) => any;
    // emit: (type: string, ...args: any[]) => boolean;
    removeListener: (eventName: string | symbol, listener: (...args: any[]) => void) => any;
    isConnected: () => boolean;
    request: PromiseSend<RequestArguments>;
    /**  @deprecated will be removed */
  };
}
// declare SDKs without ts files
declare module 'aelf-sdk';

// throw error without declaring
declare module '*.less';
declare module '*.module.less';
declare module './styles.module.less';

declare module '*.json';
declare module '*.css';

declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
declare module '*.gif';
declare module '*.ico';
