/**
 * @file serviceWorkerListener.ts
 *  Listen for onInstalled, storage.onChanged, tabs.onRemoved, runtime.onConnect
 */
import { AutoLockDataKey, AutoLockDataType } from 'constants/lock';
import SWController from 'controllers/SWController';
import SWEventController from 'controllers/SWEventController';
import { apis } from 'utils/BrowserApis';
import storage from 'utils/storage/storage';
import connectListener from './connectListener';

interface ListenerHandler {
  pageStateChange: (pageStateChanges: any) => void;
  checkRegisterStatus: () => Promise<unknown>;
  checkTimingLock: () => void;
}

const serviceWorkerListener = ({ pageStateChange, checkRegisterStatus, checkTimingLock }: ListenerHandler) => {
  // On first install, open a new tab with Portkey
  apis.runtime.onInstalled.addListener(async ({ reason }) => {
    checkRegisterStatus();
    console.log('reason', reason);
    // if (reason === chrome.runtime.OnInstalledReason.UPDATE) {
    //   SWEventController.onDisconnect({ ...errorHandler(600002) });
    // }
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  apis.storage.onChanged.addListener((changes, areaName) => {
    console.log('storage.onChanged', changes);
    if (storage.registerStatus in changes) {
      pageStateChange({
        registerStatus: changes[storage.registerStatus].newValue,
      });
    } else if (storage.lockTime in changes) {
      checkTimingLock();

      pageStateChange({
        lockTime: AutoLockDataType[changes[storage.lockTime].newValue as AutoLockDataKey],
      });
    } else if (storage.reduxStorageName in changes) {
      const { newValue = '{}', oldValue = '{}' } = changes[storage.reduxStorageName] ?? {};
      const { wallet: newWallet = '{}', chain: newChain = '{}' } = JSON.parse(newValue);
      const { chain: oldChain = '{}' } = JSON.parse(oldValue);

      // const { currentAccount: newCurrentAccount } = JSON.parse(newWallet);
      // const { currentAccount: oldCurrentAccount } = JSON.parse(oldWallet);

      // if (newCurrentAccount.address && oldCurrentAccount?.address !== newCurrentAccount.address) {
      //   SWEventController.accountsChanged((res) => {
      //     console.log(res, 'accountsChanged');
      //   }, newCurrentAccount);
      // }
      const { currentChain: newCurrentChain } = JSON.parse(newChain);
      const { currentChain: oldCurrentChain } = JSON.parse(oldChain);
      pageStateChange({
        wallet: JSON.parse(newWallet),
        chain: JSON.parse(newChain),
      });
      if (newCurrentChain.rpcUrl !== oldCurrentChain.rpcUrl) {
        SWEventController.chainChanged(newCurrentChain, (res) => {
          console.log(res, 'chainChanged');
        });
      }
    }
  });

  connectListener();
  apis.tabs.onRemoved.addListener((tabId) => {
    SWController.disconnectWebAppByTab(tabId);
  });
};
export default serviceWorkerListener;
