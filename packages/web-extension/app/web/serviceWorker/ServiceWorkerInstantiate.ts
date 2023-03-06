import { LocalStream } from 'extension-streams';
import { getAllStorageLocalData, getLocalStorage } from 'utils/storage/chromeStorage';
import storage from 'utils/storage/storage';
import { PublicKey } from '@portkey-wallet/types/wallet';
import { AutoLockDataKey, AutoLockDataType, DefaultLock } from 'constants/lock';
import SWEventController from 'controllers/SWEventController';
import PermissionController from 'controllers/PermissionController';
import NotificationService, { CloseParams } from 'service/NotificationService';
import ApprovalController from 'controllers/approval/ApprovalController';
import { getStoreState } from 'store/utils/getStore';
import { InternalMessageData, IPageState } from 'types/SW';
import AELFMethodController from 'controllers/methodController/AELFMethodController';
import { ConnectionsType } from 'types/storage';
import {
  AelfMessageTypes,
  MethodMessageTypes,
  PortkeyMessageTypes,
  PromptRouteTypes,
  WalletMessageTypes,
} from 'messages/InternalMessageTypes';
import InternalMessage from 'messages/InternalMessage';
import { CreatePromptType, SendResponseFun } from 'types';
import errorHandler from 'utils/errorHandler';
import { apis } from 'utils/BrowserApis';

const notificationService = new NotificationService();
// Get default data in redux
const store = getStoreState();

let seed: string | null = null;

let pageState: IPageState = {
  lockTime: AutoLockDataType[DefaultLock], // minutes
  registerStatus: undefined,
  chain: store.chain,
  wallet: store.wallet,
};

const aelfValidMethodList: string[] = Object.values(AelfMessageTypes);

const allowedMethod = [
  PortkeyMessageTypes.GET_SEED,
  PortkeyMessageTypes.SET_SEED,
  PortkeyMessageTypes.LOCK_WALLET,
  PortkeyMessageTypes.CLOSE_PROMPT,
  PortkeyMessageTypes.REGISTER_WALLET,
  PortkeyMessageTypes.CHECK_WALLET_STATUS,
  PortkeyMessageTypes.EXPAND_FULL_SCREEN,
  WalletMessageTypes.REQUEST_ACCOUNTS,
  MethodMessageTypes.GET_WALLET_STATE,
];

const PortkeyMethod = [
  PortkeyMessageTypes.GET_SEED,
  PortkeyMessageTypes.SET_SEED,
  PortkeyMessageTypes.LOCK_WALLET,
  PortkeyMessageTypes.CHECK_WALLET_STATUS,
  PortkeyMessageTypes.CLOSE_PROMPT,
  PortkeyMessageTypes.REGISTER_WALLET,
  PortkeyMessageTypes.EXPAND_FULL_SCREEN,
  WalletMessageTypes.CONNECT,
  WalletMessageTypes.SWITCH_CHAIN,
  WalletMessageTypes.REQUEST_ACCOUNTS,
  MethodMessageTypes.GET_WALLET_STATE,
];

const initPageState = async () => {
  const allStorage = await getAllStorageLocalData();
  const reduxStore = JSON.parse(allStorage[storage.reduxStorageName] ?? null);
  pageState = {
    registerStatus: allStorage[storage.registerStatus],
    lockTime: AutoLockDataType[allStorage[storage.lockTime] as AutoLockDataKey] ?? AutoLockDataType[DefaultLock],
    chain: JSON.parse(reduxStore?.['chain'] ?? null),
    wallet: JSON.parse(reduxStore?.['wallet'] ?? null),
  };
  console.log(pageState, 'pageState===');
};

// This is the script that runs in the extension's serviceWorker ( singleton )
export default class ServiceWorkerInstantiate {
  protected permissionController: PermissionController;
  protected approvalController: ApprovalController;
  protected aelfMethodController: AELFMethodController;
  constructor() {
    this.setupInternalMessaging();
    // Controller that handles portkey checks
    this.permissionController = new PermissionController({
      notificationService,
      allowedMethod,
      getPassword: () => seed,
    });
    // Controller that handles user authorization
    this.approvalController = new ApprovalController({
      notificationService,
      getPageState: this.getPageState,
    });
    // Controller that handles aelf transactions
    this.aelfMethodController = new AELFMethodController({
      notificationService,
      methodList: aelfValidMethodList,
      getPageState: this.getPageState,
      getPassword: () => seed,
    });
  }

