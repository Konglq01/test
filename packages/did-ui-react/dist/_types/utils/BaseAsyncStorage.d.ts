import { IStorage } from '@portkey/types/storage';
export declare class BaseAsyncStorage implements IStorage {
    getItem(key: string): Promise<string | null>;
    setItem(key: string, value: string): Promise<void>;
    removeItem(key: string): Promise<void>;
}
