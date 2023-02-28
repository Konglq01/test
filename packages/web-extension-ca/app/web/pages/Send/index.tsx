import { DefaultChainId } from '@portkey/constants/constants-ca/network';
import { useCurrentChain } from '@portkey/hooks/hooks-ca/chainList';
import { useCurrentNetworkInfo } from '@portkey/hooks/hooks-ca/network';
import { useCurrentWallet, useCurrentWalletInfo } from '@portkey/hooks/hooks-ca/wallet';
import { AddressBookError } from '@portkey/store/addressBook/types';
import { addFailedActivity, removeFailedActivity } from '@portkey/store/store-ca/activity/slice';
import { AddressItem, ContactItemType, IClickAddressProps } from '@portkey/types/types-ca/contact';
import { BaseToken } from '@portkey/types/types-ca/token';
import { isDIDAddress } from '@portkey/utils';
import { getAelfAddress, getEntireDIDAelfAddress, getWallet, isAelfAddress, isCrossChain } from '@portkey/utils/aelf';
import aes from '@portkey/utils/aes';
import { timesDecimals } from '@portkey/utils/converter';
import { Button, message, Modal } from 'antd';
import CustomSvg from 'components/CustomSvg';
import TitleWrapper from 'components/TitleWrapper';
import { ReactElement, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useDebounce } from 'react-use';
import { useAppDispatch, useContact, useLoading, useUserInfo, useWalletInfo } from 'store/Provider/hooks';
import crossChainTransfer, {
  CrossChainTransferIntervalParams,
  intervalCrossChainTransfer,
} from 'utils/sandboxUtil/crossChainTransfer';
import sameChainTransfer from 'utils/sandboxUtil/sameChainTransfer';
import AddressSelector from './components/AddressSelector';
import AmountInput from './components/AmountInput';
import SendPreview from './components/SendPreview';
import ToAccount from './components/ToAccount';
import { getBalance } from 'utils/sandboxUtil/getBalance';
import { WalletError } from '@portkey/store/wallet/type';
import getTransferFee from './utils/getTransferFee';
import { contractErrorHandler } from '@portkey/did-ui-react/src/utils/errorHandler';
import { ZERO } from '@portkey/constants/misc';
import { TransactionError } from '@portkey/constants/constants-ca/assets';
import './index.less';
import { the2ThFailedActivityItemType } from '@portkey/types/types-ca/activity';

export type Account = { address: string; name?: string };

enum Stage {
  'Address',
  'Amount',
  'Preview',
}

type TypeStageObj = {
  [key in Stage]: { btnText: string; handler: () => void; backFun: () => void; element: ReactElement };
};