  // Watches the internal messaging system ( LocalStream )
  async setupInternalMessaging() {
    try {
      // clearLocalStorage();
      // setLocalStorage({ connections: null });
      await initPageState();
      LocalStream.watch(async (request: any, sendResponse: SendResponseFun) => {
        const message = InternalMessage.fromJson(request);
        // reset lockout timer
        await ServiceWorkerInstantiate.checkTimingLock(sendResponse);
        // May not communicate via LocalStream.send
        if (!message.type) return;
        console.log('onMessage===watch==', message);
        const registerRes = await this.permissionController.checkIsRegisterOtherwiseRegister(message.type);
        if (registerRes.error !== 0) return sendResponse(registerRes);
        const isLocked = await this.permissionController.checkIsLockOtherwiseUnlock(message.type);
        console.log(isLocked.error, isLocked, message, 'isLocked==');
        if (isLocked.error !== 0) return sendResponse(isLocked);
        await this.dispenseMessage(sendResponse, message);
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  /**
   * Delegates message processing to methods by message type
   * @param sendResponse - Delegating response handler
   * @param message - The message to be dispensed
   */
  dispenseMessage(sendResponse: SendResponseFun, message: InternalMessageData) {
    console.log('dispenseMessage: ', message);
    // // When message.type is aelf transaction type
    // if (aelfValidMethodList.includes(message.type)) {
    //   this.aelfMethodController.dispenseMessage(message, sendResponse);
    //   return;
    // }
    if (PortkeyMethod.includes(message.type)) {
      // When message.type is portkey internal type
      switch (message.type) {
        case PortkeyMessageTypes.GET_SEED:
          ServiceWorkerInstantiate.getSeed(sendResponse);
          break;
        case PortkeyMessageTypes.SET_SEED:
          ServiceWorkerInstantiate.setSeed(sendResponse, message.payload);
          break;
        case PortkeyMessageTypes.LOCK_WALLET:
          ServiceWorkerInstantiate.lockWallet(sendResponse);
          break;
        case PortkeyMessageTypes.CHECK_WALLET_STATUS:
          this.checkWalletStatus(sendResponse);
          break;
        case PortkeyMessageTypes.CLOSE_PROMPT:
          this.notificationServiceClose(sendResponse, message.payload);
          break;
        case PortkeyMessageTypes.REGISTER_WALLET:
          ServiceWorkerInstantiate.checkRegisterStatus();
          break;
        case PortkeyMessageTypes.EXPAND_FULL_SCREEN:
          ServiceWorkerInstantiate.expandFullScreen();
          break;
        case WalletMessageTypes.CONNECT:
          this.connectWallet(sendResponse, message.payload);
          break;
        case WalletMessageTypes.SWITCH_CHAIN:
          this.switchChain(sendResponse, message.payload);
          break;
        case WalletMessageTypes.REQUEST_ACCOUNTS:
          this.getAddress(sendResponse, message.payload);
          break;
        case MethodMessageTypes.GET_WALLET_STATE:
          ServiceWorkerInstantiate.getWalletState(sendResponse);
          break;
        default:
          sendResponse({
            ...errorHandler(700001, `Portkey does not contain this method (${message.type})`),
          });
          break;
      }
    } else if (pageState.chain.currentChain.chainType === 'aelf') {
      this.aelfMethodController.dispenseMessage(message, sendResponse);
      return;
    } else {
      sendResponse({
        ...errorHandler(
          700001,
          `The current network is ${pageState.chain.currentChain.chainType}, which cannot match this method (${message.type})`,
        ),
      });
    }
  }

  /**
   *  Set SW memory data
   * @returns pageState: IPageState
   */
  static setPageState = (v: any) => {
    pageState = {
      ...pageState,
      ...v,
    };
  };

  /**
   *  Get SW memory data
   * @returns pageState: IPageState
   */
  getPageState = () => pageState;

  async switchChain(sendResponse: SendResponseFun, message: any) {
    try {
      const { rpcUrl, appName = '', appLogo = '' } = message?.params ?? {};
      const { origin } = message;
      const switchRes = await this.approvalController.authorizedToSwitchChain({
        rpcUrl,
        appName,
        appLogo,
        appHref: origin,
      });
      sendResponse(switchRes);
    } catch (e) {
      console.log(message, 'switchChain===');
    }
  }

  static expandFullScreen() {
    notificationService.openPrompt(
      {
        method: PromptRouteTypes.EXPAND_FULL_SCREEN,
      },
      'tabs',
    );
  }

  /**
   * Determine whether the portkey is locked, and if not, get the list of authorized users
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getAddress(sendResponse: SendResponseFun, _message: any) {
    try {
      if (!seed)
        return sendResponse({
          ...errorHandler(200005),
          data: {
            locked: true,
          },
        });

      const { origin: _origin } = _message;

      const connections: ConnectionsType = (await getLocalStorage('connections')) ?? {};
      const { permission } = connections[_origin] ?? {};
      const permissionAccount = permission?.accountList;

      // const _accountList = pageState.wallet.accountList;
      // console.log(permissionAccount, _accountList, 'permissionAccount==');
      // const accountListExpand: { accountName: string; publicKey?: PublicKey | undefined; address: string }[] = [];
      // permissionAccount?.map((pAccount) => {
      //   const acc = _accountList?.find((account) => account.address === pAccount);
      //   console.log(acc, 'acc===');
      //   if (acc)
      //     accountListExpand.push({
      //       accountName: acc.accountName,
      //       publicKey: acc?.publicKey,
      //       address: acc.address,
      //     });
      // });
      const accountConnect: { accountName: string; publicKey?: PublicKey | undefined; address: string }[] = [];
      const currentAccount = pageState.wallet.currentAccount;

      if (currentAccount?.address && permissionAccount?.includes(currentAccount.address)) {
        accountConnect.push({
          accountName: currentAccount.accountName,
          publicKey: currentAccount.publicKey,
          address: currentAccount.address,
        });
      } else if (permissionAccount) {
        const pAccount = pageState.wallet.accountList?.find((account) => account.address === permissionAccount[0]);
        if (pAccount)
          accountConnect.push({
            accountName: pAccount.accountName,
            publicKey: pAccount.publicKey,
            address: pAccount.address,
          });
      }
      sendResponse({
        ...errorHandler(0),
        data: {
          locked: false,
          account: accountConnect[0]?.address ? [accountConnect[0].address] : [],
          accountExpand: accountConnect,
          // accountList: permissionAccount,
          // accountListExpand,
        },
      });
    } catch (error) {
      sendResponse({ ...errorHandler(500001, error) });
    }
  }

  /**
   * Dapp connection portkey
   */
  async connectWallet(sendResponse: SendResponseFun, message: any) {
    try {
      const { origin, params = {} } = message;
      const { appName, rpcUrl, appLogo = '' } = params;
      if (rpcUrl) {
        const isSwitchChain = await this.approvalController.authorizedToSwitchChain({
          rpcUrl,
          appName,
          appLogo,
          appHref: origin,
        });
        if (isSwitchChain.error !== 0) return sendResponse(isSwitchChain);
      }

      const permissionAccount = await this.approvalController.authorizedToConnect({
        appName,
        appLogo,
        origin,
      });
      if (permissionAccount.error !== 0) return sendResponse(permissionAccount);
      const connectAccount: string[] = permissionAccount.data;

      const account = pageState.wallet.accountList?.filter((item) => item.address === connectAccount[0]);
      SWEventController.accountsChanged(account?.[0], (res) => {
        console.log(res, 'onDisconnect==accountsChanged');
      });
      console.log(connectAccount, 'connectWallet==');
      sendResponse({
        ...errorHandler(0),
        data: {
          accountName: account?.[0].accountName,
          accountType: account?.[0].accountType,
          address: account?.[0].address,
          publicKey: account?.[0].publicKey,
        },
      });
    } catch (error) {
      console.log(error, 'connectWallet==');
      return sendResponse({
        ...errorHandler(500001, error),
      });
    }
  }

  async notificationServiceClose(
    sendResponse: SendResponseFun,
    payload: {
      closeParams?: CloseParams;
      promptType?: CreatePromptType;
      isClose?: boolean;
    },
  ) {
    try {
      const isClose = payload?.isClose ?? true;
      const closeId = await notificationService[isClose ? 'close' : 'completedWithoutClose'](
        payload.closeParams,
        payload.promptType,
      );
      sendResponse({
        ...errorHandler(0),
        data: {
          closeId,
        },
      });
    } catch (error) {
      console.log(error, 'notificationServiceClose');
      sendResponse({
        ...errorHandler(500001, error),
      });
    }
  }

  async checkWalletStatus(sendResponse: SendResponseFun) {
    const registerStatus = await this.permissionController.checkRegisterStatus();
    console.log(registerStatus, 'registerStatus===');
    return sendResponse({
      ...errorHandler(0),
      data: {
        registerStatus,
        privateKey: seed,
      },
    });
  }

  static async getWalletState(sendResponse: SendResponseFun) {
    try {
      sendResponse({
        ...errorHandler(0),
        data: {
          method: MethodMessageTypes.GET_WALLET_STATE,
          chain: pageState?.chain?.currentChain,
          account: {
            address: pageState?.wallet?.currentAccount?.address,
            accountName: pageState?.wallet?.currentAccount?.accountName,
          },
          isLocked: Boolean(!seed),
        },
      });
    } catch (error) {
      sendResponse({
        ...errorHandler(200004, error),
      });
    }
  }

  /***
   * Sets the seed on scope to use from decryption
   * @param sendResponse - Delegating response handler
   * @param _seed - The seed to set
   */
  static setSeed(sendResponse: SendResponseFun, _seed: string) {
    seed = _seed;
    ServiceWorkerInstantiate.unlockWallet(sendResponse, _seed);
  }

  static getSeed(sendResponse: SendResponseFun) {
    sendResponse({
      ...errorHandler(0),
      data: { privateKey: seed },
    });
  }

  static checkTimingLock(sendResponse?: SendResponseFun) {
    apis.alarms.clear('timingLock');

    if (pageState.lockTime === AutoLockDataType.Immediately) {
      pageState.lockTime = 5;
      return;
    }
    if (seed && pageState.lockTime === AutoLockDataType.Never) {
      return;
    }
    if (seed) {
      // MV2 -> MV3 setTimeout -> alarms.create
      apis.alarms.create('timingLock', {
        delayInMinutes: pageState.lockTime ?? AutoLockDataType.OneHour,
      });
      apis.alarms.onAlarm.addListener((alarm) => {
        if (alarm.name !== 'timingLock') return;
        apis.alarms.clear(alarm.name);
        if (pageState.lockTime === AutoLockDataType.Never) return;
        const cb = (res: any) => {
          console.log(res);
        };
        ServiceWorkerInstantiate.lockWallet(sendResponse || cb);
      });
    }
  }

  static lockWallet(sendResponse: SendResponseFun) {
    try {
      seed = null;
      SWEventController.lockStateChanged(true, sendResponse);
    } catch (e) {
      sendResponse({
        ...errorHandler(500001, e),
      });
    }
  }

  static unlockWallet(sendResponse: SendResponseFun, _seed: string | null) {
    if (!_seed) return sendResponse({ ...errorHandler(500001, 'unlockWallet error') });
    SWEventController.lockStateChanged(false, sendResponse);
  }

  static async checkRegisterStatus() {
    const registerStatus = await getLocalStorage('registerStatus');
    if (registerStatus !== 'Registered') {
      return await notificationService.open({
        sendResponse: (response) => {
          console.log(response);
        },
        message: {
          method: PromptRouteTypes[registerStatus === 'registrationNotBackedUp' ? 'BACKUP_WALLET' : 'REGISTER_WALLET'],
        },
        promptType: 'tabs',
      });
    }
    return true;
  }
}
