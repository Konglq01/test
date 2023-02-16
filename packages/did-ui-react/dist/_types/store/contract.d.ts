import { ContractBasic } from '@portkey/utils/contract';
type RpcUrl = string;
type ContractAddress = string;
declare class Contract {
    viewContract: Record<RpcUrl, Record<ContractAddress, ContractBasic>>;
    sendContract: Record<RpcUrl, Record<ContractAddress, ContractBasic>>;
    constructor();
    addViewContract: ({ rpcUrl, address }: {
        rpcUrl: string;
        address: string;
    }) => Promise<any>;
    addSendContract: ({ rpcUrl, address, privateKey, }: {
        rpcUrl: string;
        address: string;
        privateKey: string;
    }) => Promise<any>;
    getSendContract: ({ rpcUrl, address, privateKey, }: {
        rpcUrl: string;
        address: string;
        privateKey: string;
    }) => Promise<ContractBasic>;
    getViewContract: ({ rpcUrl, address }: {
        rpcUrl: string;
        address: string;
    }) => Promise<ContractBasic>;
}
declare const contract: Contract;
export default contract;
