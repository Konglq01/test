import { reduxStorageName, reduxStorageToken, reduxStorageWallet } from 'constants/index';

const storage = {
  // in background.js
  aelfCrossMeta: 'BG_AELF_CROSSMETA',
  registerStatus: 'BG_REGISTER',
  lockTime: 'BG_LOCK_TIME',
  locked: 'BG_LOCKED',
  connections: 'BG_CONNECTIONS',
  lastMessageTime: 'BG_LAST_MESSAGE_TIME',

  // Prompt
  // register wallet
  //  reduxStorageName "persist:" + config.key
  reduxStorageName,
  reduxStorageToken,
  reduxStorageWallet,

  // route state cache
  locationState: 'LOCATION_STATE',
  lastLocationState: 'LAST_LOCATION_STATE',
};

export default storage;
// reduxStorageName persist:root
export type StorageKeyType = keyof typeof storage;
