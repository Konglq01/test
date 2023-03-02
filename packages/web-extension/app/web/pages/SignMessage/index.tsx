import './index.less';
import qs from 'query-string';
import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import InternalMessage from 'messages/InternalMessage';
import InternalMessageTypes from 'messages/InternalMessageTypes';
import errorHandler from 'utils/errorHandler';
import { useLoading, useNetwork, useWalletInfo } from 'store/Provider/hooks';
import CustomSvg from 'components/CustomSvg';
import SandboxEventService, { SandboxErrorCode } from 'service/SandboxEventService';
import SandboxEventTypes from 'messages/SandboxEventTypes';
import getPrivateKeyAndMnemonic from 'utils/Wallet/getPrivateKeyAndMnemonic';
import { Button, message } from 'antd';
import { AccountType } from '@portkey-wallet/types/wallet';
import { ChainItemType } from '@portkey-wallet/types/chain';
import { WalletError } from '@portkey-wallet/store/wallet/type';
import getTransactionFee from 'utils/sandboxUtil/getTransactionFee';
import { divDecimalsStr } from '@portkey-wallet/utils/converter';
import { ZERO } from '@portkey-wallet/constants/misc';
import clsx from 'clsx';
import checkMain from 'utils/util.isMain';
import { useGetELFRateQuery } from '@portkey-wallet/store/rate/api';
import { useTranslation } from 'react-i18next';

interface AppInfoType {
  appName: string;
  appLogo?: string;
  appHref?: string;
  account: string;
  rpcUrl: string;
  contractAddress: string;
  contractName: string;
  methodName: string;
  isGetSignTx?: 0 | 1;
  paramsOption: any[];
}

