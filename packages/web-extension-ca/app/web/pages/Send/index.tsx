import { AddressBookError } from '@portkey/store/addressBook/types';
import { AddressItem, ContactItemType } from '@portkey/types/types-ca/contact';
import { isDIDAddress } from '@portkey/utils';
import { getAelfAddress } from '@portkey/utils/aelf';
import { Button, Modal } from 'antd';
import CustomSvg from 'components/CustomSvg';
import TitleWrapper from 'components/TitleWrapper';
import { ReactElement, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useDebounce } from 'react-use';
import { useContact, useWalletInfo } from 'store/Provider/hooks';
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
  const { symbol } = useParams();
  const { contactIndexList } = useContact();
  // const { state } = useLocation();
  const { t } = useTranslation();
  const [errorMsg, setErrorMsg] = useState('');
  const [toAccount, setToAccount] = useState<{ name?: string; address: string }>({ address: '' });
  const [stage, setStage] = useState<Stage>(Stage.Address);
  const [amount, setAmount] = useState('');

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
      contactIndexList.forEach(({ index, contacts }) => {
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

  const StageObj: TypeStageObj = useMemo(
    () => ({
      0: {
        btnText: 'Next',
        handler: () => {
          const res = validateToAddress(toAccount);

          if (!res) return;
          Modal.confirm({
            width: 320,
            content: t('The receiving address is a cross-chain transfer transaction'),
            className: 'cross-modal delete-modal',
            icon: null,
            centered: true,
            okText: t('Continue'),
            cancelText: t('Cancel'),
            onOk: () => setStage(Stage.Amount),
          });
          // setStage(Stage.Amount);
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
            token={{ id: '12', decimals: 8, address: '213', symbol: 'ELF', name: 'ELF' }}
            onChange={(amount) => {
              setAmount(amount);
            }}
          />
        ),
      },
      2: {
        btnText: 'Send',
        handler: () => {
          console.log('>>>');
          navigate('/');
        },
        backFun: () => {
          setStage(Stage.Amount);
        },
        element: <SendPreview toAccount={toAccount} amount={amount} symbol={'ELF'} transactionFee={'123'} />,
      },
    }),
    [amount, navigate, t, toAccount, validateToAddress],
  );

  return (
    <div className="page-send">
      <TitleWrapper
        className="page-title"
        // TODO when sending nft, only 'Send' is displayed
        title={'Send ' + symbol}
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
