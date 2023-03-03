import OverlayModal from 'components/OverlayModal';
import { AppState, AppStateStatus, NativeEventSubscription } from 'react-native';
import BackgroundTimer from 'react-native-background-timer';
import navigationService from './navigationService';
import { getWalletAddress } from './redux';

export default class LockManager {
  lockTime: number;
  appState: AppStateStatus;
  listener: NativeEventSubscription;
  lockTimer?: number | null;
  locked?: boolean;
  constructor(lockTime: number) {
    this.lockTime = lockTime;
    this.appState = 'active';
    this.listener = AppState.addEventListener('change', this.handleAppStateChange);
  }

  updateLockTime(lockTime: number) {
    this.lockTime = lockTime;
  }

  handleAppStateChange = async (nextAppState: AppStateStatus) => {
    // Don't auto-lock
    if (this.lockTime === Infinity) return;

    if (nextAppState !== 'active') {
      // Auto-lock immediately
      if (this.lockTime === 0) {
        this.lockApp();
      } else {
        // Autolock after some time
        this.lockTimer = BackgroundTimer.setTimeout(() => {
          if (this.lockTimer) {
            this.lockApp();
          }
        }, this.lockTime);
      }
    } else if (this.appState !== 'active' && nextAppState === 'active') {
      // Prevent locking since it didnt reach the time threshold
      if (this.lockTimer) {
        BackgroundTimer.clearTimeout(this.lockTimer);
        this.lockTimer = null;
      }
    }

    this.appState = nextAppState;
  };

  setLockedError = (error: any) => {
    console.error('Failed to lock KeyringController', error);
  };

  gotoLockScreen = () => {
    OverlayModal.destroy();
    if (!getWalletAddress()) navigationService.reset('Referral');
    else navigationService.navigate('SecurityLock');
    this.locked = true;
  };

  lockApp = async () => {
    this.gotoLockScreen();
  };

  stopListening() {
    this.listener.remove();
  }
}
