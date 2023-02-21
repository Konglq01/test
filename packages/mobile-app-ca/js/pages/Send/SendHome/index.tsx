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
import { IToSendHomeParamsType, IToSendPreviewParamsType } from '@portkey/types/types-ca/routeParams';

export interface SendHomeProps {
  route?: any;
}
enum ErrorMessage {
  RecipientAddressIsInvalid = 'Recipient address is invalid',
  NoCorrespondingNetwork = 'No corresponding network',
  InsufficientFunds = 'Insufficient quantity',
  InsufficientQuantity = 'Insufficient funds for transaction fee',
  InsufficientFundsForTransactionFee = 'Insufficient funds for transaction fee',
}

const SendHome: React.FC<SendHomeProps> = props => {
  const { t } = useLanguage();

  // const {
  //   tokenItem = {
  //     symbol: 'ELF',
  //     decimals: 8,
  //     address: 'JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE',
  //     tokenContractAddress: 'JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE',
  //   },
  //   nftItem,
  //   name,
  //   sendType,
  //   chainId,
  //   address,
  // } = useRouterParams<{
  //   tokenItem: TokenItemShowType;
  //   nftItem: any;
  //   name: string;
  //   sendType: 'nft' | 'token';
  //   chainId: string;
  //   address: string;
  // }>();

  const { sendType, toInfo, assetInfo } = useRouterParams<IToSendHomeParamsType>();

  // tokenItem, address, name,
  const { data, refetch } = useGetELFRateQuery({});

  const wallet = useCurrentWalletInfo();
  const chainInfo = useCurrentChain(assetInfo?.chainId);

  const pin = usePin();

  const [, requestQrPermission] = useQrScanPermission();

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const [selectedFromAccount] = useState({ name: '', address: '' }); // from
  const [selectedToContact, setSelectedToContact] = useState(toInfo); // to
  const [selectedAssets, setSelectedAssets] = useState(assetInfo); // token or nft
  const [sendNumber, setSendNumber] = useState<string>('0'); // tokenNumber  like 100
  const debounceSendNumber = useDebounce(sendNumber, 500);
  const [transactionFee, setTransactionFee] = useState<string>('0'); // like 1.2ELF

  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<any[]>([]);

  useEffectOnce(() => {
    refetch();
  });

  // useFocusEffect(
  //   useCallback(() => {
  //     const tmpAddress = formatAddress2NoPrefix(address || '');
  //     setSelectedToContact({ name, address: tmpAddress });
  //   }, [address, name]),
  // );

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
        contractAddress: selectedAssets.tokenContractAddress,
        methodName: 'Transfer',
        args: {
          symbol: selectedAssets.symbol,
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
    debounceSendNumber,
    wallet,
    wallet.caHash,
    selectedAssets.tokenContractAddress,
    selectedAssets.symbol,
  ]);

  const totalPay = useMemo(() => {
    // TODO: TransferNumber + Transaction Fee
    const totalTransactionFee = ZERO.plus(transactionFee).times(data?.USDT || 0);
    const totalTransferNumber = assetInfo.symbol === 'ELF' ? ZERO.plus(sendNumber).times(data?.USDT || 0) : ZERO;
    console.log(totalTransactionFee.valueOf(), totalTransferNumber.valueOf());

    return totalTransactionFee.plus(totalTransferNumber);
  }, [assetInfo.symbol, data?.USDT, sendNumber, transactionFee]);

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
            title: t(''),
            message: t('The receiving address is a cross-chain transfer transaction'),
            buttons: [
              {
                title: t('Cancel'),
                type: 'outline',
              },
              {
                title: t('Confirm'),
                type: 'primary',
                onPress: () => {
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
    if (isCrossChain(selectedToContact.address, assetInfo.chainId)) return showDialog('crossChain');

    return true;
  };

  const checkCanPreview = () => {
    if (transactionFee === '0' || transactionFee === '') return;

    const tokenBalanceBigNumber = ZERO.plus(selectedAssets?.balance || 0).div(`1e${selectedAssets?.decimals}`);

    if (sendType === 'nft') {
      if (ZERO.plus(sendNumber).isGreaterThan(selectedAssets.balance)) {
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

    // TODO: get balance dynamic
    // peijuan code start
    // if (sendType === 'token') {
    //   // token
    //   if (ZERO.plus(sendNumber).times(`1e${assetInfo.decimals}`).isGreaterThan(ZERO.plus(assetInfo.balance))) {
    //     setErrorMessage([ErrorMessage.InsufficientFunds]);
    //   }
    //   if (assetInfo.symbol === 'ELF') {
    //     if (ZERO.plus(assetInfo.balance).times(`1e${elf.decimals}`).isEqualTo(ZERO.plus(balance))) {
    //       return ErrorMessage.InsufficientFunds;
    //     }
    //   }
    //   const fee = await getTranslationInfo();
    //   setTxFee(fee);
    //   if (symbol === 'ELF') {
    //     if (
    //       ZERO.plus(amount)
    //         .plus(fee || '')
    //         .times(`1e${tokenInfo.decimals}`)
    //         .isGreaterThan(ZERO.plus(balance))
    //     ) {
    //       return ErrorMessage.InsufficientFunds;
    //     }
    //   } else {
    //     const elfBalance = await getEleBalance();
    //     if (
    //       ZERO.plus(fee || '')
    //         .times(`1e${tokenInfo.decimals}`)
    //         .isGreaterThan(ZERO.plus(elfBalance))
    //     ) {
    //       return ErrorMessage.InsufficientFunds;
    //     }
    //   }
    // } else {
    //   // nft

    //   if (ZERO.plus(amount).isGreaterThan(ZERO.plus(balance))) {
    //     return ErrorMessage.InsufficientQuantity;
    //   }
    //   const fee = await getTranslationInfo();
    //   setTxFee(fee);
    //   const elfBalance = await getEleBalance();
    //   if (
    //     ZERO.plus(fee || '')
    //       .times(`1e${tokenInfo.decimals}`)
    //       .isGreaterThan(ZERO.plus(elfBalance))
    //   ) {
    //     return ErrorMessage.InsufficientFunds;
    //   }
    // }

    // peijuan code end

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
      assetInfo: selectedAssets,
      toInfo: { ...selectedToContact, address: tmpAddress },
      transactionFee,
      sendNumber,
    } as IToSendPreviewParamsType);
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
      {/* Group 1 */}
      <View style={styles.group}>
        <From selectedFromAccount={selectedFromAccount} />
        <To
          step={step}
          setStep={setStep}
          selectedToContact={selectedToContact}
          setSelectedToContact={setSelectedToContact}
        />
      </View>
      {errorMessage.includes(ErrorMessage.RecipientAddressIsInvalid) && (
        <Text style={styles.errorMessage}>{t(ErrorMessage.RecipientAddressIsInvalid)}</Text>
      )}

      {/* Group 2 token */}
      {sendType === 'token' && step === 2 && (
        <View style={styles.group}>
          <AmountToken
            rate={data ?? { USDT: 0 }}
            balanceShow={assetInfo.balance}
            sendTokenNumber={sendNumber}
            setSendTokenNumber={setSendNumber}
            selectedToken={assetInfo}
            selectedAccount={selectedFromAccount}
            setSelectedToken={setSelectedAssets}
          />
        </View>
      )}

      {/* Group 2 nft */}
      {sendType === 'nft' && step === 2 && (
        <View style={styles.group}>
          <NFTInfo nftItem={assetInfo} />
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

      {errorMessage.includes(ErrorMessage.InsufficientQuantity) && (
        <Text style={[styles.errorMessage, GStyles.textAlignCenter]}>{t(ErrorMessage.InsufficientQuantity)}</Text>
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

      {/* Group 3 contact */}
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
