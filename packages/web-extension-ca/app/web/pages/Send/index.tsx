import { DefaultChainId } from '@portkey/constants/constants-ca/network';
import { useCurrentChain } from '@portkey/hooks/hooks-ca/chainList';
import { useCurrentNetworkInfo } from '@portkey/hooks/hooks-ca/network';
import { useCurrentWallet, useCurrentWalletInfo } from '@portkey/hooks/hooks-ca/wallet';
import { AddressBookError } from '@portkey/store/addressBook/types';
import { addFailedActivity, removeFailedActivity } from '@portkey/store/store-ca/activity/slice';
import { AddressItem, ContactItemType, IClickAddressProps } from '@portkey/types/types-ca/contact';
import { BaseToken } from '@portkey/types/types-ca/token';
import { isDIDAddress } from '@portkey/utils';
import { getAelfAddress, getWallet, isCrossChain } from '@portkey/utils/aelf';
import aes from '@portkey/utils/aes';
import { timesDecimals } from '@portkey/utils/converter';
import { Button, message, Modal } from 'antd';
import CustomSvg from 'components/CustomSvg';
import TitleWrapper from 'components/TitleWrapper';
import { check } from 'prettier';
import { ReactElement, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useDebounce } from 'react-use';
import { useAppDispatch, useAssetInfo, useContact, useLoading, useUserInfo, useWalletInfo } from 'store/Provider/hooks';
import crossChainTransfer, {
  CrossChainTransferIntervalParams,
  intervalCrossChainTransfer,
} from 'utils/sandboxUtil/crossChainTransfer';
import sameChainTransfer from 'utils/sandboxUtil/sameChainTransfer';
import AddressSelector from './components/AddressSelector';
import AmountInput from './components/AmountInput';
import SendPreview from './components/SendPreview';
import ToAccount from './components/ToAccount';
import './index.less';

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
  const chainInfo = useCurrentChain(DefaultChainId);
  const wallet = useCurrentWalletInfo();
  const currentNetwork = useCurrentNetworkInfo();
  const { passwordSeed } = useUserInfo();
  console.log(wallet, 'wallet===');
  const { setLoading } = useLoading();
  const { accountToken, accountNFT } = useAssetInfo();
  const dispatch = useAppDispatch();

  const { contactIndexList } = useContact();
  const { t } = useTranslation();
  const [errorMsg, setErrorMsg] = useState('');
  const [tipMsg, setTipMsg] = useState('');
  const [toAccount, setToAccount] = useState<{ name?: string; address: string }>({ address: '' });
  const [stage, setStage] = useState<Stage>(Stage.Address);
  const [amount, setAmount] = useState('');
  const [checkValue, setCheckValue] = useState({ balance: '', fee: '', amount: '' });
  console.log('-------------accountNFT', accountNFT.accountNFTList);
  console.log('---------state', state);

  const [txFee, setTransactionFee] = useState<string>();
  console.log(type, 'type===');
  const tokenInfo = useMemo(() => {
    if (type === 'nft') {
      // return {
      //   symbol: 'BTX-2',
      //   decimals: 0,
      //   address: 'JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE',
      //   name: 'ELF',
      //   chainId: 'AELF',
      // };
      // const nft = accountNFT.accountNFTList.find((item) => item.symbol === symbol);

      // if (!nft) {
      //   message.error('No symbol info');
      //   return;
      // }
      return {
        chainId: state.chainId,
        decimals: state.decimals || 0, // 8
        address: (state as any).address, // "ArPnUb5FtxG2oXTaWX2DxNZowDEruJLs2TEkhRCzDdrRDfg8B",        token address  contract address
        symbol: state.symbol, // "ELF"   the name showed
        name: state.symbol,
      };
    }
    if (type === 'token') {
      // const token = accountToken.accountTokenList.find((item: any) => item.symbol === symbol);
      // if (!token) {
      //   message.error('No symbol info');
      //   return;
      // }
      // return {
      //   symbol: 'ELF',
      //   decimals: 8,
      //   address: 'JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE',
      //   name: 'ELF',
      //   chainId: 'AELF',
      // };
      return {
        chainId: state.chainId,
        decimals: state.decimals, // 8
        address: state.address, // "ArPnUb5FtxG2oXTaWX2DxNZowDEruJLs2TEkhRCzDdrRDfg8B",        state address  contract address
        symbol: state.symbol, // "ELF"   the name showed
        name: state.symbol,
      };
    }
  }, [state, type]);

  // useMemo(
  //   () => ({
  //     symbol: 'ELF',
  //     decimals: 8,
  //     address: 'JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE',
  //   }),
  //   // ({
  //   //   symbol: 'BTX-2',
  //   //   decimals: 0,
  //   //   tokenName: '1155-BTX2',
  //   //   address: 'JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE',
  //   //   supply: '1000',
  //   //   totalSupply: '1000',
  //   //   issuer: '2KQWh5v6Y24VcGgsx2KHpQvRyyU5DnCZ4eAUPqGQbnuZgExKaV',
  //   //   isBurnable: true,
  //   //   issueChainId: 9992731,
  //   //   issued: '1000',
  //   //   externalInfo: { value: { __nft_image_url: 'nft_image_url', __nft_is_burned: 'true' } },
  //   // }),

  //   [],
  // );

  const validateToAddress = useCallback((value: { name?: string; address: string } | undefined) => {
    if (!value) return false;
    // console.log('>>>value', !isDIDAddress(value.address));
    // const { address } = value;
    if (!isDIDAddress(value.address)) {
      setErrorMsg(AddressBookError.recipientAddressIsInvalid);
      return false;
    }
    setErrorMsg('');
    // const item = (currentAddressBook || [])
    //   .concat(myAccounts || [])
    //   .find((item) => item.address === address && (value.name ? item.name === value.name : true));
    // item && setToAddress(item);
    return true;
  }, []);

  const btnDisabled = useMemo(() => {
    if (toAccount.address === '') return true;
    return false;
  }, [toAccount.address]);

  useDebounce(
    () => {
      const value = getAelfAddress(toAccount.address);
      const searchResult: ContactItemType[] = [];
      contactIndexList.forEach(({ contacts }) => {
        searchResult.push(
          ...contacts.filter(
            (contact) =>
              contact.name.toLowerCase() === value.toLowerCase() ||
              contact.addresses.some((ads) => ads.address === value),
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
    async ({ managerTransferTxId, data }: { managerTransferTxId: string; data: CrossChainTransferIntervalParams }) => {
      try {
        //
        setLoading(true);
        await intervalCrossChainTransfer(data);
        dispatch(removeFailedActivity(managerTransferTxId));
      } catch (error) {
        showErrorModal(error);
        // tip retryCrossChain()
        // Modal.confirm
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch],
  );
  const showErrorModal = useCallback(
    (error: any) => {
      Modal.error({
        width: 320,
        className: 'transaction-modal',
        okText: t('Resend'),
        icon: null,
        closable: false,
        centered: true,
        title: (
          <div className="flex-column-center transaction-msg">
            <CustomSvg type="Warning" />
            {t('Transaction failed ！')}
          </div>
        ),
        onOk: () => {
          retryCrossChain(error);
        },
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t],
  );

  console.log('---------amount', amount);

  const sendHandler = useCallback(async () => {
    try {
      if (!chainInfo || !passwordSeed) return;
      const privateKey = aes.decrypt(wallet.AESEncryptPrivateKey, passwordSeed);
      console.log(getWallet(privateKey || ''), 'getWallet-privateKey======sendHandler');
      if (!privateKey) return;
      if (!tokenInfo) throw 'No Symbol info';
      // TODO
      // const amount = 10;
      setLoading(true);

      if (isCrossChain(toAccount.address, chainInfo?.chainId ?? 'AELF')) {
        console.log('crossChainTransfer==sendHandler');
        await crossChainTransfer({
          chainInfo,
          chainType: currentNetwork.walletType,
          privateKey,
          managerAddress: wallet.address,
          tokenInfo,
          caHash: wallet?.caHash || '',
          amount: timesDecimals(amount, tokenInfo.decimals).toNumber(),
          toAddress: toAccount.address,
          fee: timesDecimals(checkValue.fee, 8).toNumber(),
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
    } catch (error: any) {
      console.log('sendHandler==error', error);
      if (!error?.type) return message.error(error);
      if (error.type === 'managerTransfer') {
        return message.error(error);
      } else if (error.type === 'crossChainTransfer') {
        dispatch(
          addFailedActivity({
            transactionId: error.managerTransferTxId,
            params: error.data,
          }),
        );
        console.log('addFailedActivity', error.data);

        showErrorModal(error);
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
    checkValue.fee,
    currentNetwork.walletType,
    dispatch,
    passwordSeed,
    setLoading,
    showErrorModal,
    toAccount.address,
    tokenInfo,
    wallet.AELF?.caHash,
    wallet.AESEncryptPrivateKey,
    wallet.address,
    wallet?.caHash,
  ]);
  console.log(checkValue, 'checkValue===');

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
              content: t('The receiving address is a cross-chain transfer transaction'),
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
          />
        ),
      },
      1: {
        btnText: 'Preview',
        handler: () => {
          const { balance, fee, amount } = checkValue;
          if (Number(amount) > Number(balance)) {
            setTipMsg(type === 'nft' ? 'Insufficient quantity' : 'Insufficient funds');
          } else if (Number(fee) > Number(balance) - Number(amount)) {
            setTipMsg('Insufficient funds for transaction fee');
          } else {
            setTipMsg('');
            setStage(Stage.Preview);
          }
        },
        backFun: () => {
          setStage(Stage.Address);
          setAmount('');
        },
        element: (
          <AmountInput
            type={type as any}
            fromAccount={{
              address: wallet[DefaultChainId]?.caAddress || '',
              AESEncryptPrivateKey: wallet.AESEncryptPrivateKey,
            }}
            toAccount={{
              address: toAccount.address,
            }}
            value={amount}
            errorMsg={tipMsg}
            token={tokenInfo as BaseToken}
            onChange={(amount) => {
              setAmount(amount);
            }}
            onTxFeeChange={(fee) => {
              setTransactionFee(fee);
            }}
            onCheckValue={setCheckValue}
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
            toAccount={toAccount}
            amount={amount}
            symbol={tokenInfo?.symbol || ''}
            transactionFee={txFee || ''}
          />
        ),
      },
    }),
    [
      type,
      wallet,
      toAccount,
      amount,
      tipMsg,
      tokenInfo,
      txFee,
      validateToAddress,
      chainInfo?.chainId,
      t,
      navigate,
      checkValue,
      sendHandler,
    ],
  );

  return (
    <div className="page-send">
      <TitleWrapper
        className="page-title"
        title={`Send ${state === 'token' ? symbol : ''}`}
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
      <Button onClick={() => showErrorModal({})}>test</Button>
    </div>
  );
}
