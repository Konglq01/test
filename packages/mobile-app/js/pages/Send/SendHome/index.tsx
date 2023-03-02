import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import PageContainer from 'components/PageContainer';
import navigationService from 'utils/navigationService';
import { useFocusEffect } from '@react-navigation/native';
import { isAddress } from '@portkey-wallet/utils';
import type { AccountType } from '@portkey-wallet/types/wallet';
import { useCredentials, useWallet } from 'hooks/store';
import Svg from 'components/Svg';
import From from '../From';
import To from '../To';
import Amount from '../Amount';
import CommonToast from 'components/CommonToast';
import { getELFContract } from 'contexts/utils';
import { getCurrentAccount } from 'utils/redux';
import { divDecimals, timesDecimals, unitConverter } from '@portkey-wallet/utils/converter';
import { styles, thirdGroupStyle } from './style';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import { TextM, TextS } from 'components/CommonText';
import CommonButton from 'components/CommonButton';
import ActionSheet from 'components/ActionSheet';
import useQrScanPermission from 'hooks/useQrScanPermission';
// import CrossChainTransferModal from '../components/CrossChainTransferModal';
import { ZERO } from '@portkey-wallet/constants/misc';
import { useGetELFRateQuery } from '@portkey-wallet/store/rate/api';
// import { ContractBasic } from 'utils/contract';
import { customFetch } from '@portkey-wallet/utils/fetch';
import useEffectOnce from 'hooks/useEffectOnce';
import { formatAddress2NoPrefix } from 'utils';
import { addRecentContact } from '@portkey-wallet/store/trade/slice';
import { isAelfAddress } from '@portkey-wallet/utils/aelf';
import { updateBalance } from '@portkey-wallet/store/tokenBalance/slice';
import useDebounce from 'hooks/useDebounce';
import { useLanguage } from 'i18n/hooks';
import { useAppCommonDispatch, useAppEOASelector } from '@portkey-wallet/hooks';
export interface SendHomeProps {
  route?: any;
}

enum ErrorMessage {
  RecipientAddressIsInvalid = 'Recipient address is invalid',
  NoCorrespondingNetwork = 'No corresponding network',
  InsufficientFunds = 'Insufficient funds',
  InsufficientFundsForTransactionFee = 'Insufficient funds for transaction fee',
}

const ELF_DECIMAL = 8;

