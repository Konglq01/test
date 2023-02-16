import { IStorage } from '@portkey/types/storage';
import ErrorTip from '../constants/error';

export class BaseAsyncStorage implements IStorage {
  public async getItem(key: string) {
    if (typeof localStorage !== 'undefined') return localStorage.getItem(key);
    else throw Error(ErrorTip.missStorage);
  }
  public async setItem(key: string, value: string) {
    if (typeof localStorage !== 'undefined') return localStorage.setItem(key, value);
    else throw Error(ErrorTip.missStorage);
  }
  public async removeItem(key: string) {
    if (typeof localStorage !== 'undefined') return localStorage.removeItem(key);
    else throw Error(ErrorTip.missStorage);
  }
}
