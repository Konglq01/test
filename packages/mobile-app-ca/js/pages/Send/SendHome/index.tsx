import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import PageContainer from 'components/PageContainer';
import navigationService from 'utils/navigationService';
import { useFocusEffect } from '@react-navigation/native';
import { addressFormat, isAddress } from '@portkey/utils';
import Svg from 'components/Svg';
import From from '../From';
import To from '../To';
// import CommonToast from 'components/CommonToast';
// import { divDecimals, timesDecimals } from '@portkey/utils/converter';
import { styles } from './style';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import ActionSheet from 'components/ActionSheet';
import useQrScanPermission from 'hooks/useQrScanPermission';
import { ZERO } from '@portkey/constants/misc';
import { useGetELFRateQuery } from '@portkey/store/rate/api';
import { customFetch } from '@portkey/utils/fetch';
import useEffectOnce from 'hooks/useEffectOnce';
import { formatAddress2NoPrefix } from 'utils';
import { addRecentContact } from '@portkey/store/trade/slice';
import { isCrossChain } from '@portkey/utils/aelf';
import useDebounce from 'hooks/useDebounce';
import { useLanguage } from 'i18n/hooks';
import SelectContact from '../SelectContact';
import AmountToken from '../AmountToken';
import AmountNFT from '../AmountNFT';
import NFTInfo from '../NFTInfo';
import GStyles from 'assets/theme/GStyles';
import CommonButton from 'components/CommonButton';
import useRouterParams from '@portkey/hooks/useRouterParams';
import { TokenItemShowType } from '@portkey/types/types-ca/token';
import { getContractBasic } from '@portkey/contracts/utils';
import { useCurrentWalletInfo, useWallet } from '@portkey/hooks/hooks-ca/wallet';
import { useCurrentChain } from '@portkey/hooks/hooks-ca/chainList';
import { getManagerAccount } from 'utils/redux';
import { usePin } from 'hooks/store';
import { unitConverter } from '@portkey/utils/converter';

export interface SendHomeProps {
  route?: any;
}
enum ErrorMessage {
  RecipientAddressIsInvalid = 'Recipient address is invalid',
  NoCorrespondingNetwork = 'No corresponding network',
  InsufficientFunds = 'Insufficient funds',
  InsufficientFundsForTransactionFee = 'Insufficient funds for transaction fee',
}

