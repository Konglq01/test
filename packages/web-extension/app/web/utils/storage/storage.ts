import { reduxStorageName, reduxStorageToken } from 'constants/index';

const storage = {
  // in background.js
  aelfCrossMeta: 'BG_AELF_CROSSMETA',
  registerStatus: 'BG_REGISTER',
  lockTime: 'BG_LOCK_TIME',
  locked: 'BG_LOCKED',
  connections: 'BG_CONNECTIONS',

  // Prompt
  // register wallet
  //  reduxStorageName "persist:" + config.key
  reduxStorageName,
  reduxStorageToken,
};

export default storage;
// reduxStorageName persist:root
export type StorageKeyType = keyof typeof storage;
