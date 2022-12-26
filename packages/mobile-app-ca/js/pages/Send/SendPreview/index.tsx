import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import PageContainer from 'components/PageContainer';
import navigationService from 'utils/navigationService';
import { useFocusEffect } from '@react-navigation/native';
import { useAppCASelector } from '@portkey/hooks/hooks-ca';
import CommonToast from 'components/CommonToast';
// import { divDecimals, timesDecimals } from '@portkey/utils/converter';

import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import { TextM, TextS, TextL } from 'components/CommonText';
import CommonButton from 'components/CommonButton';
import ActionSheet from 'components/ActionSheet';
import useQrScanPermission from 'hooks/useQrScanPermission';
// import CrossChainTransferModal from '../components/CrossChainTransferModal';
import { ZERO } from '@portkey/constants/misc';
import { useGetELFRateQuery } from '@portkey/store/rate/api';
// import { ContractBasic } from 'utils/contract';
import useEffectOnce from 'hooks/useEffectOnce';
import { formatAddress2NoPrefix, formatStr2EllipsisStr } from 'utils';
import { addRecentContact } from '@portkey/store/store-ca/recent/slice';
import { isAelfAddress } from '@portkey/utils/aelf';
import { updateBalance } from '@portkey/store/tokenBalance/slice';
import { useLanguage } from 'i18n/hooks';
import { useAppCommonDispatch } from '@portkey/hooks';
import GStyles from 'assets/theme/GStyles';
import fonts from 'assets/theme/fonts';
import { Image, ScreenHeight } from '@rneui/base';

export interface SendHomeProps {
  route?: any;
}

