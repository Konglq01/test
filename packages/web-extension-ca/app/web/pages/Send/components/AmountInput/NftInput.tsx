import { ZERO } from '@portkey/constants/misc';
import { BaseToken } from '@portkey/types/types-ca/token';
import { Input } from 'antd';
import { parseInputChange } from '@portkey/utils/input';
import { handleKeyDownInt } from 'pages/Send/utils/util.keyDown';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function NftInput({
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
  const isMain = true;
  const { t } = useTranslation();
  const [errorMsg, setErrorMsg] = useState('Insufficient funds');
  const [amount, setAmount] = useState<string>(value);

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

      return valueString.length ? `${valueString}` : '';
    });
    setTimeout(() => {
      getTranslationInfo();
    }, 0);
  }, [getTranslationInfo, onChange, token?.decimals]);

  return (
    <div className="amount-wrap">
      <div className="item asset nft">
        <div className="avatar">
          <p>K</p>
        </div>
        <div className="info">
          <p className="index">
            <span>Knight of Swords</span>
            <span className="token-id">#0004</span>
          </p>
          <p className="quantity">
            Balance: <span>{3}</span>
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
