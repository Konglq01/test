import { ZERO } from '@portkey/constants/misc';
import { BaseToken } from '@portkey/types/types-ca/token';
import { unitConverter } from '@portkey/utils/converter';
import { Input } from 'antd';
import { parseInputChange } from '@portkey/utils/input';
import clsx from 'clsx';
import CustomSvg from 'components/CustomSvg';
import { handleKeyDown } from 'pages/Send/utils/util.keyDown';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useWalletInfo } from 'store/Provider/hooks';

export default function TokenInput({
  toAccount,
  token,
  value,
  onChange,
}: {
  toAccount: { address: string };
  token: BaseToken;
  value: string;
  onChange: (amount: string) => void;
}) {
  const { currentNetwork } = useWalletInfo();
  const isMain = useMemo(() => currentNetwork === 'MAIN', [currentNetwork]);
  const { t } = useTranslation();
  const [errorMsg, setErrorMsg] = useState('Insufficient funds');
  const [amount, setAmount] = useState<string>(value ? `${value} ${token.symbol}` : '');

  const getTranslationInfo = useCallback(async () => {
    if (!toAccount?.address) return;
    // const privateData = await getPrivateData(fromAccount?.AESEncryptPrivateKey);
    // if (!privateData?.privateKey) return message.error(t(WalletError.invalidPrivateKey));
    // const transactionRes = await getTransactionFee({
    //   contractAddress: token?.address || '',
    //   privateKey: privateData.privateKey,
    //   paramsOption: {
    //     symbol: token?.symbol,
    //     memo: '',
    //     to: toAccount?.address,
    //     amount: amount?.replace(` ${token?.symbol}`, ''),
    //   },
    //   chainType: currentChain.chainType,
    //   methodName: 'Transfer',
    //   rpcUrl: currentChain.rpcUrl,
    // });
    // if (!transactionRes?.message || transactionRes?.code === SandboxErrorCode.error)
    //   throw Error(transactionRes?.message?.Error?.Message ?? transactionRes?.message ?? 'something error');
    // const fee = transactionRes.message[currentChain.nativeCurrency?.symbol ?? 'ELF'];
    // fee && setTransactionFee(divDecimalsStr(ZERO.plus(fee), currentChain.nativeCurrency?.decimals));
  }, [toAccount]);

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
  }, [getTranslationInfo, onChange, token?.decimals, token?.symbol]);

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
              <p className="amount">{`${t('Balance_with_colon')} ${unitConverter(ZERO)} ${token?.symbol}`}</p>
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
          </div>
        </div>
      </div>
      {errorMsg && <span className="error-msg">{errorMsg}</span>}
    </div>
  );
}
