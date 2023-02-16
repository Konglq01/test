import { CAInfoType } from '@portkey/types/types-ca/wallet';
export declare function useIntervalQueryCAInfoByAddress({ uri, address, chainId, }: {
    uri?: string;
    address?: string;
    chainId?: string;
}): CAInfoType | undefined;