export default function SignMessage() {
  const { t } = useTranslation();
  const { search } = useLocation();
  const { chainList, currentChain } = useNetwork();
  const { accountList } = useWalletInfo();
  const [appInfo, setAppInfo] = useState<AppInfoType>();
  const [privateKey, setPrivateKey] = useState<string>();
  const [account, setAccount] = useState<AccountType>();
  const [chain, setChain] = useState<ChainItemType>();
  const [transactionFee, setTransactionFee] = useState<string>();
  const [, setLoading] = useLoading();
  const { data: rate } = useGetELFRateQuery({});
  const isMain = checkMain(currentChain.netWorkType, currentChain.chainId);

  const getPrivateData = useCallback(async (AESEncryptPrivateKey?: string) => {
    if (!AESEncryptPrivateKey) throw 'Something error: getPrivateData';
    const { data } = await InternalMessage.payload(InternalMessageTypes.GET_SEED).send();
    const { privateKey: password } = data ?? {};
    return await getPrivateKeyAndMnemonic({ AESEncryptPrivateKey }, password);
  }, []);

  const getTranslationInfo = useCallback(
    async (data: AppInfoType) => {
      const account = (accountList || []).filter((account) => account.address === data?.account)[0];
      const chain = chainList.filter((chain) => chain.rpcUrl === data?.rpcUrl)[0];
      setAccount(account);
      setChain(chain);
      const privateData = await getPrivateData(account.AESEncryptPrivateKey);
      if (!privateData?.privateKey) return message.error(t(WalletError.invalidPrivateKey));
      setPrivateKey(privateData.privateKey);
      const transactionRes = await getTransactionFee({
        privateKey: privateData.privateKey,
        contractAddress: data.contractAddress,
        paramsOption: data.paramsOption[0],
        chainType: chain.chainType,
        methodName: data.methodName,
        rpcUrl: data.rpcUrl,
      });
      if (!transactionRes?.message || transactionRes?.code === SandboxErrorCode.error)
        throw Error(transactionRes?.message?.Error?.Message ?? transactionRes?.message ?? 'something error');
      const fee = transactionRes.message[currentChain.nativeCurrency?.symbol ?? 'ELF'];
      fee && setTransactionFee(divDecimalsStr(ZERO.plus(fee), currentChain.nativeCurrency?.decimals));
    },
    [accountList, chainList, currentChain, getPrivateData, t],
  );

  useEffect(() => {
    try {
      const data = JSON.parse(qs.parse(search).detail);
      console.log(data, 'SignMessage');
      setAppInfo(data);
      getTranslationInfo(data);
    } catch (error) {
      console.log('error', error);
      InternalMessage.payload(InternalMessageTypes.CLOSE_PROMPT, {
        closeParams: { ...errorHandler(400001, error) },
      }).send();
    }
  }, [search, getTranslationInfo]);

  const onSign = useCallback(async () => {
    if (!appInfo || !chain?.chainType) return;
    setLoading(true);
    const res = await SandboxEventService.dispatchAndReceive(SandboxEventTypes.callSendMethod, {
      rpcUrl: appInfo.rpcUrl,
      address: appInfo.contractAddress,
      methodName: appInfo.methodName,
      privateKey,
      chainType: chain.chainType,
      paramsOption: appInfo.paramsOption,
      isGetSignTx: appInfo.isGetSignTx,
    });
    setLoading(false);
    InternalMessage.payload(InternalMessageTypes.CLOSE_PROMPT, {
      closeParams: {
        ...errorHandler(res.code === SandboxErrorCode.error ? 700001 : 0),
        data: res.message,
      },
    }).send();
  }, [appInfo, chain, privateKey, setLoading]);

  return (
    <div className="dapp-modal sign-message-wrapper">
      <div className="chain-wrap">
        <span className="status" />
        {currentChain.networkName}
      </div>

      <div className="account-wrap">
        <div className="name">{account?.accountName ?? ''}</div>
        <CustomSvg type="Oval" />
        <div className="address">
          {(appInfo?.contractAddress ?? '').slice(0, 7)}...{(appInfo?.contractAddress ?? '').slice(-8)}
        </div>
        <div className="line" />
      </div>
      <div className="method-wrap">
        <p className="title">{t('Method')}</p>
        <p className="name">{appInfo?.methodName || ''}</p>
      </div>

      {appInfo && (
        <div className="detail-wrap">
          <h4 className="title">{t(appInfo.isGetSignTx ? 'Message' : 'Details')}</h4>
          <div className={clsx('params', appInfo.methodName === 'Transfer' && 'transfer')}>
            {appInfo.methodName === 'Transfer' ? (
              <>
                <div>
                  <p className="title">{t('Address')}</p>
                  <p className="value">{appInfo.paramsOption[0].to}</p>
                </div>
                <div>
                  <p className="title">{t('Amount')}</p>
                  <p className="value">{appInfo.paramsOption[0].amount}</p>
                </div>
                <div>
                  <p className="title">Symbol</p>
                  <p className="value">{appInfo.paramsOption[0].symbol}</p>
                </div>
              </>
            ) : (
              <textarea value={JSON.stringify(appInfo?.paramsOption, null, 2)} style={{ width: 500, height: 500 }} />
            )}
          </div>
          {!appInfo.isGetSignTx && (
            <div className="fee">
              <span className="label">{t('Transaction Fee')}</span>
              <div>
                <span className="elf">
                  {transactionFee ?? '--'} {currentChain.nativeCurrency?.symbol ?? 'ELF'}
                </span>
                {isMain && (
                  <span className="usd">
                    $
                    {transactionFee
                      ? ZERO.plus(transactionFee || '')
                          .multipliedBy(rate?.USDT || 0)
                          .toFixed(2)
                      : '0'}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      <div className="btn-wrap">
        <Button
          onClick={() => {
            InternalMessage.payload(InternalMessageTypes.CLOSE_PROMPT, {
              closeParams: {
                ...errorHandler(700001, 'canceled'),
              },
            }).send();
          }}>
          {t('Reject')}
        </Button>
        <Button
          type="primary"
          disabled={!privateKey || !appInfo || !chain?.chainType || !chain?.rpcUrl}
          onClick={onSign}>
          {t('Sign')}
        </Button>
      </div>
    </div>
  );
}