const SendHome: React.FC<SendHomeProps> = props => {
  const { t } = useLanguage();

  const {
    tokenItem = {
      symbol: 'ELF',
      decimals: 8,
      address: 'JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE',
      tokenContractAddress: 'JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE',
    },
    nftItem,
    name,
    sendType,
    chainId,
    address,
  } = useRouterParams<{
    tokenItem: TokenItemShowType;
    nftItem: any;
    name: string;
    sendType: 'nft' | 'token';
    chainId: string;
    address: string;
  }>();

  // tokenItem, address, name,
  const { data, refetch } = useGetELFRateQuery({});

  const wallet = useCurrentWalletInfo();
  const chainInfo = useCurrentChain();
  const pin = usePin();

  const [, requestQrPermission] = useQrScanPermission();

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const [selectedFromAccount] = useState({ name: '', address: '' }); // from
  const [selectedToContact, setSelectedToContact] = useState({ name: '', address: '0' }); // to
  const [selectedToken, setSelectedToken] = useState(tokenItem); // tokenType
  const [isCrossChainTransfer, setIsCrossChainTransfer] = useState(false);
  const [selectedNft, setSelectedNft] = useState(nftItem);
  const [sendNumber, setSendNumber] = useState<string>('0'); // tokenNumber  like 100
  const debounceSendNumber = useDebounce(sendNumber, 500);
  const [transactionFee, setTransactionFee] = useState<string>('0'); // like 1.2ELF

  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading] = useState(false);
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

  // get transfer fee
  useEffect(() => {
    (async () => {
      if (debounceSendNumber === '' || debounceSendNumber === '0') return;

      if (!chainInfo || !pin) return;
      const account = getManagerAccount(pin);
      if (!account) return;

      const contract = await getContractBasic({
        contractAddress: chainInfo.caContractAddress,
        rpcUrl: chainInfo?.endPoint,
        account: account,
      });

      const raw = await contract.encodedTx('ManagerForwardCall', {
        caHash: wallet.caHash,
        contractAddress: tokenItem.tokenContractAddress,
        methodName: 'Transfer',
        args: {
          symbol: selectedToken.symbol,
          to: selectedToContact.address,
          amount: debounceSendNumber,
          memo: '',
        },
      });

      const { TransactionFee } = await customFetch(`${chainInfo?.endPoint}/api/blockChain/calculateTransactionFee`, {
        method: 'POST',
        params: {
          RawTransaction: raw,
        },
      });

      console.log('====TransactionFee======', TransactionFee);

      setTransactionFee(unitConverter(ZERO.plus(TransactionFee.ELF).div('1e8')));

      // const tmpTransactionFee = divDecimals(ZERO.plus(TransactionFee[selectedToken.symbol]), selectedToken.decimals);
    })();
  }, [
    chainInfo,
    pin,
    selectedToContact.address,
    selectedToken.address,
    selectedToken.symbol,
    debounceSendNumber,
    tokenItem.tokenContractAddress,
    wallet,
    wallet.caHash,
  ]);

  const totalPay = useMemo(() => {
    // TODO: TransferNumber + Transaction Fee
    const totalTransactionFee = ZERO.plus(transactionFee).times(data?.USDT || 0);
    const totalTransferNumber = selectedToken === 'ELF' ? ZERO.plus(sendNumber).times(data?.USDT || 0) : ZERO;
    console.log(totalTransactionFee.valueOf(), totalTransferNumber.valueOf());

    return totalTransactionFee.plus(totalTransferNumber);
  }, [data?.USDT, selectedToken, sendNumber, transactionFee]);

  const buttonDisabled = useMemo(() => {
    console.log(!selectedToContact.address, Number(sendNumber));

    if (!selectedToContact.address) return true;
    if (Number(sendNumber) <= 0) return true;
    // if (transactionFee[0] === '-') return true;
    return false;
  }, [selectedToContact.address, sendNumber]);

  const nextDisable = useMemo(() => {
    if (!selectedToContact?.address) return true;
    return false;
  }, [selectedToContact.address]);

  const previewDisable = useMemo(() => {
    if (!selectedToContact?.address) return true;
    if (sendNumber === '0' || !sendNumber) return true;
    return false;
  }, [selectedToContact?.address, sendNumber]);

  // warning dialog
  const showDialog = useCallback(
    (type: 'no-authority' | 'clearAddress' | 'crossChain') => {
      switch (type) {
        case 'no-authority':
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

          break;

        case 'clearAddress':
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

          break;

        case 'crossChain':
          ActionSheet.alert({
            title: t('Enable Camera Access'),
            message: t('The receiving address is a cross-chain transfer transaction'),
            buttons: [
              {
                title: t('Cancel'),
                type: 'solid',
              },
              {
                title: t('Confirm'),
                type: 'primary',
                onPress: () => {
                  setIsCrossChainTransfer(true);
                  nextStep(true);
                },
              },
            ],
          });
          break;

        default:
          break;
      }
    },
    [t],
  );

  // const showCrossChainTips = () => {
  //   CrossChainTransferModal.alert({});
  // };

  //when finish send  upDate balance

  const checkCanNext = () => {
    const errorArr = [];
    if (!isAddress(selectedToContact.address)) errorArr.push(ErrorMessage.RecipientAddressIsInvalid);
    setErrorMessage(errorArr);
    if (errorArr.length) return false;

    // TODO: check if  cross chain
    if (isCrossChain(selectedToContact.address, 'AELF')) return showDialog('crossChain');

    return true;
  };

  const checkCanPreview = () => {
    if (transactionFee === '0' || transactionFee === '') return;

    const tokenBalanceBigNumber = ZERO.plus(tokenItem?.balance || 0).div(`1e${tokenItem?.decimals}`);

    if (sendType === 'nft') {
      if (ZERO.plus(sendNumber).isGreaterThan(nftItem.balance)) {
        setErrorMessage([ErrorMessage.InsufficientFunds]);
        return false;
      }
    } else {
      // Insufficient funds
      if (ZERO.plus(sendNumber).isGreaterThan(tokenBalanceBigNumber)) {
        setErrorMessage([ErrorMessage.InsufficientFunds]);
        return false;
      }
      // InsufficientFundsForTransactionFee
      if (ZERO.plus(sendNumber).plus(transactionFee).isGreaterThan(tokenBalanceBigNumber)) {
        setErrorMessage([ErrorMessage.InsufficientFundsForTransactionFee]);
        return false;
      }
    }

    return true;
  };

  const nextStep = (directNext?: boolean) => {
    // directNext true , is cross chain and has finished check
    if (directNext) {
      return setStep(2);
    }

    if (!checkCanNext()) return;
    setStep(2);
  };

  const preview = () => {
    // TODO : getTransactionFee and check the balance

    let tmpAddress = selectedToContact.address;
    if (!selectedToContact.address.includes('_')) {
      tmpAddress = `ELF_${tmpAddress}_AELF`;
    }

    navigationService.navigate('SendPreview', {
      sendType,
      sendInfo: {
        isCrossChainTransfer,
        selectedToContact: { ...selectedToContact, address: tmpAddress },
        tokenItem,
        nftItem,
        sendNumber,
        transactionFee,
      },
    });
  };

  return (
    <PageContainer
      safeAreaColor={['blue', step === 1 ? 'white' : 'gray']}
      titleDom={t('Send')}
      rightDom={
        sendType === 'token' ? (
          <TouchableOpacity
            onPress={async () => {
              if (selectedToContact?.address) return showDialog('clearAddress');
              if (!(await requestQrPermission())) return showDialog('no-authority');

              navigationService.navigate('QrScanner', { fromSendPage: true });
            }}>
            <Svg icon="scan" size={pTd(17.5)} color={defaultColors.font2} />
          </TouchableOpacity>
        ) : undefined
      }
      containerStyles={styles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <View style={styles.group}>
        <From selectedFromAccount={selectedFromAccount} />
        <To
          step={step}
          tokenItem={tokenItem}
          selectedToContact={selectedToContact}
          setSelectedToContact={setSelectedToContact}
          setStep={setStep}
        />
      </View>
      {errorMessage.includes(ErrorMessage.RecipientAddressIsInvalid) && (
        <Text style={styles.errorMessage}>{t(ErrorMessage.RecipientAddressIsInvalid)}</Text>
      )}

      {sendType === 'token' && step === 2 && (
        <View style={styles.group}>
          <AmountToken
            rate={data ?? { USDT: 0 }}
            balanceShow={tokenItem.balance}
            sendTokenNumber={sendNumber}
            setSendTokenNumber={setSendNumber}
            selectedToken={selectedToken}
            selectedAccount={selectedFromAccount}
            setSelectedToken={setSelectedToken}
          />
        </View>
      )}

      {sendType === 'nft' && step === 2 && (
        <View style={styles.group}>
          <NFTInfo nftItem={nftItem} />
        </View>
      )}

      {sendType === 'nft' && step === 2 && (
        <View style={styles.group}>
          <AmountNFT sendNumber={sendNumber} setSendNumber={setSendNumber} />
        </View>
      )}

      {errorMessage.includes(ErrorMessage.InsufficientFunds) && (
        <Text style={[styles.errorMessage, GStyles.textAlignCenter]}>{t(ErrorMessage.InsufficientFunds)}</Text>
      )}

      {errorMessage.includes(ErrorMessage.InsufficientFundsForTransactionFee) && (
        <Text style={[styles.errorMessage, GStyles.textAlignCenter]}>
          {t(ErrorMessage.InsufficientFundsForTransactionFee)}
        </Text>
      )}

      {/* total fee */}
      {/* <View style={styles.group}>
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
      </View> */}
      <View style={styles.space} />
      {step === 1 && (
        <SelectContact
          onPress={(item: { address: string; name: string }) => {
            setSelectedToContact(item);
          }}
        />
      )}

      <View style={styles.buttonWrapStyle}>
        {step === 2 && (
          <CommonButton
            disabled={previewDisable}
            loading={isLoading}
            title={t('Preview')}
            type="primary"
            onPress={preview}
          />
        )}
        {step === 1 && (
          <CommonButton
            loading={isLoading}
            disabled={nextDisable}
            title={t('Next')}
            type="primary"
            onPress={() => nextStep()}
          />
        )}
      </View>
    </PageContainer>
  );
};

export default memo(SendHome);
