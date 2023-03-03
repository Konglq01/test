import SandboxEventTypes from 'messages/SandboxEventTypes';
import { encodedTx, getAelfInstance, getELFContract } from '@portkey-wallet/utils/aelf';
import SandboxEventService, { SandboxErrorCode } from 'service/SandboxEventService';
import { ChainType } from '@portkey-wallet/types';
import { TokenItemType } from '@portkey-wallet/types/types-eoa/token';
import { customFetch } from '@portkey-wallet/utils/fetch';

interface useBalancesProps {
  tokens: TokenItemType | TokenItemType[];
  rpcUrl: string;
  delay?: number;
  account?: string;
  chainType?: ChainType;
  sid: string;
}

type SendBack = (
  event: MessageEvent<any>,
  response?: {
    code: SandboxErrorCode;
    message?: any;
    sid: string;
    error?: any;
  },
) => void;
type RpcUrl = string;
type ContractAddress = string;
type FromAccountPrivateKey = string;
type ContractInstance = any;
let contracts: Record<RpcUrl, Record<ContractAddress, ContractInstance>> = {};
let accountContracts: Record<RpcUrl, Record<FromAccountPrivateKey, Record<string, ContractInstance>>> = {};

class SandboxUtil {
  constructor() {
    this.listener();
  }

  static callback(
    event: MessageEvent<any>,
    response?: {
      code: SandboxErrorCode;
      message?: any;
      sid: string;
    },
  ) {
    SandboxEventService.dispatchToOrigin(event, response);
  }

  listener() {
    window.addEventListener('message', async function (event) {
      console.log(event, 'event===');
      switch (event.data.event) {
        case SandboxEventTypes.getBalances:
          SandboxUtil.getBalances(event, SandboxUtil.callback);
          break;
        case SandboxEventTypes.callViewMethod:
          SandboxUtil.callViewMethod(event, SandboxUtil.callback);
          break;
        case SandboxEventTypes.callSendMethod:
          SandboxUtil.callSendMethod(event, SandboxUtil.callback);
          break;
        case SandboxEventTypes.getTransactionFee:
          SandboxUtil.getTransactionFee(event, SandboxUtil.callback);
          break;
        case SandboxEventTypes.initViewContract:
          SandboxUtil.initViewContract(event, SandboxUtil.callback);
          break;
        default:
          break;
      }
    });
  }

  static async initViewContract(event: MessageEvent<any>, callback: SendBack) {
    const data = event.data.data ?? {};
    try {
      const { rpcUrl, address, chainType } = data;
      // TODO only support aelf
      if (chainType !== 'aelf') {
        return callback(event, {
          code: SandboxErrorCode.error,
          message: 'Not support',
          sid: data.sid,
        });
      }
      const contract = await SandboxUtil._getELFViewContract(rpcUrl, address);
      console.log(contract, 'initViewContract');
    } catch (error) {
      console.log(error, 'initViewContract===error');
    }
  }

  static async getBalances(event: MessageEvent<any>, callback: SendBack) {
    const data: useBalancesProps = event.data.data;
    const sid = data.sid;
    if (!data.rpcUrl || !data.tokens) return;
    let tokensList: string[] = [];
    let tokenAddress = '';
    if (Array.isArray(data.tokens)) {
      tokensList = data.tokens.map((item) => item.symbol);
      tokenAddress = data.tokens[0].address;
    } else {
      tokensList = [data.tokens.symbol];
      tokenAddress = data.tokens.address;
    }
    if (!data?.account)
      return callback(event, {
        code: SandboxErrorCode.success,
        message: tokensList.map(() => '0'),
        sid,
      });
    let promise;

    if (data.chainType === 'aelf') {
      // elf chain
      promise = tokensList.map(async (symbol) => {
        // if (symbol) return getELFChainBalance(tokenContract, symbol, data.account ?? '');
        if (symbol) {
          const contract = await SandboxUtil._getELFViewContract(data.rpcUrl, tokenAddress);
          const result = await contract.GetBalance.call({
            symbol,
            owner: data.account,
          });
          return result?.balance ?? result?.amount ?? 0;
        }
      });
    } else if (data.chainType === 'ethereum') {
      return callback(event, {
        message: 'Not Support',
        code: SandboxErrorCode.error,
        sid,
      });
      // erc20 chain
      // promise = tokensList.map(i => {
      //   if (i && library) return getBalance(library, i, account);
      // });
      // const web3 = new Web3(new Web3.providers.HttpProvider('https://iotexrpc.com'));
      // const data = await web3.eth.getBalance('0x51a441bbFD263F7a192e0A071b1269c5c38F4836');
      // console.log(data, 'Web3==data==');
    } else {
      // other not support
      return callback(event, {
        message: 'Not Support',
        code: SandboxErrorCode.error,
        sid,
      });
    }
    if (!promise) throw Error('Something error');
    const bs = await Promise.all(promise);
    callback(event, {
      code: SandboxErrorCode.success,
      message: bs,
      sid,
    });
  }