export default function Send() {
  const navigate = useNavigate();
  const { walletName } = useWalletInfo();
  // TODO need get data from state and wait for BE data structure
  const { type, symbol, tokenId } = useParams();
  const { state } = useLocation();
  const chainInfo = useCurrentChain(state.chainId);
  const wallet = useCurrentWalletInfo();
  const currentNetwork = useCurrentNetworkInfo();
  const { passwordSeed } = useUserInfo();
  console.log(wallet, 'wallet===');
  const { setLoading } = useLoading();
  const dispatch = useAppDispatch();
  const { contactIndexList } = useContact();
  const { t } = useTranslation();
  const [errorMsg, setErrorMsg] = useState('');
  const [tipMsg, setTipMsg] = useState('');
  const [toAccount, setToAccount] = useState<{ name?: string; address: string }>({ address: '' });
  const [stage, setStage] = useState<Stage>(Stage.Address);
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState('');

  const [txFee, setTxFee] = useState<string>();
  const currentChain = useCurrentChain(state.chainId);

  const tokenInfo = useMemo(
    () => ({
      chainId: state.chainId,
      decimals: state.decimals, // 8
      address: state.address, // "ArPnUb5FtxG2oXTaWX2DxNZowDEruJLs2TEkhRCzDdrRDfg8B",        state address  contract address
      symbol: state.symbol, // "ELF"   the name showed
      name: state.symbol,
      imageUrl: state.imageUrl,
      alias: state.alias,
      tokenId: state.tokenId,
    }),
    [state],
  );

  const validateToAddress = useCallback((value: { name?: string; address: string } | undefined) => {
    if (!value) return false;
    if (!isDIDAddress(value.address)) {
      setErrorMsg(AddressBookError.recipientAddressIsInvalid);
      return false;
    }
    setErrorMsg('');
    return true;
  }, []);

  const btnDisabled = useMemo(() => {
    if (toAccount.address === '') return true;
    return false;
  }, [toAccount.address]);

  const getToAddressChainId = useCallback(
    (toAddress: string) => {
      if (!toAddress.includes('_')) return chainInfo?.chainId;
      const arr = toAddress.split('_');
      const addressChainId = arr[arr.length - 1];
      // no suffix
      if (isAelfAddress(addressChainId)) {
        return chainInfo?.chainId;
      }
      return addressChainId;
    },
    [chainInfo?.chainId],
  );

  useDebounce(
    () => {
      const value = getAelfAddress(toAccount.address);
      const toAdsChainId = getToAddressChainId(toAccount.address);
      const searchResult: ContactItemType[] = [];
      contactIndexList.forEach(({ contacts }) => {
        searchResult.push(
          ...contacts.filter(
            (contact) =>
              contact.name.toLowerCase() === value.toLowerCase() ||
              contact.addresses.some((ads) => ads.address === value && ads.chainId === toAdsChainId),
          ),
        );
      });
      if (searchResult[0] && searchResult[0].name) {
        setToAccount((v) => ({ ...v, name: searchResult[0].name }));
      }
    },
    300,
    [contactIndexList, toAccount.address],
  );

  const retryCrossChain = useCallback(
    async ({ transactionId, params }: the2ThFailedActivityItemType) => {
      try {
        //
        if (!chainInfo) return;
        const privateKey = aes.decrypt(wallet.AESEncryptPrivateKey, passwordSeed);
        if (!privateKey) return;
        setLoading(true);
        await intervalCrossChainTransfer({ ...params, chainInfo, privateKey });
        dispatch(removeFailedActivity(transactionId));
      } catch (error) {
        console.log('retry addFailedActivity', error);
        showErrorModal({ transactionId, params });
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, setLoading],
  );
  const showErrorModal = useCallback(
    (error: the2ThFailedActivityItemType) => {
      Modal.error({
        width: 320,
        className: 'transaction-modal',
        okText: t('Resend'),
        icon: null,
        closable: false,
        centered: true,
        title: (
          <div className="flex-column-center transaction-msg">
            <CustomSvg type="warnRed" />
            {t('Transaction failed ！')}
          </div>
        ),
        onOk: () => {
          console.log('retry modal addFailedActivity', error);
          retryCrossChain(error);
        },
      });
    },
    [retryCrossChain, t],
  );

  const getTranslationInfo = useCallback(async () => {
    try {
      if (!toAccount?.address) throw 'No toAccount';
      const privateKey = await aes.decrypt(wallet.AESEncryptPrivateKey, passwordSeed);
      if (!privateKey) throw t(WalletError.invalidPrivateKey);
      if (!currentChain) throw 'No ChainInfo';
      const feeRes = await getTransferFee({
        managerAddress: wallet.address,
        toAddress: toAccount?.address,
        privateKey,
        chainInfo: currentChain,
        chainType: currentNetwork.walletType,
        token: tokenInfo,
        caHash: wallet.caHash as string,
        amount: timesDecimals(amount, tokenInfo.decimals).toNumber(),
      });
      return feeRes;
    } catch (error) {
      const _error = contractErrorHandler(error);
      console.log('getFee===error', _error);
    }
  }, [
    amount,
    currentChain,
    currentNetwork.walletType,
    passwordSeed,
    t,
    toAccount?.address,
    tokenInfo,
    wallet.AESEncryptPrivateKey,
    wallet.address,
    wallet.caHash,
  ]);

  const handleCheckPreview = useCallback(async () => {
    try {
      if (!ZERO.plus(amount).toNumber()) return 'Please input amount';
      if (type === 'token') {
        if (ZERO.plus(amount).times(`1e${tokenInfo.decimals}`).isGreaterThan(ZERO.plus(balance))) {
          return TransactionError.TOKEN_NOTE_ENOUGH;
        }
      } else if (type === 'nft') {
        if (ZERO.plus(amount).isGreaterThan(ZERO.plus(balance))) {
          return TransactionError.NFT_NOTE_ENOUGH;
        }
      } else {
        return 'input error';
      }
      const fee = await getTranslationInfo();
      console.log('---getTranslationInfo', fee);
      if (fee) {
        setTxFee(fee);
      } else {
        return TransactionError.FEE_NOTE_ENOUGH;
      }
      return '';
    } catch (error: any) {
      console.log('checkTransactionValue===', error);
      return TransactionError.FEE_NOTE_ENOUGH;
    }
  }, [type, amount, tokenInfo.decimals, balance, getTranslationInfo]);

  const sendHandler = useCallback(async () => {
    try {
      if (!chainInfo || !passwordSeed) return;
      const privateKey = aes.decrypt(wallet.AESEncryptPrivateKey, passwordSeed);
      console.log(getWallet(privateKey || ''), 'getWallet-privateKey======sendHandler');
      if (!privateKey) return;
      if (!tokenInfo) throw 'No Symbol info';
      setLoading(true);

      if (isCrossChain(toAccount.address, chainInfo?.chainId ?? 'AELF')) {
        await crossChainTransfer({
          chainInfo,
          chainType: currentNetwork.walletType,
          privateKey,
          managerAddress: wallet.address,
          tokenInfo,
          caHash: wallet?.caHash || '',
          amount: timesDecimals(amount, tokenInfo.decimals).toNumber(),
          toAddress: toAccount.address,
          fee: timesDecimals(txFee, 8).toNumber(),
        });
      } else {
        console.log('sameChainTransfers==sendHandler');
        await sameChainTransfer({
          chainInfo,
          chainType: currentNetwork.walletType,
          privateKey,
          tokenInfo,
          caHash: wallet.AELF?.caHash || '',
          amount: timesDecimals(amount, tokenInfo.decimals).toNumber(),
          toAddress: toAccount.address,
        });
      }
      message.success('success');
      navigate('/');
    } catch (error: any) {
      console.log('sendHandler==error', error);
      if (!error?.type) return message.error(error);
      if (error.type === 'managerTransfer') {
        return message.error(error);
      } else if (error.type === 'crossChainTransfer') {
        dispatch(addFailedActivity(error.data));
        console.log('addFailedActivity', error);

        showErrorModal(error.data);
        return;
      } else {
        message.error(error);
      }
    } finally {
      setLoading(false);
    }
  }, [
    amount,
    chainInfo,
    currentNetwork.walletType,
    dispatch,
    navigate,
    passwordSeed,
    setLoading,
    showErrorModal,
    toAccount.address,
    tokenInfo,
    txFee,
    wallet.AELF?.caHash,
    wallet.AESEncryptPrivateKey,
    wallet.address,
    wallet?.caHash,
  ]);

  const StageObj: TypeStageObj = useMemo(
    () => ({
      0: {
        btnText: 'Next',
        handler: () => {
          const res = validateToAddress(toAccount);

          if (!res) return;
          if (!toAccount) return;
          if (isCrossChain(toAccount.address, chainInfo?.chainId ?? 'AELF')) {
            return Modal.confirm({
              width: 320,
              content: t('This is a cross-chain transaction.'),
              className: 'cross-modal delete-modal',
              icon: null,
              centered: true,
              okText: t('Continue'),
              cancelText: t('Cancel'),
              onOk: () => setStage(Stage.Amount),
            });
          }

          setStage(Stage.Amount);
        },
        backFun: () => {
          navigate(-1);
        },
        element: (
          <AddressSelector
            onClick={(account: IClickAddressProps) => {
              // from RecentList: Not recent contacts, not clickable
              if (account.isDisable) return;
              const value = { name: account.name, address: `ELF_${account.address}_${account.chainId}` };
              setToAccount(value);
              // validateToAddress(value);
            }}
            chainId={tokenInfo.chainId}
          />
        ),
      },
      1: {
        btnText: 'Preview',
        handler: async () => {
          if (!validateToAddress(toAccount)) return;
          const res = await handleCheckPreview();
          console.log('handleCheckPreview res', res);
          if (!res) {
            setTipMsg('');
            setStage(Stage.Preview);
          } else {
            setTipMsg(res);
          }
        },
        backFun: () => {
          setStage(Stage.Address);
          setAmount('');
          setTipMsg('');
        },
        element: (
          <AmountInput
            type={type as any}
            fromAccount={{
              address: wallet[state.chainId].caAddress,
              AESEncryptPrivateKey: wallet.AESEncryptPrivateKey,
            }}
            toAccount={{
              address: toAccount.address,
            }}
            value={amount}
            errorMsg={tipMsg}
            token={tokenInfo as BaseToken}
            onChange={({ amount, balance }) => {
              setAmount(amount);
              setBalance(balance);
            }}
          />
        ),
      },
      2: {
        btnText: 'Send',
        handler: () => {
          sendHandler();
        },
        backFun: () => {
          setStage(Stage.Amount);
        },
        element: (
          <SendPreview
            type={type as 'token' | 'nft'}
            toAccount={{
              ...toAccount,
              address: getEntireDIDAelfAddress(toAccount.address, undefined, chainInfo?.chainId ?? 'AELF'),
            }}
            amount={amount}
            symbol={tokenInfo?.symbol || ''}
            alias={tokenInfo.alias || ''}
            imageUrl={tokenInfo.imageUrl}
            chainId={state.chainId}
            transactionFee={txFee || ''}
            isCross={isCrossChain(toAccount.address, chainInfo?.chainId ?? 'AELF')}
            tokenId={tokenInfo.tokenId || ''}
          />
        ),
      },
    }),
    [
      type,
      wallet,
      state.chainId,
      toAccount,
      amount,
      tipMsg,
      tokenInfo,
      txFee,
      chainInfo?.chainId,
      validateToAddress,
      t,
      navigate,
      handleCheckPreview,
      sendHandler,
    ],
  );

  return (
    <div className="page-send">
      <TitleWrapper
        className="page-title"
        title={`Send ${type === 'token' ? symbol : ''}`}
        leftCallBack={() => {
          StageObj[stage].backFun();
        }}
        rightElement={<CustomSvg type="Close2" onClick={() => navigate('/')} />}
      />
      {stage !== Stage.Preview && (
        <div className="address-wrap">
          <div className="item from">
            <span className="label">{t('From_with_colon')}</span>
            <div className={'from-wallet control'}>
              <div className="name">{walletName}</div>
            </div>
          </div>
          <div className="item to">
            <span className="label">{t('To_with_colon')}</span>
            <div className="control">
              <ToAccount
                value={toAccount}
                onChange={(v) => setToAccount(v)}
                // onBlur={() => validateToAddress(toAccount)}
              />
              {stage === Stage.Amount && (
                <CustomSvg
                  type="Close2"
                  onClick={() => {
                    setStage(Stage.Address);
                    setToAccount({ address: '' });
                  }}
                />
              )}
            </div>
          </div>
          {errorMsg && <span className="error-msg">{errorMsg}</span>}
        </div>
      )}
      <div className="stage-ele">{StageObj[stage].element}</div>
      <div className="btn-wrap">
        <Button disabled={btnDisabled} className="stage-btn" type="primary" onClick={StageObj[stage].handler}>
          {StageObj[stage].btnText}
        </Button>
      </div>
    </div>
  );
}