const SendHome: React.FC<SendHomeProps> = props => {
  const { t } = useLanguage();
  const { route } = props;
  const { params } = route;
  const { tokenItem, address, name } = params;

  const { data, refetch } = useGetELFRateQuery({});

  const credentials = useCredentials();
  const { accountList } = useWallet();
  const [, requestQrPermission] = useQrScanPermission();
  const dispatch = useAppCommonDispatch();

  const { currentAccount } = useAppEOASelector(state => state.wallet);
  const { currentChain } = useAppEOASelector(state => state.chain);
  const { balances } = useAppEOASelector(state => state.tokenBalance);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const [selectedFromAccount, setSelectedFromAccount] = useState<AccountType>(currentAccount!); // from
  const [selectedToContact, setSelectedToContact] = useState({ name: '', address: '0' }); // to
  const [selectedToken, setSelectedToken] = useState(tokenItem); // tokenType
  const [sendTokenNumber, setSendTokenNumber] = useState<string>('0'); // tokenNumber  like 100
  const debounceTokenNumber = useDebounce(sendTokenNumber, 1000);
  const [transactionFee, setTransactionFee] = useState<string>('0'); // like 1.2ELF

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<any[]>([]);

  useEffectOnce(() => {
    refetch();
  });

  useFocusEffect(
    useCallback(() => {
      const tmpAddress = formatAddress2NoPrefix(address || '');
      setSelectedToContact({ name, address: tmpAddress });
    }, [address, name]),
  );

  const balanceShow = useMemo(() => {
    return `${balances?.[currentChain?.rpcUrl]?.[selectedFromAccount?.address ?? '']?.[selectedToken?.symbol]}`; // raw data like 1000000000
  }, [balances, currentChain?.rpcUrl, selectedFromAccount?.address, selectedToken?.symbol]);

  const elfBalance = useMemo(() => {
    return `${balances?.[currentChain?.rpcUrl]?.[selectedFromAccount?.address ?? '']?.ELF}`; // raw data like 1000000000
  }, [balances, currentChain?.rpcUrl, selectedFromAccount?.address]);

  // get transfer fee
  useEffect(() => {
    if (balanceShow === '0') return setTransactionFee('0');
    if (!isAelfAddress(selectedToContact.address)) return;

    (async () => {
      const tmpAccount = getCurrentAccount(credentials?.password || '', selectedFromAccount);
      if (!tmpAccount) return;

      const getContractParams = {
        rpcUrl: currentChain?.rpcUrl,
        contractAddress:
          currentChain.basicContracts?.tokenContract || 'JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE',
        account: tmpAccount,
      };

      try {
        const elfContract = await getELFContract(getContractParams);
        console.log('elfContract', elfContract);

        // test transactionFee
        const raw = await elfContract?.encodedTx('Transfer', {
          symbol: selectedToken.symbol,
          memo: '',
          to: selectedToContact.address,
          amount: timesDecimals(debounceTokenNumber, selectedToken?.decimals ?? 8).toFixed(),
        });
        console.log(raw, `${currentChain?.rpcUrl}/api/blockChain/calculateTransactionFee`, '====raw');

        const { TransactionFee } = await customFetch(`${currentChain?.rpcUrl}/api/blockChain/calculateTransactionFee`, {
          method: 'POST',
          params: {
            RawTransaction: raw,
          },
        });

        console.log('====TransactionFee======', TransactionFee);

        const tmpTransactionFee = divDecimals(ZERO.plus(TransactionFee[selectedToken.symbol]), selectedToken.decimals);

        setTransactionFee(String(tmpTransactionFee));
      } catch (error) {
        console.log('get transactionFee error!', error);
      }
    })();
  }, [
    balanceShow,
    credentials?.password,
    currentChain,
    data?.USDT,
    selectedFromAccount,
    selectedToContact.address,
    selectedToken.decimals,
    selectedToken.symbol,
    debounceTokenNumber,
  ]);

  const totalPay = useMemo(() => {
    // TODO: TransferNumber + Transaction Fee
    const totalTransactionFee = ZERO.plus(transactionFee).times(data?.USDT || 0);
    const totalTransferNumber =
      selectedToken.symbol === 'ELF' ? ZERO.plus(sendTokenNumber).times(data?.USDT || 0) : ZERO;
    console.log(totalTransactionFee.valueOf(), totalTransferNumber.valueOf());

    return totalTransactionFee.plus(totalTransferNumber);
  }, [data?.USDT, selectedToken, sendTokenNumber, transactionFee]);

  const buttonDisabled = useMemo(() => {
    console.log(!selectedToContact.address, Number(sendTokenNumber));

    if (!selectedToContact.address) return true;
    if (Number(sendTokenNumber) <= 0) return true;
    // if (transactionFee[0] === '-') return true;

    return false;
  }, [selectedToContact.address, sendTokenNumber]);

  // warning dialog
  const showDialog = useCallback(
    (type: 'no-authority' | 'clearAddress') => {
      if (type === 'clearAddress') {
        ActionSheet.alert({
          title: t('Clear Address First'),
          message: t('Only after clearing the receiving address can the new address be scanned'),
          buttons: [
            {
              title: t('Close'),
              type: 'solid',
            },
          ],
        });
      } else {
        ActionSheet.alert({
          title: t('Enable Camera Access'),
          message: t('Cannot connect to the camera. Please make sure it is turned on'),
          buttons: [
            {
              title: t('Close'),
              type: 'solid',
            },
          ],
        });
      }
    },
    [t],
  );

  // const showCrossChainTips = () => {
  //   CrossChainTransferModal.alert({});
  // };

  const validate = () => {
    const validateArray = [];

    const tmpSelectedTokenBalance = divDecimals(balanceShow, selectedToken?.decimals);
    const tmpElfBalance = divDecimals(elfBalance, ELF_DECIMAL);

    if (!isAddress(selectedToContact?.address, 'aelf')) validateArray.push(ErrorMessage.RecipientAddressIsInvalid);

    // validate fee
    if (selectedToken.symbol === 'ELF') {
      // ELF
      const totalNeedElf = ZERO.plus(sendTokenNumber).plus(transactionFee);
      if (totalNeedElf.gt(tmpElfBalance) && ZERO.plus(sendTokenNumber).gt(tmpElfBalance)) {
        validateArray.push(ErrorMessage.InsufficientFunds);
      }
      if (totalNeedElf.gt(tmpElfBalance) && ZERO.plus(tmpElfBalance).gt(sendTokenNumber)) {
        validateArray.push(ErrorMessage.InsufficientFundsForTransactionFee);
      }
    } else {
      // other token
      if (ZERO.plus(transactionFee).gt(tmpElfBalance)) {
        validateArray.push(ErrorMessage.InsufficientFundsForTransactionFee);
      }
      if (ZERO.plus(sendTokenNumber).gt(tmpSelectedTokenBalance)) {
        validateArray.push(ErrorMessage.InsufficientFunds);
      }
    }

    setErrorMessage(validateArray);
    return !validateArray.length;
  };

  // upDate balance
  const upDateBalance = async () => {
    const tmpAccount = getCurrentAccount(credentials?.password || '', currentAccount as AccountType);
    if (!tmpAccount) return;
    const getContractParams = {
      rpcUrl: currentChain?.rpcUrl,
      contractAddress:
        currentChain.basicContracts?.tokenContract || 'JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE',
      account: tmpAccount,
    };

    const elfContract = await getELFContract(getContractParams);

    const accountBalance = await elfContract?.callViewMethod('GetBalance', {
      symbol: selectedToken.symbol,
      owner: tmpAccount.address,
    });
    console.log('accountBalance', accountBalance);

    dispatch(
      updateBalance({
        rpcUrl: currentChain.rpcUrl,
        account: currentAccount?.address || '',
        balances: [accountBalance],
      }),
    );
  };

  const transfer = async () => {
    if (!validate()) return;
    try {
      const tmpAccount = getCurrentAccount(credentials?.password || '', selectedFromAccount);
      if (!tmpAccount) return;
      setIsLoading(true);
      const getContractParams = {
        rpcUrl: currentChain?.rpcUrl,
        contractAddress:
          currentChain.basicContracts?.tokenContract || 'JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE',
        account: tmpAccount,
      };

      const elfContract = await getELFContract(getContractParams);
      console.log('elfContract', elfContract);
      const accountBalance = await elfContract?.callViewMethod('GetBalance', {
        symbol: 'ELF',
        owner: tmpAccount.address,
      });
      console.log('accountBalance', accountBalance);

      const paramsOption = {
        symbol: selectedToken?.symbol,
        memo: '',
        to: formatAddress2NoPrefix(selectedToContact.address),
        amount: timesDecimals(sendTokenNumber, selectedToken?.decimals ?? 8).toFixed(),
      };
      console.log('paramsOption', paramsOption);

      const result = await elfContract?.callSendMethod('Transfer', '', paramsOption);
      console.log('result', result);
      if (result.error) {
        setIsLoading(false);
        return CommonToast.fail(result.error.message);
      } else {
        // success
        console.log(result.TransactionId);
        setIsLoading(false);
        CommonToast.success(t('Transfer Successful'));
        upDateBalance();
        dispatch(
          addRecentContact({
            rpcUrl: currentChain.rpcUrl,
            contact: {
              name: selectedToContact.name,
              address: formatAddress2NoPrefix(selectedToContact.address),
            },
          }),
        );

        navigationService.goBack();
      }

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      CommonToast.fail('Please Try Again Later');
      setIsLoading(false);
    }
  };

  return (
    <PageContainer
      safeAreaColor={['blue', 'gray']}
      titleDom={t('Send')}
      rightDom={
        <TouchableOpacity
          onPress={async () => {
            if (selectedToContact?.address) return showDialog('clearAddress');
            if (!(await requestQrPermission())) return showDialog('no-authority');

            navigationService.navigate('QrScanner', { fromSendPage: true });
          }}>
          <Svg icon="scan" size={pTd(17.5)} color={defaultColors.font2} />
        </TouchableOpacity>
      }
      containerStyles={styles.pageWrap}>
      <View style={styles.group}>
        <From
          accountList={accountList}
          selectedFromAccount={selectedFromAccount}
          setSelectedFromAccount={setSelectedFromAccount}
        />
        <To
          tokenItem={tokenItem}
          selectedFromAccount={selectedFromAccount}
          selectedToContact={selectedToContact}
          setSelectedToContact={setSelectedToContact}
        />
      </View>
      {errorMessage.includes(ErrorMessage.RecipientAddressIsInvalid) && (
        <TextS style={styles.errorMessage}>{t(ErrorMessage.RecipientAddressIsInvalid)}</TextS>
      )}
      {errorMessage.includes(ErrorMessage.NoCorrespondingNetwork) && (
        <TextS style={styles.errorMessage}>{t(ErrorMessage.NoCorrespondingNetwork)}</TextS>
      )}
      <View style={styles.group}>
        <Amount
          rate={data ?? { USDT: 0 }}
          balanceShow={balanceShow}
          sendTokenNumber={sendTokenNumber}
          setSendTokenNumber={setSendTokenNumber}
          selectedToken={selectedToken}
          selectedAccount={selectedFromAccount}
          setSelectedToken={setSelectedToken}
        />
      </View>
      {errorMessage.includes(ErrorMessage.InsufficientFunds) && (
        <TextS style={styles.errorMessage}>{t(ErrorMessage.InsufficientFunds)}</TextS>
      )}
      {errorMessage.includes(ErrorMessage.InsufficientFundsForTransactionFee) && (
        <TextS style={styles.errorMessage}>{t(ErrorMessage.InsufficientFundsForTransactionFee)}</TextS>
      )}
      {/* total fee */}
      <View style={styles.group}>
        <View style={thirdGroupStyle.wrap}>
          <TextM style={thirdGroupStyle.title}>{t('Transaction Fee')}</TextM>
          <TextM style={thirdGroupStyle.tokenNum}>{`${
            transactionFee === '0' ? '--' : unitConverter(transactionFee)
          } ELF`}</TextM>
          <TextS style={thirdGroupStyle.usdtNum}>
            $
            {transactionFee === '0'
              ? '--'
              : ZERO.plus(transactionFee || 0)
                  .times(data?.USDT || 0)
                  .toFixed(2)}
          </TextS>
        </View>

        {selectedToken.symbol === 'ELF' && ZERO.plus(sendTokenNumber).gt(ZERO) && (
          <View style={[thirdGroupStyle.wrap, thirdGroupStyle.borderTop]}>
            <TextM style={thirdGroupStyle.title}>{t('Total')}</TextM>
            <TextM style={thirdGroupStyle.tokenNum}>
              {unitConverter(ZERO.plus(transactionFee).plus(ZERO.plus(sendTokenNumber)))}
              {selectedToken?.symbol}
            </TextM>
            <TextS style={thirdGroupStyle.usdtNum}>${unitConverter(totalPay.toFixed(2))}</TextS>
          </View>
        )}

        {selectedToken.symbol !== 'ELF' && ZERO.plus(sendTokenNumber).gt(ZERO) && (
          <View style={[thirdGroupStyle.wrap, thirdGroupStyle.borderTop, thirdGroupStyle.notELFWrap]}>
            <TextM style={thirdGroupStyle.title}>{t('Total')}</TextM>
            <View>
              <TextM style={thirdGroupStyle.tokenNum}>
                {unitConverter(sendTokenNumber, selectedToken.decimal)} {selectedToken?.symbol}
              </TextM>
              <View style={thirdGroupStyle.totalWithUSD}>
                <TextM style={thirdGroupStyle.tokenNum}>{`${transactionFee === '0' ? '--' : transactionFee} ${
                  'ELF' ?? '--'
                }`}</TextM>
                <TextS style={thirdGroupStyle.usdtNum}>${unitConverter(totalPay.toFixed(2))}</TextS>
              </View>
            </View>
          </View>
        )}
      </View>

      <View style={styles.buttonWrapStyle}>
        <CommonButton
          loading={isLoading}
          disabled={buttonDisabled}
          title={t('Send')}
          type="primary"
          onPress={transfer}
        />
      </View>
    </PageContainer>
  );
};

export default memo(SendHome);
