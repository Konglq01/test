import { useCurrentAccountTokenList } from '@portkey-wallet/hooks/hooks-eoa/useToken';
import { AddressBookError } from '@portkey-wallet/store/addressBook/types';
import { updateBalance } from '@portkey-wallet/store/tokenBalance/slice';
import { addRecentContact } from '@portkey-wallet/store/trade/slice';
import { AddressBookItem } from '@portkey-wallet/types/addressBook';
import { BaseToken, TokenItemType } from '@portkey-wallet/types/types-eoa/token';
import { AccountType } from '@portkey-wallet/types/wallet';
import { addressFormat, isAddress, sleep } from '@portkey-wallet/utils';
import { Button, Input, List, message } from 'antd';
import { divDecimalsStr, timesDecimals, unitConverter } from '@portkey-wallet/utils/converter';
import clsx from 'clsx';
import CustomSvg from 'components/CustomSvg';
import TitleWrapper from 'components/TitleWrapper';
import SandboxEventTypes from 'messages/SandboxEventTypes';
import CustomSelectDrawer from 'pages/components/CustomSelectDrawer';
import CustomTokenDrawer from 'pages/components/CustomTokenDrawer';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import SandboxEventService, { SandboxErrorCode } from 'service/SandboxEventService';
import {
  useAddressBook,
  useAppDispatch,
  useAppSelector,
  useCommonState,
  useLoading,
  useTokenBalance,
  useTradeInfo,
  useWalletInfo,
} from 'store/Provider/hooks';
import { getBalance } from 'utils/sandboxUtil/getBalance';
import getPrivateKeyAndMnemonic from 'utils/Wallet/getPrivateKeyAndMnemonic';
import ContactList from './components/ContactList';
import ToAccount from './components/ToAccount';
import './index.less';
import { handleKeyDown } from './utils/util.handleKeyDown';
import checkMain from 'utils/util.isMain';
import { useGetELFRateQuery } from '@portkey-wallet/store/rate/api';
import { ZERO } from '@portkey-wallet/constants/misc';
import getTransactionFee from 'utils/sandboxUtil/getTransactionFee';
import InternalMessage from 'messages/InternalMessage';
import InternalMessageTypes from 'messages/InternalMessageTypes';
import { WalletError } from '@portkey-wallet/store/wallet/type';
import { parseInputChange } from '@portkey-wallet/utils/input';
import PromptCommonPage from 'pages/components/PromptCommonPage';
import CustomSelectModal from 'pages/components/CustomSelectModal';
import CustomTokenModal from 'pages/components/CustomTokenModal';
import { useLocalStorage } from 'react-use';
import { useTranslation } from 'react-i18next';
import { getTxResult } from 'utils/aelfUtils';
import { getAelfInstance } from '@portkey-wallet/utils/aelf';
interface AmountToken extends BaseToken {
  balance?: string;
}
export interface SendAmountValue {
  amount?: string;
  token?: AmountToken;
}

