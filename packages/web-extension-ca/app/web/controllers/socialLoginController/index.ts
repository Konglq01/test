import { apis } from 'utils/BrowserApis';

const GOOGLE_OAUTH2_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const APPLE_OAUTH2_URL = 'https://appleid.apple.com/auth/authorize';

export default class SocialLoginController {
  public isSocialLogin: boolean;
  public authTabId?: number;
  constructor() {
    this.isSocialLogin = false;
  }
  startSocialLogin(onCancel?: () => void) {
    this.isSocialLogin = true;

    const createdListener = (tab: chrome.tabs.Tab) => {
      if (this.isOAuthTabs(tab.url ?? '')) this.authTabId = tab.id;
    };

    apis.tabs.onCreated.addListener(createdListener);
    const rmListener = (tabId: number) => {
      if (tabId === this.authTabId) {
        apis.tabs.onCreated.removeListener(createdListener);
        apis.tabs.onRemoved.removeListener(rmListener);
        onCancel?.();
      }
    };
    apis.tabs.onRemoved.addListener(rmListener);
  }

  isOAuthTabs(url: string) {
    return !url.includes(GOOGLE_OAUTH2_URL) || !url.includes(APPLE_OAUTH2_URL);
  }
}
