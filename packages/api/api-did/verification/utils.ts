import { IStorage, StorageBaseLoader } from '@portkey/types/storage';
import { request } from '@portkey/api/api-did';
import { RequestConfig } from '../../types';
import { TLoginStrType } from '@portkey/types/types-ca/wallet';

type VerifierInfo = {
  verifierSessionId: string;
  time: number;
};

interface SendVerificationConfig extends RequestConfig {
  params: {
    type: TLoginStrType;
    guardianAccount?: string;
    verifierId?: string;
    chainId: string | number;
  };
}

const IntervalErrorMessage = 'The interval between sending two verification codes is less than 60s';

export class Verification extends StorageBaseLoader {
  private readonly _defaultKeyName = 'portkey_did_wallet';
  private readonly _expirationTime = 60 * 1000;
  public verifierMap: {
    [key: string]: VerifierInfo;
  };
  constructor(store: IStorage) {
    super(store);
    this.verifierMap = {};
    this.load();
  }
  public async load() {
    try {
      const storageVerifierMap = await this._store.getItem(this._defaultKeyName);
      if (storageVerifierMap) this.verifierMap = JSON.parse(storageVerifierMap);
      if (typeof this.verifierMap !== 'object') this.verifierMap = {};
      console.log(this.verifierMap, '===this.verifierMap');
    } catch (error) {
      console.log(error, '====load-verification');
    }
  }
  public async save() {
    this._store.setItem(this._defaultKeyName, JSON.stringify(this.verifierMap));
  }
  public get(key: string) {
    const info = this.verifierMap[key];
    if (!info) return;
    const endTime = info.time + this._expirationTime;
    if (endTime > Date.now()) {
      return info;
    } else {
      delete this.verifierMap[key];
      this.save();
    }
  }
  public async set(key: string, value: VerifierInfo) {
    this.verifierMap[key] = value;
    await this.save();
  }
  public async sendVerificationCode(config: SendVerificationConfig) {
    const { guardianAccount, verifierId } = config.params;
    const key = guardianAccount || '' + verifierId || '';
    try {
      const req = await request.verify.sendVerificationRequest(config);
      await this.set(key, { ...req, time: Date.now() });
      return req;
    } catch (error: any) {
      const { message } = error?.error || error || {};
      const item = this.get(key);
      if (message === IntervalErrorMessage && item) return item;
      throw error;
    }
  }
}
