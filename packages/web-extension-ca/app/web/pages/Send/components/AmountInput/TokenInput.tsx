import { ZERO } from '@portkey/constants/misc';
import { BaseToken } from '@portkey/types/types-ca/token';
import { divDecimals, divDecimalsStr, unitConverter } from '@portkey/utils/converter';
import { Input, message } from 'antd';
import { parseInputChange } from '@portkey/utils/input';
import clsx from 'clsx';
import CustomSvg from 'components/CustomSvg';
import { handleKeyDown } from 'pages/Send/utils/util.keyDown';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getBalance } from 'utils/sandboxUtil/getBalance';
import { useCurrentChain } from '@portkey/hooks/hooks-ca/chainList';
import { ChainId } from '@portkey/types';
import { useCurrentNetworkInfo } from '@portkey/hooks/hooks-ca/network';
import aes from '@portkey/utils/aes';
import { useUserInfo } from 'store/Provider/hooks';
import { WalletError } from '@portkey/store/store-ca/wallet/type';
import { SandboxErrorCode } from '@portkey/utils/sandboxService';
import getTransactionFee from 'utils/sandboxUtil/getTransactionFee';

export default function TokenInput({
  fromAccount,
  toAccount,
  token,
  value,
  onChange,
  onTxFeeChange,
}: {
  fromAccount: { address: string; AESEncryptPrivateKey: string };
  toAccount: { address: string };
  token: BaseToken;
  value: string;
  onChange: (amount: string) => void;
  onTxFeeChange?: (fee: string) => void;
}) {
  const currentNetwork = useCurrentNetworkInfo();
  const currentChain = useCurrentChain(token.chainId as ChainId);
  const isMain = useMemo(() => currentNetwork.networkType === 'MAIN', [currentNetwork]);
  const { t } = useTranslation();
  const [errorMsg, setErrorMsg] = useState('Insufficient funds');
  const [amount, setAmount] = useState<string>(value ? `${value} ${token.symbol}` : '');
  const [balance, setBalance] = useState<string>();
  const { passwordSeed } = useUserInfo();
  const [fee, setTransactionFee] = useState<string>();

  const getTranslationInfo = useCallback(async () => {
    if (!toAccount?.address) return;
    const privateKey = await aes.decrypt(fromAccount.AESEncryptPrivateKey, passwordSeed);
    if (!privateKey) return message.error(t(WalletError.invalidPrivateKey));
    const transactionRes = await getTransactionFee({
      contractAddress: token?.address || '',
      privateKey: privateKey,
      paramsOption: {
        symbol: token?.symbol,
        memo: '',
        to: toAccount?.address,
        amount: amount?.replace(` ${token?.symbol}`, ''),
      },
      chainType: currentNetwork.walletType,
      methodName: 'Transfer',
      rpcUrl: currentChain?.endPoint || '',
    });
    if (!transactionRes?.message || transactionRes?.code === SandboxErrorCode.error)
      throw Error(transactionRes?.message?.Error?.Message ?? transactionRes?.message ?? 'something error');
    const _fee = transactionRes.message['ELF'];
    if (_fee) {
      const fee = divDecimalsStr(ZERO.plus(_fee), 8);
      setTransactionFee(fee);
      onTxFeeChange?.(fee);
    }
  }, [
    amount,
    currentChain?.endPoint,
    currentNetwork.walletType,
    fromAccount.AESEncryptPrivateKey,
    onTxFeeChange,
    passwordSeed,
    t,
    toAccount?.address,
    token,
  ]);

  console.log('getTokenBalance', currentChain);

  const getTokenBalance = useCallback(async () => {
    if (!currentChain) return;
    const result = await getBalance({
      rpcUrl: currentChain.endPoint,
      address: token.address,
      chainType: currentNetwork.walletType,
      paramsOption: {
        owner: fromAccount.address,
        symbol: token.symbol,
      },
    });
    const balance = result.result.balance;
    setBalance(balance);
    console.log(result, currentChain, 'balances==getTokenBalance=');
  }, [currentChain, currentNetwork.walletType, fromAccount.address, token.address, token.symbol]);

  useEffect(() => {
    getTokenBalance();
  }, [getTokenBalance]);

  const handleAmountBlur = useCallback(() => {
    setAmount((v) => {
      const reg = new RegExp(`.+\\.\\d{0,${token?.decimals || 8}}|.+`);
      const valueProcessed = v
        ?.replace(/\.+$/, '')
        .replace(/^0+\./, '0.')
        .replace(/^0+/, '')
        .replace(/^\.+/, '0.')
        .match(reg)
        ?.toString();
      const valueString = valueProcessed ? `${parseInputChange(valueProcessed, ZERO, token?.decimals) || 0}` : '';
      onChange(valueString);

      return valueString.length ? `${valueString} ${token.symbol}` : '';
    });
    setTimeout(() => {
      getTranslationInfo();
    }, 0);
  }, [getTranslationInfo, onChange, token?.decimals, token.symbol]);

  return (
    <div className="amount-wrap">
      <div className="item asset">
        <span className="label">{t('Asset_with_colon')}</span>
        <div className="control">
          <div className="asset-selector">
            <div className="icon">
              {token?.symbol === 'ELF' ? <CustomSvg type="Aelf" /> : <div className="custom">{token?.symbol[0]}</div>}
            </div>
            <div className="center">
              <p className="symbol">{token?.symbol}</p>
              <p className="amount">{`${t('Balance_with_colon')} ${unitConverter(
                divDecimals(balance, token.decimals),
              )} ${token?.symbol}`}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="item amount">
        <span className="label">{t('Amount_with_colon')}</span>
        <div className="control">
          <div className="amount-input">
            <Input
              type="text"
              placeholder={`0`}
              className={clsx(isMain && 'need-convert')}
              value={amount}
              maxLength={18}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                setAmount((v) => v?.replace(` ${token?.symbol}`, ''));
              }}
              onBlur={handleAmountBlur}
              onChange={(e) => {
                setAmount(e.target.value);
              }}
            />
            {isMain && (
              <span className="convert">{`$${unitConverter(
                // ZERO.plus(amount?.replace(` ${token?.symbol}`, '') || 0)?.multipliedBy(rate?.USDT || 0),
                ZERO.plus(amount?.replace(` ${token?.symbol}`, '') || 0),
              )}`}</span>
            )}
            {fee ? `${fee} ELF` : ''}
          </div>
        </div>
      </div>
      {errorMsg && <span className="error-msg">{errorMsg}</span>}
    </div>
  );
}