  static async _getELFViewContract(rpcUrl: string, address: string, privateKey?: string) {
    let _contract = contracts?.[rpcUrl]?.[address];
    if (!_contract) {
      _contract = await getELFContract(rpcUrl, address, privateKey);
      // contracts
      contracts = {
        ...contracts,
        [rpcUrl]: {
          ...(contracts[rpcUrl] ?? {}),
          [address]: _contract,
        },
      };
    }
    return _contract;
  }

  static async _getELFSendContract(rpcUrl: string, address: string, privateKey: string) {
    let _contract = accountContracts?.[rpcUrl]?.[privateKey]?.[address];
    if (!_contract) {
      _contract = await getELFContract(rpcUrl, address, privateKey);
      // accountContracts
      accountContracts = {
        ...accountContracts,
        [rpcUrl]: {
          ...(contracts[rpcUrl] ?? {}),
          [privateKey]: {
            ...(contracts[rpcUrl]?.[privateKey] ?? {}),
            [address]: _contract,
          },
        },
      };
    }
    console.log(_contract, '_getELFSendContract');

    return _contract;
  }

  static async callViewMethod(event: MessageEvent<any>, callback: SendBack) {
    const data = event.data.data ?? {};
    try {
      const { rpcUrl, address, methodName, paramsOption, chainType } = data;
      if (!rpcUrl || !address || !methodName)
        return callback(event, {
          code: SandboxErrorCode.error,
          message: 'Invalid argument',
          sid: data.sid,
        });
      // TODO only support aelf
      if (chainType !== 'aelf') {
        return callback(event, {
          code: SandboxErrorCode.error,
          message: 'Not support',
          sid: data.sid,
        });
      }
      const contract = await SandboxUtil._getELFViewContract(rpcUrl, address);
      const result = await contract[methodName].call(paramsOption);
      console.log(result, 'callViewMethod');
      callback(event, {
        code: SandboxErrorCode.success,
        message: result,
        sid: data.sid,
      });
    } catch (error) {
      callback(event, {
        code: SandboxErrorCode.error,
        message: error,
        sid: data.sid,
      });
    }
  }

  static async callSendMethod(event: MessageEvent<any>, callback: SendBack) {
    const data = event.data.data ?? {};

    try {
      const { rpcUrl, address, methodName, privateKey, paramsOption, chainType, isGetSignTx = 0 } = data;
      console.log(data, 'callSendMethod');

      if (!rpcUrl || !address || !methodName)
        return callback(event, {
          code: SandboxErrorCode.error,
          message: 'Invalid argument',
          sid: data.sid,
        });
      // TODO only support aelf
      if (chainType !== 'aelf') {
        return callback(event, {
          code: SandboxErrorCode.error,
          message: 'Not support',
          sid: data.sid,
        });
      }
      const contract = await SandboxUtil._getELFSendContract(rpcUrl, address, privateKey);
      console.log(contract, 'callSendMethod==contract===');
      const functionNameUpper = methodName.replace(methodName[0], methodName[0].toLocaleUpperCase());
      console.log(contract, functionNameUpper, '1callSendMethod==');
      let contractMethod = contract[functionNameUpper];
      contractMethod = !isGetSignTx ? contractMethod : contractMethod.getSignedTx;
      const req = await contractMethod(...paramsOption);
      if (req.error)
        return callback(event, {
          code: SandboxErrorCode.error,
          message: req.errorMessage?.message || req.error.message?.Message,
          sid: data.sid,
          error: req.error,
        });
      // const { TransactionId } = req.result || req;
      // await sleep(1000);
      // const aelfInstance = getAelfInstance(rpcUrl);
      // const validTxId = await getTxResult(aelfInstance, TransactionId);
      return callback(event, { code: SandboxErrorCode.success, message: req, sid: data.sid });
    } catch (e: any) {
      callback(event, {
        code: SandboxErrorCode.error,
        message: e?.message ?? e.Error ?? e.Status,
        sid: data.sid,
      });
    }
  }

  static async getTransactionFee(event: MessageEvent<any>, callback: SendBack) {
    const data = event.data.data ?? {};
    try {
      const { rpcUrl, address, paramsOption, chainType, methodName, privateKey } = data;
      console.log('>>>>>data', data);
      // TODO only support aelf
      if (chainType !== 'aelf') throw 'Not support';
      const aelfInstance = getAelfInstance(rpcUrl);
      const aelfContract = await SandboxUtil._getELFSendContract(rpcUrl, address, privateKey);
      const raw = await encodedTx({
        instance: aelfInstance,
        contract: aelfContract,
        functionName: methodName,
        paramsOption,
      });
      if (raw.error) throw raw.error;
      const transaction = await customFetch(`${rpcUrl}/api/blockChain/calculateTransactionFee`, {
        method: 'POST',
        params: {
          RawTransaction: raw,
        },
      });
      console.log(transaction, 'gas===getTransactionFee');
      if (!transaction?.Success) throw 'Transaction failed';
      callback(event, {
        code: SandboxErrorCode.success,
        message: transaction.TransactionFee,
        sid: data.sid,
      });
    } catch (e) {
      return callback(event, {
        code: SandboxErrorCode.error,
        message: e,
        sid: data.sid,
      });
    }
  }
}

new SandboxUtil();
