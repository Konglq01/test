import { ChainType } from '@portkey/types';
interface VerifierListParams {
    sandboxId?: string;
    rpcUrl: string;
    address: string;
    chainType: ChainType;
}
export declare const getVerifierListOnExtension: ({ sandboxId, rpcUrl, chainType, address, }: Omit<VerifierListParams, 'contract'>) => Promise<any>;
export declare const getVerifierListOthers: (params: Omit<VerifierListParams, 'sandboxId'>) => Promise<any>;
export declare const getVerifierList: (params: VerifierListParams) => Promise<any>;
export {};
