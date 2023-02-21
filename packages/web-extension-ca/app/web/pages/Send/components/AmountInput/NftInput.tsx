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
import { isCrossChain } from '@portkey/utils/aelf';

export default function NftInput({
  toAccount,
  fromAccount,
  token,
  value,
  errorMsg,
  onChange,
}: {
  fromAccount: { address: string; AESEncryptPrivateKey: string };
  toAccount: { address: string };
  token: BaseToken;
  value: string;
  errorMsg: string;
  onChange: (params: { amount: string; balance: string }) => void;
}) {
  const { t } = useTranslation();
  // const [errorMsg, setErrorMsg] = useState('Insufficient funds');
  const [amount, setAmount] = useState<string>(value);
  const { passwordSeed } = useUserInfo();
  const currentChain = useCurrentChain(token.chainId as ChainId);
  const currentNetwork = useCurrentNetworkInfo();
  const wallet = useCurrentWalletInfo();
  const isMain = useMemo(() => currentNetwork.networkType === 'MAIN', [currentNetwork]);
  const [balance, setBalance] = useState<string>('');

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
    onChange({ amount, balance });
  }, [amount, balance, onChange]);

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

  return (
    <div className="amount-wrap">
      <div className="item asset nft">
        <div className="avatar">{token.imageUrl ? <img src={token.imageUrl} /> : <p>{token.symbol[0]}</p>}</div>
        <div className="info">
          <p className="index">
            <span>{token.alias}</span>
            <span className="token-id"># {token.tokenId}</span>
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
