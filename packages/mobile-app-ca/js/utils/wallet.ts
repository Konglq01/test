import { getWalletByAccount } from './redux';
import type { AccountType } from '@portkey/types/wallet';
import { ChainItemType } from '@portkey/types/chain';
import AElf from 'aelf-sdk';
import { isIOS } from '@rneui/base';
import { rsaEncryptObj } from './rsaEncrypt';
import { PUB_KEY } from 'constants/api';
import { request } from 'api';
import { CAInfo, ManagerInfo } from '@portkey/types/types-ca/wallet';
import { VerificationType } from '@portkey/types/verifier';
import { clearTimeoutInterval, setTimeoutInterval } from './Interval';

type SignType = { sign: string; sha256Sign: string };

const signObj: { [key: string]: SignType } = {};
/**
 * signMessage
 * @param address account used to sign
 * @param password account password
 * @param message the signature message, default signature address
 */
export function signMessage(address: string, password: string, message?: string) {
  const wallet = getWalletByAccount(address, password);
  if (!wallet || !wallet.keyPair) return;
  const tmpMessage = message || address;
  const key = `${address}_${tmpMessage}`;
  if (!signObj[key]) {
    const sha256Sign = JSON.stringify(wallet.keyPair.sign(AElf.utils.sha256(tmpMessage)));
    const sign = JSON.stringify(wallet.keyPair.sign(tmpMessage));
    signObj[key] = { sha256Sign, sign };
  }
  return signObj[key];
}

const baseObjectData = {
  currency: 'USD',
  udid: 'E59651DE-2162-48DC-8792-44DBA3BE1B6A',
  version: '1.1.6',
  device: isIOS ? 'iOS' : 'Android',
};
const ApiBaseObj: any = {};

/**
 * when fetch appData , use this to get base Data
 * @param
 * @returns
 */
export const getApiBaseData = ({
  currentAccount,
  currentNetwork,
  password,
}: {
  currentAccount: AccountType;
  currentNetwork: ChainItemType;
  password: string;
}): string => {
  const address = currentAccount.address;
  const key = `${address}_${currentNetwork.chainId}`;

  if (!ApiBaseObj[key]) {
    const data = {
      ...baseObjectData,
      public_key: JSON.stringify(currentAccount?.publicKey),
      chainid: currentNetwork.chainId,
      chain_id: currentNetwork.chainId,
      signature: signMessage(currentAccount?.address || '', password)?.sha256Sign,
      address,
    };
    console.log('ApiBaseObj', data);

    ApiBaseObj[key] = rsaEncryptObj(data, PUB_KEY)[0];
  }
  return ApiBaseObj[key];
};

export type TimerResult = {
  remove: () => void;
};
export function intervalGetRegisterResult({
  apiUrl,
  managerInfo,
  onPass,
  onFail,
}: {
  apiUrl: string;
  managerInfo: ManagerInfo;
  onPass?: (caInfo: CAInfo) => void;
  onFail?: (message: string) => void;
}) {
  let fetch = request.register;
  if (managerInfo.verificationType !== VerificationType.register) fetch = request.recovery;
  const timer = setTimeoutInterval(async () => {
    try {
      const req = await fetch.result({
        baseURL: apiUrl,
        data: managerInfo,
      });
      switch (req.recoveryStatus || req.registerStatus) {
        case 'pass': {
          clearTimeoutInterval(timer);
          onPass?.(req);
          break;
        }
        case 'fail': {
          clearTimeoutInterval(timer);
          onFail?.(req.recoveryMessage || req.registerMessage);
          break;
        }
        default:
          break;
      }
    } catch (error) {
      console.log(error, '=====error');
    }
  }, 3000);
  console.log(timer, '====timer');

  return {
    remove: () => clearTimeoutInterval(timer),
  };
}
