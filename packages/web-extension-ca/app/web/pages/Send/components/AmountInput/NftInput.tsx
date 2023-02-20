import { ZERO } from '@portkey/constants/misc';
import { BaseToken } from '@portkey/types/types-ca/token';
import { Input, message } from 'antd';
import { parseInputChange } from '@portkey/utils/input';
import { handleKeyDownInt } from 'pages/Send/utils/util.keyDown';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCurrentChain } from '@portkey/hooks/hooks-ca/chainList';
import { ChainId } from '@portkey/types';
import { getBalance } from 'utils/sandboxUtil/getBalance';
import { useCurrentNetworkInfo } from '@portkey/hooks/hooks-ca/network';
import { divDecimals, divDecimalsStr, timesDecimals, unitConverter } from '@portkey/utils/converter';
import getTransactionFee from 'utils/sandboxUtil/getTransactionFee';
import { WalletError } from '@portkey/store/wallet/type';
import { useUserInfo } from 'store/Provider/hooks';
import aes from '@portkey/utils/aes';
import { SandboxErrorCode } from '@portkey/utils/sandboxService';
import getTransferFee from 'pages/Send/utils/getTransferFee';
import { useCurrentWalletInfo } from '@portkey/hooks/hooks-ca/wallet';
import { contractErrorHandler } from '@portkey/did-ui-react/src/utils/errorHandler';

export default function NftInput({
  toAccount,
  fromAccount,
  token,
  value,
  errorMsg,
  onChange,
  onTxFeeChange,
  onCheckValue,
}: {
  fromAccount: { address: string; AESEncryptPrivateKey: string };

  toAccount: { address: string };
  token: BaseToken;
  value: string;
  errorMsg: string;
  onChange: (amount: string) => void;
  onTxFeeChange?: (fee: string) => void;
  onCheckValue?: (params: { balance: string; fee: string; amount: string }) => void;
}) {
  const { t } = useTranslation();
  // const [errorMsg, setErrorMsg] = useState('Insufficient funds');
  const [amount, setAmount] = useState<string>(value);
  const { passwordSeed } = useUserInfo();
  const currentChain = useCurrentChain(token.chainId as ChainId);
  const currentNetwork = useCurrentNetworkInfo();
  const [fee, setTransactionFee] = useState<string>();
  const wallet = useCurrentWalletInfo();
  const isMain = useMemo(() => currentNetwork.networkType === 'MAIN', [currentNetwork]);

  const getTranslationInfo = useCallback(async () => {
    try {
      if (!toAccount?.address) throw 'No toAccount';
      const privateKey = await aes.decrypt(fromAccount.AESEncryptPrivateKey, passwordSeed);
      if (!privateKey) throw t(WalletError.invalidPrivateKey);
      if (!currentChain) throw 'No ChainInfo';
      const _amount = amount?.replace(` ${token?.symbol}`, '') || 0;

      const feeRes = await getTransferFee({
        managerAddress: wallet.address,
        toAddress: toAccount?.address,
        privateKey,
        chainInfo: currentChain,
        chainType: currentNetwork.walletType,
        token,
        caHash: wallet.caHash as string,
        amount: timesDecimals(_amount, token.decimals).toNumber(),
      });
      console.log(feeRes, 'transactionRes===');

      setTransactionFee(feeRes);
      onTxFeeChange?.(feeRes);
    } catch (error) {
      const _error = contractErrorHandler(error);
      message.error(_error);
    }
  }, [
    amount,
    currentChain,
    currentNetwork.walletType,
    fromAccount.AESEncryptPrivateKey,
    onTxFeeChange,
    passwordSeed,
    t,
    toAccount?.address,
    token,
    wallet.address,
    wallet.caHash,
  ]);

  const handleAmountBlur = useCallback(() => {
    // setAmount((v) => {
    //   const reg = new RegExp(`.+\\.\\d{0,${token?.decimals || 8}}|.+`);
    //   const valueProcessed = v
    //     ?.replace(/\.+$/, '')
    //     .replace(/^0+\./, '0.')
    //     .replace(/^0+/, '')
    //     .replace(/^\.+/, '0.')
    //     .match(reg)
    //     ?.toString();
    //   const valueString = valueProcessed ? `${parseInputChange(valueProcessed, ZERO, token?.decimals) || 0}` : '';
    //   onChange(valueString);

    //   return valueString.length ? `${valueString}` : '';
    // });
    onChange(amount);

    setTimeout(() => {
      getTranslationInfo();
    }, 0);
  }, [amount, getTranslationInfo, onChange]);

  const [balance, setBalance] = useState<string>();

  const getTokenBalance = useCallback(async () => {
    if (!currentChain) return;
    const result = await getBalance({
      rpcUrl: currentChain.endPoint,
      address: token?.address,
      chainType: currentNetwork.walletType,
      paramsOption: {
        owner: fromAccount.address,
        symbol: token.symbol,
      },
    });
    const balance = result.result.balance;
    setBalance(balance);
    console.log(result, currentChain, 'balances==getTokenBalance=');
  }, [currentChain, currentNetwork.walletType, fromAccount.address, token]);

  useEffect(() => {
    getTokenBalance();
  }, [getTokenBalance]);

  useEffect(() => {
    onCheckValue?.({ balance: balance || '', amount, fee: fee || '' });
  }, [amount, balance, fee, onCheckValue]);

  return (
    <div className="amount-wrap">
      <div className="item asset nft">
        <div className="avatar">{token.imageUrl ? <img src={token.imageUrl} /> : <p>{token.symbol[0]}</p>}</div>
        <div className="info">
          <p className="index">
            <span>{token.symbol}</span>
            <span className="token-id">{token.decimals}</span>
          </p>
          <p className="quantity">
            Balance: <span>{`${unitConverter(divDecimals(balance, token.decimals))}`}</span>
          </p>
        </div>
      </div>
      <div className="item amount">
        <span className="label">{t('Amount_with_colon')}</span>
        <div className="control">
          <div className="amount-input">
            <Input
              type="text"
              maxLength={18}
              placeholder={`0`}
              value={amount}
              onKeyDown={handleKeyDownInt}
              onBlur={handleAmountBlur}
              onChange={(e) => {
                setAmount(e.target.value);
              }}
            />
          </div>
        </div>
      </div>
      {errorMsg && <span className="error-msg">{errorMsg}</span>}
    </div>
  );
}
