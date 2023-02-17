import { DefaultChainId } from '@portkey/constants/constants-ca/network';
import { useCurrentChain } from '@portkey/hooks/hooks-ca/chainList';
import { useCurrentNetworkInfo } from '@portkey/hooks/hooks-ca/network';
import { useCurrentWallet } from '@portkey/hooks/hooks-ca/wallet';
import { AddressBookError } from '@portkey/store/addressBook/types';
import { addFailedActivity } from '@portkey/store/store-ca/activity/slice';
import { AddressItem, ContactItemType } from '@portkey/types/types-ca/contact';
import { isDIDAddress } from '@portkey/utils';
import { getAelfAddress, getWallet, isCrossChain } from '@portkey/utils/aelf';
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
  const wallet = useCurrentWallet();
  const currentNetwork = useCurrentNetworkInfo();
  const { passwordSeed } = useUserInfo();
  console.log(wallet, 'wallet===');
  const { setLoading } = useLoading();

  const dispatch = useAppDispatch();

  const { contactIndexList } = useContact();
  const { t } = useTranslation();
  const [errorMsg, setErrorMsg] = useState('');
  const [toAccount, setToAccount] = useState<{ name?: string; address: string }>({ address: '' });
  const [stage, setStage] = useState<Stage>(Stage.Address);
  const [amount, setAmount] = useState('');

  const tokenInfo: any = useMemo(
    () => ({
      symbol: 'ELF',
      decimals: 8,
      address: 'JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE',
    }),
    // ({
    //   symbol: 'BTX-2',
    //   decimals: 0,
    //   tokenName: '1155-BTX2',
    //   address: 'JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE',
    //   supply: '1000',
    //   totalSupply: '1000',
    //   issuer: '2KQWh5v6Y24VcGgsx2KHpQvRyyU5DnCZ4eAUPqGQbnuZgExKaV',
    //   isBurnable: true,
    //   issueChainId: 9992731,
    //   issued: '1000',
    //   externalInfo: { value: { __nft_image_url: 'nft_image_url', __nft_is_burned: 'true' } },
    // }),

    [],
  );

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
        await intervalCrossChainTransfer(data);
      } catch (error) {
        dispatch(
          addFailedActivity({
            transactionId: managerTransferTxId,
            params: data,
          }),
        );
      }
    },
    [dispatch],
  );

  const sendHandler = useCallback(async () => {
    try {
      if (!chainInfo || !passwordSeed) return;
      const privateKey = aes.decrypt(wallet.walletInfo.AESEncryptPrivateKey, passwordSeed);
      console.log(getWallet(privateKey || ''), 'getWallet-privateKey======sendHandler');
      if (!privateKey) return;
      // TODO
      const amount = 10;
      setLoading(true);
      if (isCrossChain(toAccount.address, chainInfo?.chainId ?? 'AELF')) {
        console.log('crossChainTransfer==sendHandler');
        await crossChainTransfer({
          chainInfo,
          chainType: currentNetwork.walletType,
          privateKey,
          managerAddress: wallet.walletInfo.address,
          tokenInfo,
          caHash: wallet.walletInfo.AELF?.caHash || '',
          amount: timesDecimals(amount, tokenInfo.decimals).toNumber(),
          toAddress: toAccount.address,
        });
      } else {
        console.log('sameChainTransfers==sendHandler');
        await sameChainTransfer({
          chainInfo,
          chainType: currentNetwork.walletType,
          privateKey,
          tokenInfo,
          caHash: wallet.walletInfo.AELF?.caHash || '',
          amount: timesDecimals(amount, tokenInfo.decimals).toNumber(),
          toAddress: toAccount.address,
        });
      }
      message.success('success');
    } catch (error: any) {
      console.log('sendHandler==error', error);
      if (error.type === 'managerTransfer') {
        return message.error(error);
      } else {
        // TODO tip retry
        // retryCrossChain(error)
      }
    } finally {
      setLoading(false);
    }
  }, [amount, chainInfo, currentNetwork.walletType, passwordSeed, setLoading, toAccount.address, tokenInfo, wallet]);

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
            onClick={(account: AddressItem & { name?: string }) => {
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
          // TODO check balance and transaction fee
          setStage(Stage.Preview);
        },
        backFun: () => {
          setStage(Stage.Address);
          setAmount('');
        },
        element: (
          <AmountInput
            type="nft"
            fromAccount={{
              address: '',
              AESEncryptPrivateKey: undefined,
            }}
            toAccount={{
              address: '',
            }}
            value={amount}
            token={{ id: '12', decimal: 8, address: '213', symbol: 'ELF', name: 'ELF', chainId: 'AELF' }}
            onChange={(amount) => {
              setAmount(amount);
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
        element: <SendPreview toAccount={toAccount} amount={amount} symbol={'ELF'} transactionFee={'123'} />,
      },
    }),
    [amount, chainInfo, navigate, sendHandler, t, toAccount, validateToAddress],
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
    </div>
  );
}
