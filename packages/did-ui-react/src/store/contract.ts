import { getELFContract } from '@portkey/utils/aelf';
import { ContractBasic } from '@portkey/utils/contract';

type RpcUrl = string;
type ContractAddress = string;

class Contract {
  viewContract: Record<RpcUrl, Record<ContractAddress, ContractBasic>>;
  sendContract: Record<RpcUrl, Record<ContractAddress, ContractBasic>>;
  constructor() {
    this.viewContract = {};
    this.sendContract = {};
  }

  addViewContract = async ({ rpcUrl, address }: { rpcUrl: string; address: string }) => {
    const contract = await getELFContract(rpcUrl, address);
    this.viewContract[rpcUrl] = {
      [address]: contract,
    };
    return contract;
  };

  addSendContract = async ({
    rpcUrl,
    address,
    privateKey,
  }: {
    rpcUrl: string;
    address: string;
    privateKey: string;
  }) => {
    const contract = await getELFContract(rpcUrl, address, privateKey);
    this.sendContract[rpcUrl] = {
      [address]: contract,
    };
    return contract;
  };

  getSendContract = async ({
    rpcUrl,
    address,
    privateKey,
  }: {
    rpcUrl: string;
    address: string;
    privateKey: string;
  }): Promise<ContractBasic> => {
    const contract = this.viewContract?.[rpcUrl]?.[address];
    if (contract) return contract;
    return await this.addSendContract({
      rpcUrl,
      address,
      privateKey,
    });
  };

  getViewContract = async ({ rpcUrl, address }: { rpcUrl: string; address: string }): Promise<ContractBasic> => {
    let contract = this.viewContract?.[rpcUrl]?.[address];
    if (contract) return contract;
    contract = await this.addViewContract({ rpcUrl, address });
    return contract;
  };
}

const contract = new Contract();

export default contract;
