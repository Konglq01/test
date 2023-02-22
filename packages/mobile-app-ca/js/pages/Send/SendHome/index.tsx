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
import { timesDecimals, unitConverter } from '@portkey/utils/converter';
import { IToSendHomeParamsType, IToSendPreviewParamsType } from '@portkey/types/types-ca/routeParams';
import CommonToast from 'components/CommonToast';
import { getELFChainBalance } from '@portkey/utils/balance';
import finalPropsSelectorFactory from 'react-redux/es/connect/selectorFactory';

export interface SendHomeProps {
  route?: any;
}
enum ErrorMessage {
  RecipientAddressIsInvalid = 'Recipient address is invalid',
  NoCorrespondingNetwork = 'No corresponding network',
  InsufficientFunds = 'Insufficient funds',
  InsufficientQuantity = 'Insufficient Quantity',
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

  // useFocusEffect(
  //   useCallback(() => {
  //     const tmpAddress = formatAddress2NoPrefix(address || '');
  //     setSelectedToContact({ name, address: tmpAddress });
  //   }, [address, name]),
  // );

  // get transfer fee
  const getTransactionFee = useCallback(async () => {
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
        amount: timesDecimals(debounceSendNumber, selectedAssets.decimals || '0').toNumber(),
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

    if (!TransactionFee) throw { code: 500, message: 'no enough fee' };

    return unitConverter(ZERO.plus(TransactionFee.ELF).div('1e8'));
  }, [
    chainInfo,
    debounceSendNumber,
    pin,
    selectedAssets.decimals,
    selectedAssets.symbol,
    selectedAssets.tokenContractAddress,
    selectedToContact.address,
    wallet.caHash,
  ]);

  const getAssetBalance = async (tokenContractAddress: string, symbol: string) => {
    if (!chainInfo || !pin) return;
    const account = getManagerAccount(pin);
    if (!account) return;

    const contract = await getContractBasic({
      contractAddress: tokenContractAddress,
      rpcUrl: chainInfo?.endPoint,
      account: account,
    });

    const balance = await getELFChainBalance(contract, symbol, wallet?.[assetInfo?.chainId]?.caAddress || '');

    return balance;
  };

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
    [nextStep, t],
  );

  // const showCrossChainTips = () => {
  //   CrossChainTransferModal.alert({});
  // };

  //when finish send  upDate balance

  const checkCanNext = useCallback(() => {
    const errorArr = [];
    if (!isAddress(selectedToContact.address)) errorArr.push(ErrorMessage.RecipientAddressIsInvalid);
    setErrorMessage(errorArr);
    if (errorArr.length) return false;

    // TODO: check if  cross chain
    if (isCrossChain(selectedToContact.address, assetInfo.chainId)) {
      showDialog('crossChain');
      return true;
    }

    return true;
  }, [assetInfo.chainId, selectedToContact.address, showDialog]);

  /**
   * elf:   elf balance \  elf sendNumber \elf fee
   * not elf：  not elf balance \  not elf sendNumber \ elf balance \ elf fee
   */

  const checkCanPreview = async () => {
    setErrorMessage([]);

    const sendBigNumber = timesDecimals(sendNumber, selectedAssets.decimals || '0');
    const assetBalanceBigNumber = ZERO.plus(selectedAssets.balance);

    // input check
    if (sendType === 'token') {
      // token
      if (assetInfo.symbol === 'ELF') {
        // ELF
        if (sendBigNumber.isGreaterThanOrEqualTo(assetBalanceBigNumber)) {
          setErrorMessage([ErrorMessage.InsufficientFunds]);
          return false;
        }
      } else {
        //Other Token
        if (sendBigNumber.isGreaterThan(assetBalanceBigNumber)) {
          setErrorMessage([ErrorMessage.InsufficientFunds]);
          return false;
        }
      }
    } else {
      // nft
      if (sendBigNumber.isGreaterThan(assetBalanceBigNumber)) {
        setErrorMessage([ErrorMessage.InsufficientQuantity]);
        return false;
      }
    }

    // transaction fee check
    try {
      const fee = await getTransactionFee();
      setTransactionFee(fee || '0');
    } catch (err: { code: number }) {
      if (err?.code === 500) {
        setErrorMessage([ErrorMessage.InsufficientFundsForTransactionFee]);
        return false;
      }
    }

    return true;
  };

  const nextStep = useCallback(
    (directNext?: boolean) => {
      // directNext true , is cross chain and has finished check
      if (directNext) {
        return setStep(2);
      }

      if (!checkCanNext()) return;
      setStep(2);
    },
    [checkCanNext],
  );

  const preview = async () => {
    // TODO : getTransactionFee and check the balance

    if (!(await checkCanPreview())) return;

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

  // get the target token balance
  useEffectOnce(() => {
    (async () => {
      const balance = await getAssetBalance(assetInfo.tokenContractAddress, assetInfo.symbol);
      setSelectedAssets({ ...selectedAssets, balance });
    })();
  });

  return (
    <PageContainer
      safeAreaColor={['blue', step === 1 ? 'white' : 'gray']}
      titleDom={`${t('Send')}${sendType === 'token' ? ' ' + assetInfo.symbol : ''}`}
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
            balanceShow={selectedAssets.balance}
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

      {/* Group 3 contact */}
      <View style={styles.space} />
      {step === 1 && (
        <SelectContact
          chainId={assetInfo.chainId}
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