export default function Send() {
  const { data: rate } = useGetELFRateQuery({}, { pollingInterval: 1000 * 60 * 60 });
  const { isPrompt } = useCommonState();
  const { symbol, address } = useParams();
  const tokenList = useCurrentAccountTokenList();
  const { currentAddressBook, currentChain } = useAddressBook();
  const { netWorkType, chainType, chainId, rpcUrl } = currentChain;
  const { passwordSeed } = useAppSelector((state) => state.userInfo);
  const { accountList, currentAccount } = useWalletInfo();
  const [fromAccount, setFromAccount] = useState<AccountType | undefined>(currentAccount);
  const [selectToken, setSelectToken] = useState<TokenItemType | undefined>(
    tokenList.find((token) => token.symbol === symbol) || tokenList[0],
  );
  const [toAddress, setToAddress] = useState<AddressBookItem>();
  const [errorMsg, setErrorMsg] = useState<string>();
  const [transactionFee, setTransactionFee] = useState<string>();
  const { balances } = useTokenBalance();
  const [toAccount, , remove] = useLocalStorage<AddressBookItem | undefined>('ToAccount');

  const navigate = useNavigate();
  const isMain = checkMain(netWorkType, chainId);

  const [amount, setAmount] = useState<string>();

  const [, setLoading] = useLoading();

  useCurrentAccountTokenList();
  const { t } = useTranslation();
  const [open, setOpen] = useState<boolean>();
  const [fromOpen, setFromOpen] = useState<boolean>();
  const [tokenOpen, setTokenOpen] = useState<boolean>();
  const { currentRecentContact } = useTradeInfo();
  const dispatch = useAppDispatch();

  const FromSelectEle = useMemo(() => {
    const getBalance = (address: string) => balances?.[rpcUrl]?.[address]?.ELF;
    if (isPrompt) {
      return (
        <CustomSelectModal
          open={fromOpen}
          dataSource={accountList}
          render={(item) => (
            <List.Item key={item.address}>
              <div
                className="account-unit"
                key={item.address}
                onClick={() => {
                  setFromAccount(item);
                }}>
                <div className="current-status">
                  {item.address === fromAccount?.address && (
                    <CustomSvg type="TickGreen" style={{ width: 16, height: 16 }} />
                  )}
                </div>
                <div className="account-info">
                  <div className={clsx('name', item.accountType === 'Import' && 'imported')}>{item.accountName}</div>
                  <div className="amount">{`${unitConverter(
                    ZERO.plus(getBalance(item.address) ?? 0).div(Math.pow(10, 8)),
                  )} ELF`}</div>
                </div>
                <div className="imported">{item.accountType === 'Import' && <span>{t('IMPORTED')}</span>}</div>
              </div>
            </List.Item>
          )}
          onClose={() => setFromOpen(false)}
        />
      );
    }
    return (
      <CustomSelectDrawer
        open={fromOpen}
        height="224"
        maskClosable={true}
        placement="bottom"
        onClose={() => setFromOpen(false)}
        selectList={accountList}
        defaultValue={fromAccount?.address}
        onChange={(v: AccountType) => {
          setFromAccount(v);
          setFromOpen(false);
        }}
      />
    );
  }, [isPrompt, fromOpen, accountList, fromAccount?.address, balances, rpcUrl, t]);

  const TokenSelectEle = useMemo(() => {
    if (isPrompt) {
      return (
        <CustomTokenModal
          open={tokenOpen}
          onClose={() => setTokenOpen(false)}
          selectList={tokenList}
          onChange={(v) => {
            setSelectToken(v);
            setTokenOpen(false);
          }}
        />
      );
    }
    return (
      <CustomTokenDrawer
        open={tokenOpen}
        height="528"
        maskClosable={true}
        placement="bottom"
        onClose={() => setTokenOpen(false)}
        selectList={tokenList}
        onChange={(v) => {
          setSelectToken(v);
          setTokenOpen(false);
        }}
      />
    );
  }, [isPrompt, tokenList, tokenOpen]);

  const onClose = useCallback(() => {
    setOpen(false);
  }, []);
  const getPrivateData = useCallback(async (AESEncryptPrivateKey?: string) => {
    if (!AESEncryptPrivateKey) throw 'Something error: getPrivateData';
    const { data } = await InternalMessage.payload(InternalMessageTypes.GET_SEED).send();
    const { privateKey: password } = data ?? {};
    return await getPrivateKeyAndMnemonic({ AESEncryptPrivateKey }, password);
  }, []);

  const getTranslationInfo = useCallback(async () => {
    if (!toAddress?.address) return;
    const privateData = await getPrivateData(fromAccount?.AESEncryptPrivateKey);
    if (!privateData?.privateKey) return message.error(t(WalletError.invalidPrivateKey));
    const transactionRes = await getTransactionFee({
      contractAddress: selectToken?.address || '',
      privateKey: privateData.privateKey,
      paramsOption: {
        symbol: selectToken?.symbol,
        memo: '',
        to: toAddress?.address,
        amount: amount?.replace(` ${selectToken?.symbol}`, ''),
      },
      chainType: currentChain.chainType,
      methodName: 'Transfer',
      rpcUrl: currentChain.rpcUrl,
    });
    if (!transactionRes?.message || transactionRes?.code === SandboxErrorCode.error)
      throw Error(transactionRes?.message?.Error?.Message ?? transactionRes?.message ?? 'something error');
    const fee = transactionRes.message[currentChain.nativeCurrency?.symbol ?? 'ELF'];
    fee && setTransactionFee(divDecimalsStr(ZERO.plus(fee), currentChain.nativeCurrency?.decimals));
  }, [toAddress, getPrivateData, fromAccount, t, selectToken, amount, currentChain]);

  const myAccounts = useMemo(
    () =>
      accountList?.map((account) => ({
        name: account.accountName,
        address: account.address,
      })),
    [accountList],
  );
  const balanceData = useMemo(() => {
    return balances?.[rpcUrl]?.[fromAccount?.address ?? ''];
  }, [balances, rpcUrl, fromAccount]);
  const quantity = useMemo(() => {
    const qua = ZERO.plus(amount?.replace(` ${selectToken?.symbol}`, '') || 0);
    return isNaN(qua.toNumber()) ? ZERO : qua;
  }, [amount, selectToken?.symbol]);
  const balance = useMemo(
    () => ZERO.plus(balanceData?.[selectToken?.symbol || ''] || 0).div(Math.pow(10, selectToken?.decimals || 8)),
    [balanceData, selectToken?.decimals, selectToken?.symbol],
  );

  const validateToAddress = useCallback(
    (value: AddressBookItem | undefined) => {
      if (!value) return;
      const { address } = value;
      if (!isAddress(value.address)) return setErrorMsg(AddressBookError.recipientAddressIsInvalid);
      setErrorMsg('');
      const item = (currentAddressBook || [])
        .concat(myAccounts || [])
        .find((item) => item.address === address && (value.name ? item.name === value.name : true));
      item && setToAddress(item);
      return Promise.resolve();
    },
    [currentAddressBook, myAccounts],
  );

  const handleAmountBlur = useCallback(() => {
    setAmount((v) => {
      const reg = new RegExp(`.+\\.\\d{0,${selectToken?.decimals || 8}}|.+`);
      const valueProcessed = v
        ?.replace(/\.+$/, '')
        .replace(/^0+\./, '0.')
        .replace(/^0+/, '')
        .replace(/^\.+/, '0.')
        .match(reg)
        ?.toString();

      return valueProcessed
        ? `${parseInputChange(valueProcessed, ZERO, selectToken?.decimals) || 0} ${selectToken?.symbol}`
        : '';
    });
    setTimeout(() => {
      getTranslationInfo();
    }, 0);
  }, [getTranslationInfo, selectToken?.decimals, selectToken?.symbol]);

  useEffect(() => {
    if (toAccount) {
      setToAddress({
        ...toAccount,
        address: addressFormat(toAccount.address, chainId, chainType),
      });
    }
    setTimeout(() => {
      remove();
    }, 0);
  }, [chainId, chainType, remove, toAccount]);

  useEffect(() => {
    getTranslationInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toAddress]);

  useEffect(() => {
    setAmount('');
  }, [selectToken]);

  useEffect(() => {
    if (!toAddress?.address) return;
    let msg = '';
    if (quantity.isGreaterThan(balance)) {
      msg = 'Insufficient funds';
    } else if (quantity.plus(transactionFee || 0).isGreaterThan(balance)) {
      // setErrorMsg('Insufficient funds for transaction fee');
      msg = 'Insufficient funds';
    }
    setTimeout(() => {
      setErrorMsg(msg);
    }, 0);
  }, [amount, balance, balanceData, currentChain, quantity, fromAccount, selectToken, toAddress, transactionFee]);

  const transferOnAelf = useCallback(
    async (values: {
      From: string;
      fromAccount: AccountType;
      To: AddressBookItem;
      memo?: string;
      symbolAmount: SendAmountValue;
    }): Promise<undefined | boolean> => {
      const { To, memo = '', symbolAmount, fromAccount } = values;
      if (!fromAccount) {
        message.error('From error');
        return;
      }
      if (!passwordSeed) {
        message.error('The password is invalid, please unlock it again');
        return;
      }
      const resPrivate = await getPrivateKeyAndMnemonic(
        { AESEncryptPrivateKey: fromAccount?.AESEncryptPrivateKey },
        passwordSeed,
      );
      if (!resPrivate?.privateKey) return message.error('User verification failed');

      const result = await SandboxEventService.dispatchAndReceive(SandboxEventTypes.callSendMethod, {
        rpcUrl: currentChain.rpcUrl,
        address: symbolAmount.token?.address,
        methodName: 'Transfer',
        privateKey: resPrivate.privateKey,
        chainType: currentChain.chainType,
        paramsOption: [
          {
            symbol: symbolAmount.token?.symbol,
            memo: memo ?? '',
            to: To.address,
            amount: timesDecimals(symbolAmount.amount, symbolAmount.token?.decimals ?? 8).toFixed(),
          },
        ],
      });
      console.log(result, 'result===callSendMethod');
      if (result.code === SandboxErrorCode.error) {
        message.error(
          (result.message?.Error?.Message || result.message?.Message || result?.message) ?? 'something error',
        );
        return;
      }
      const { TransactionId } = result.message || result;
      await sleep(1000);
      const aelfInstance = getAelfInstance(currentChain.rpcUrl);
      try {
        const validTxId = await getTxResult(aelfInstance, TransactionId);
        message.success('Success');
      } catch (error: any) {
        message.error(error.Error);
      }

      // TODO refresh balance;

      // TODO add to transactionList
      // dispatch(up)
      return true;
    },
    [currentChain.chainType, currentChain.rpcUrl, passwordSeed],
  );

  const onFinish = useCallback(async () => {
    try {
      setLoading(true);
      if (!fromAccount || !toAddress || !selectToken || !fromAccount) return;
      if (currentChain.chainType === 'aelf') {
        //
        const res = await transferOnAelf({
          fromAccount: fromAccount,
          From: fromAccount.address,
          To: toAddress,
          symbolAmount: {
            amount: ZERO.plus(amount?.replace(` ${selectToken.symbol}`, '') || 0).toString(),
            token: selectToken,
          },
        });
        // if (res) form.resetFields();
      } else {
        // TODO eth
        throw Error('Not Support');
      }

      const balanceRes = await getBalance({
        account: fromAccount.address,
        tokenList: [selectToken],
        currentChain,
      });
      if (balanceRes.code !== SandboxErrorCode.error) {
        balanceRes.result && dispatch(updateBalance(balanceRes.result));
      }
      dispatch(
        addRecentContact({
          rpcUrl: currentChain.rpcUrl,
          contact: {
            name: toAddress.name,
            address: toAddress.address,
          },
        }),
      );
      // await form.validateFields();
    } catch (e: any) {
      message.error((e.errorMessage || {}).message || e.message || e || 'Please input the required form field');
    }
    setLoading(false);
  }, [amount, currentChain, dispatch, selectToken, fromAccount, setLoading, toAddress, transferOnAelf]);

  return (
    <PromptCommonPage>
      <div className="page-send">
        <TitleWrapper
          className="page-title"
          title={t('Send')}
          leftCallBack={() => navigate(-1)}
          rightElement={<CustomSvg type="Close2" onClick={() => navigate(-1)} />}
        />
        <div className="flex-column send-form">
          <div className="address-wrap">
            <div className="item from">
              <span className="label">{t('From_with_colon')}</span>
              <div
                className={clsx([
                  'from-selector control',
                  'single-account',
                  (accountList?.length || 0) > 1 && 'more-account',
                ])}
                onClick={() => setFromOpen(true)}>
                <div className="name">{fromAccount?.accountName}</div>
                {(accountList?.length || 0) > 1 && <CustomSvg type="Down" style={{ width: 13, height: 13 }} />}
              </div>
              {FromSelectEle}
            </div>
            <div className="item to">
              <span className="label">{t('To_with_colon')}</span>
              <div className="control">
                <ToAccount
                  value={toAddress}
                  onChange={(v) => setToAddress(v)}
                  onBlur={() => validateToAddress(toAddress)}
                  onOpenContactList={() => {
                    isPrompt ? navigate(`/send/contracts`) : setOpen(true);
                  }}
                />
              </div>
            </div>
          </div>
          <div className="amount-wrap">
            {!!errorMsg && <div className="error-tip">{t(errorMsg)}</div>}
            <div className="item asset">
              <span className="label">{t('Asset_with_colon')}</span>
              <div className="control">
                <div className="asset-selector" onClick={() => setTokenOpen(tokenList.length > 1)}>
                  <div className="icon">
                    {selectToken?.symbol === 'ELF' ? (
                      <CustomSvg type="Aelf" />
                    ) : (
                      <div className="custom">{selectToken?.symbol[0]}</div>
                    )}
                  </div>
                  <div className="center">
                    <p className="symbol">{selectToken?.symbol}</p>
                    <p className="amount">
                      {`${t('Balance_with_colon')} ${unitConverter(
                        ZERO.plus(balanceData?.[selectToken?.symbol || ''] || 0).div(
                          Math.pow(10, selectToken?.decimals || 8),
                        ),
                      )} ${selectToken?.symbol}`}
                    </p>
                  </div>
                  {tokenList.length > 1 && (
                    <CustomSvg className="down-icon" type="Down" style={{ width: 13, height: 13 }} />
                  )}
                </div>
                {TokenSelectEle}
              </div>
            </div>
            <div className="item amount">
              <span className="label">{t('Amount_with_colon')}</span>
              <div className="control">
                <div className="amount-input">
                  <Input
                    type="text"
                    placeholder={`0 ${selectToken?.symbol}`}
                    className={clsx(isMain && 'need-convert')}
                    value={amount}
                    onKeyDown={handleKeyDown}
                    onFocus={() => {
                      setAmount((v) => v?.replace(` ${selectToken?.symbol}`, ''));
                    }}
                    onBlur={handleAmountBlur}
                    onChange={(e) => {
                      setAmount(e.target.value);
                    }}
                  />
                  {isMain && (
                    <span className="convert">{`$${unitConverter(
                      ZERO.plus(amount?.replace(` ${selectToken?.symbol}`, '') || 0)?.multipliedBy(rate?.USDT || 0),
                    )}`}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="fee-wrap">
            <div className="item fee">
              <span className="label">{t('Transaction Fee_with_colon')}</span>
              <p className="value">
                <span className="symbol">
                  {transactionFee || 0} {selectToken?.symbol}
                </span>
                {!isMain && (
                  <span className="usd">
                    $
                    {ZERO.plus(transactionFee || 0)
                      .multipliedBy(rate?.USDT || 0)
                      .toFixed(2)}
                  </span>
                )}
              </p>
            </div>
            {quantity.isEqualTo(0) || (
              <div className="item total">
                <span className="label">{t('Total_with_colon')}</span>
                <p className="value">
                  <span className="symbol">
                    {parseInputChange(quantity.plus(transactionFee || 0).toString(), ZERO, selectToken?.decimals)}{' '}
                    {selectToken?.symbol}
                  </span>
                  {!isMain && (
                    <span className="usd">
                      $
                      {quantity
                        .plus(transactionFee || 0)
                        .multipliedBy(rate?.USDT || 0)
                        .toFixed(2)}
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>

          <div className="btn-wrap">
            <Button
              disabled={!toAddress?.address || !amount || !selectToken?.symbol || !!errorMsg}
              className="send-btn"
              type="primary"
              onClick={onFinish}>
              {t('Send')}
            </Button>
          </div>
        </div>
        <ContactList
          open={open}
          onClose={onClose}
          currentAddressBook={currentAddressBook}
          myAccounts={myAccounts}
          recentContact={currentRecentContact}
          currentChain={currentChain}
          onSelect={(v) => {
            setToAddress(v);
            setTimeout(() => {
              validateToAddress(v);
            }, 0);
            onClose();
          }}
        />
      </div>
    </PromptCommonPage>
  );
}