const SendHome: React.FC<SendHomeProps> = props => {
  const { t } = useLanguage();
  const { route } = props;
  const { params } = route;
  const { sendType } = params;
  const tokenItem = {
    symbol: 'ELF',
    address: 'xxx',
    decimal: 8,
    decimals: 8,
  };

  const dispatch = useAppCommonDispatch();

  const [isLoading] = useState(false);

  // TODO
  // const totalPay = useMemo(() => {
  //   // TODO: TransferNumber + Transaction Fee
  //   const totalTransactionFee = ZERO.plus(transactionFee).times(data?.USDT || 0);
  //   const totalTransferNumber =
  //     selectedToken.symbol === 'ELF' ? ZERO.plus(sendTokenNumber).times(data?.USDT || 0) : ZERO;
  //   console.log(totalTransactionFee.valueOf(), totalTransferNumber.valueOf());

  //   return totalTransactionFee.plus(totalTransferNumber);
  // }, [data?.USDT, selectedToken, sendTokenNumber, transactionFee]);

  // const showCrossChainTips = () => {
  //   CrossChainTransferModal.alert({});
  // };

  //  TODO: when finish send upDate balance

  const transfer = async () => {
    // TODO
    CommonToast.success(t('Transfer Successful'));
    navigationService.navigate('DashBoard');

    return;

    // try {
    //   const tmpAccount = getCurrentAccount(credentials?.pin || '', selectedFromAccount);
    //   if (!tmpAccount) return;
    //   setIsLoading(true);
    //   const getContractParams = {
    //     rpcUrl: currentChain?.rpcUrl,
    //     contractAddress:
    //       currentChain.basicContracts?.tokenContract || 'JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE',
    //     account: tmpAccount,
    //   };

    //   const elfContract = await getELFContract(getContractParams);
    //   console.log('elfContract', elfContract);
    //   const accountBalance = await elfContract?.callViewMethod('GetBalance', {
    //     symbol: 'ELF',
    //     owner: tmpAccount.address,
    //   });
    //   console.log('accountBalance', accountBalance);

    //   const paramsOption = {
    //     symbol: selectedToken?.symbol,
    //     memo: '',
    //     to: formatAddress2NoPrefix(selectedToContact.address),
    //     amount: timesDecimals(sendTokenNumber, selectedToken?.decimals ?? 8).toFixed(),
    //   };
    //   console.log('paramsOption', paramsOption);

    //   const result = await elfContract?.callSendMethod('Transfer', '', paramsOption);
    //   console.log('result', result);
    //   if (result.error) {
    //     setIsLoading(false);
    //     return CommonToast.fail(result.error.message);
    //   } else {
    //     // success
    //     console.log(result.TransactionId);
    //     setIsLoading(false);
    //     CommonToast.success(t('Transfer Successful'));
    //     upDateBalance();
    //     // dispatch(
    //     //   addRecentContact({
    //     //     rpcUrl: currentChain.rpcUrl,
    //     //     contact: {
    //     //       name: selectedToContact.name,
    //     //       address: formatAddress2NoPrefix(selectedToContact.address),
    //     //     },
    //     //   }),
    //     // );

    //     navigationService.goBack();
    //   }

    //   setIsLoading(false);
    // } catch (error) {
    //   console.log(error);
    //   CommonToast.fail('Please Try Again Later');
    //   setIsLoading(false);
    // }
  };

  const mockUrl =
    'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/fotojet-5-1650369753.jpg?crop=0.498xw:0.997xh;0,0&resize=640:*';

  return (
    <PageContainer
      safeAreaColor={['blue', 'white']}
      titleDom={t('Send')}
      containerStyles={styles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      {sendType === 'nft' ? (
        <View style={styles.topWrap}>
          {/* <Text style={styles.noImg}>A</Text> */}
          <Image style={styles.img} source={{ uri: mockUrl }} />
          <View style={styles.topLeft}>
            <TextL style={styles.nftTitle}>BoxcatPlanet #2271</TextL>
            <TextS>Amount：3</TextS>
          </View>
        </View>
      ) : (
        <>
          <Text style={styles.tokenCount}>-12.2 ELF</Text>
          <TextM style={styles.tokenUSD}>-$ 0.1</TextM>
        </>
      )}

      <View style={styles.card}>
        {/* From */}
        <View style={styles.section}>
          <View style={[styles.flexSpaceBetween]}>
            <TextM style={styles.lightGrayFontColor}>{t('From')}</TextM>
            <TextM style={styles.blackFontColor}>{'Wallet1'}</TextM>
          </View>
          <View style={[styles.flexSpaceBetween]}>
            <TextM style={styles.lightGrayFontColor} />
            <TextS style={styles.lightGrayFontColor}>
              {formatStr2EllipsisStr('ELF_xsasadsadsaddasd_xasxasdsadsad_AELF')}
            </TextS>
          </View>
        </View>
        <Text style={[styles.divider, styles.marginTop0]} />
        {/* To */}
        <View style={styles.section}>
          <View style={[styles.flexSpaceBetween]}>
            <TextM style={[styles.blackFontColor]}>{t('To')}</TextM>
            <TextM style={[styles.blackFontColor, styles.fontBold]}>{`${'Sally'}`}</TextM>
          </View>
          <View style={[styles.flexSpaceBetween]}>
            <Text />
            <TextS style={styles.lightGrayFontColor}>
              {formatStr2EllipsisStr('ELF_xsasadsadsaddasd_xasxasdsadsad_AELF')}
            </TextS>
          </View>
        </View>
        <Text style={[styles.divider, styles.marginTop0]} />
        {/* more Info */}
        <View style={styles.section}>
          <View style={[styles.flexSpaceBetween]}>
            <TextM style={[styles.blackFontColor]}>{t('Network')}</TextM>
            <TextM
              style={[styles.blackFontColor, styles.fontBold]}>{`${'MainChain AELF'} → ${'MainChain AELF'} `}</TextM>
          </View>
        </View>
        <Text style={[styles.divider, styles.marginTop0]} />
        {/* transaction Fee */}
        <View style={styles.section}>
          <View style={[styles.flexSpaceBetween]}>
            <TextM style={[styles.blackFontColor, styles.fontBold]}>{t('Transaction Fee')}</TextM>
            <TextM style={[styles.blackFontColor, styles.fontBold]}>{`${'0.0001'} ${'ELF'} `}</TextM>
          </View>
          <View style={[styles.flexSpaceBetween, styles.marginTop4]}>
            <Text />
            <TextS style={styles.lightGrayFontColor}>{`$ ${'0.11'}`}</TextS>
          </View>
        </View>
      </View>

      <View style={styles.buttonWrapStyle}>
        <CommonButton loading={isLoading} title={t('Send')} type="primary" onPress={transfer} />
      </View>
    </PageContainer>
  );
};

addRecentContact;

export default memo(SendHome);

export const styles = StyleSheet.create({
  pageWrap: {
    backgroundColor: defaultColors.bg1,
    height: ScreenHeight - pTd(130),
  },
  topWrap: {
    width: '100%',
    marginTop: pTd(40),
    ...GStyles.flexRow,
  },
  img: {
    width: pTd(64),
    height: pTd(64),
    borderRadius: pTd(6),
    marginRight: pTd(16),
  },
  noImg: {
    overflow: 'hidden',
    width: pTd(64),
    height: pTd(64),
    borderRadius: pTd(6),
    backgroundColor: defaultColors.bg7,
    fontSize: pTd(54),
    lineHeight: pTd(64),
    textAlign: 'center',
    color: defaultColors.font7,
    marginRight: pTd(16),
  },
  topLeft: {
    ...GStyles.flexCol,
    justifyContent: 'center',
  },
  nftTitle: {
    color: defaultColors.font5,
    marginBottom: pTd(4),
  },
  tokenCount: {
    marginTop: pTd(60),
    fontSize: pTd(28),
    width: '100%',
    textAlign: 'center',
  },
  tokenUSD: {
    color: defaultColors.font3,
    width: '100%',
    textAlign: 'center',
    marginTop: pTd(4),
  },
  group: {
    backgroundColor: defaultColors.bg1,
    marginTop: pTd(24),
    paddingLeft: pTd(16),
    paddingRight: pTd(16),
    borderRadius: pTd(6),
  },
  buttonWrapStyle: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  errorMessage: {
    lineHeight: pTd(16),
    color: defaultColors.error,
    marginTop: pTd(4),
    paddingLeft: pTd(8),
  },
  wrap: {
    height: pTd(56),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  borderTop: {
    borderTopColor: defaultColors.border6,
    borderTopWidth: pTd(0.5),
  },
  title: {
    flex: 1,
    color: defaultColors.font3,
  },
  tokenNum: {
    textAlign: 'right',
    color: defaultColors.font5,
  },
  usdtNum: {
    marginLeft: pTd(6),
    marginTop: pTd(4),
    color: defaultColors.font3,
    textAlign: 'right',
  },
  notELFWrap: {
    height: pTd(84),
    alignItems: 'flex-start',
    paddingTop: pTd(18),
    paddingBottom: pTd(18),
  },
  totalWithUSD: {
    marginTop: pTd(12),
    display: 'flex',
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  flexSpaceBetween: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: pTd(20),
    width: '100%',
  },
  titles1: {
    marginTop: pTd(56),
  },
  values1: {
    marginTop: pTd(4),
  },
  divider: {
    marginTop: pTd(24),
    width: '100%',
    height: pTd(0.5),
    backgroundColor: defaultColors.border6,
  },
  titles2: {
    marginTop: pTd(25),
  },
  values2: {
    marginTop: pTd(4),
  },
  card: {
    marginTop: pTd(40),
    borderRadius: pTd(6),
    borderWidth: pTd(0.5),
    borderColor: defaultColors.border1,
    width: '100%',
  },
  section: {
    ...GStyles.paddingArg(16, 12),
  },
  marginTop16: {
    marginTop: pTd(16),
  },
  marginTop4: {
    marginTop: pTd(4),
  },
  marginTop0: {
    marginTop: 0,
  },
  marginLeft8: {
    marginLeft: pTd(8),
  },
  space: {
    flex: 1,
  },
  button: {
    marginBottom: pTd(30),
  },
  lightGrayFontColor: {
    color: defaultColors.font3,
  },
  blackFontColor: {
    color: defaultColors.font5,
  },
  fontBold: {
    ...fonts.mediumFont,
  },
  greenFontColor: {
    color: defaultColors.font10,
  },
  alignItemsCenter: {
    alignItems: 'center',
  },
});
