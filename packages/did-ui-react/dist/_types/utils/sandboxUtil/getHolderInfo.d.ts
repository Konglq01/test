import { ChainType } from '@portkey/types';
interface GetHolderInfoParam {
    sandboxId?: string;
    rpcUrl: string;
    address: string;
    chainType: ChainType;
    paramsOption: {
        loginGuardianAccount?: string;
        caHash?: string;
    };
}
export declare const getHolderInfoOnExtension: ({ sandboxId, rpcUrl, chainType, address, paramsOption, }: Omit<GetHolderInfoParam, 'contract'>) => Promise<any>;
export declare const getHolderInfoOthers: (params: Omit<GetHolderInfoParam, 'sandboxId'>) => Promise<any>;
export declare const getHolderInfo: (params: GetHolderInfoParam) => Promise<any>;
export {};
