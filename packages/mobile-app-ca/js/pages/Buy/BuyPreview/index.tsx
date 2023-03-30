import { defaultColors } from 'assets/theme';
import React, { useCallback, useRef, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { pTd } from 'utils/unit';
import PageContainer from 'components/PageContainer';
import { useLanguage } from 'i18n/hooks';
import GStyles from 'assets/theme/GStyles';
import { TextM, TextS } from 'components/CommonText';
import fonts from 'assets/theme/fonts';
import { FontStyles } from 'assets/theme/styles';
import CommonButton from 'components/CommonButton';
import achImg from 'assets/image/pngs/ach.png';
import achPaymentImg from 'assets/image/pngs/ach_payment.png';
import ActionSheet from 'components/ActionSheet';
import { CryptoInfoType, TypeEnum } from '../types';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { FiatType } from '@portkey-wallet/store/store-ca/payment/type';
import useEffectOnce from 'hooks/useEffectOnce';
import { MAX_REFRESH_TIME } from '../constants';
import { fetchOrderQuote } from '@portkey-wallet/api/api-did/payment/util';

interface RouterParams {
  type?: TypeEnum;
  token?: CryptoInfoType;
  fiat?: FiatType;
  amount?: string;
  receiveAmount?: string;
  rate?: string;
}

export default function BuyPreview() {
  const {
    type = TypeEnum.BUY,
    token,
    fiat,
    amount,
    receiveAmount: receiveAmountProps,
    rate: rateProps,
  } = useRouterParams<RouterParams>();

  const { t } = useLanguage();

  const [rate, setRate] = useState<string>(rateProps || '');
  const [receiveAmount, setReceiveAmount] = useState<string>(receiveAmountProps || '');

  const refreshReceive = useCallback(async () => {
    if (fiat === undefined || token === undefined || amount === undefined) return;

    try {
      const rst = await fetchOrderQuote({
        crypto: token.crypto,
        network: token.network,
        fiat: fiat.currency,
        country: fiat.country,
        amount,
        side: 'BUY',
      });

      const _rate = (1 / Number(rst.cryptoPrice)).toFixed(2) + '';
      const _receiveAmount = rst.cryptoQuantity;
      setRate(_rate);
      setReceiveAmount(_receiveAmount);
    } catch (error) {
      console.log('error', error);
    }
  }, [amount, fiat, token]);

  const rateRefreshTimeRef = useRef(MAX_REFRESH_TIME);

  useEffectOnce(() => {
    const timer = setInterval(() => {
      rateRefreshTimeRef.current = --rateRefreshTimeRef.current;
      if (rateRefreshTimeRef.current === 0) {
        refreshReceive();
        rateRefreshTimeRef.current = MAX_REFRESH_TIME;
      }
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  });

  return (
    <PageContainer
      safeAreaColor={['blue', 'white']}
      titleDom={t('Buy ELF')}
      containerStyles={styles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <View>
        <View style={styles.amountContainer}>
          <View style={styles.primaryWrap}>
            <Text style={styles.primaryAmount}>{amount}</Text>
            <TextM style={styles.primaryUnit}>{fiat?.currency}</TextM>
          </View>
          <TextM style={FontStyles.font3}>
            I will receive {receiveAmount} {token?.crypto}
          </TextM>
        </View>

        <TextS style={GStyles.marginLeft(8)}>Service provider</TextS>
        <View style={styles.paymentWrap}>
          <View style={[GStyles.flexRow, GStyles.spaceBetween, GStyles.itemCenter, GStyles.marginBottom(24)]}>
            <Image resizeMode="contain" source={achImg} style={styles.achImgStyle} />
            <TextM style={FontStyles.font3}>{`1 ${token?.crypto} ≈ ${rate} ${fiat?.currency}`}</TextM>
          </View>
          <Image resizeMode="contain" source={achPaymentImg} style={styles.achPaymentImgStyle} />
        </View>
      </View>
      <View>
        <TextM style={GStyles.marginBottom(26)}>
          Proceeding with this transaction means that you have read and understood{' '}
          <TextM
            style={FontStyles.font4}
            onPress={() => {
              ActionSheet.alert({
                title: 'Disclaimer',
                title2: (
                  <TextM style={[FontStyles.font3, GStyles.textAlignCenter, GStyles.marginBottom(20)]}>
                    AlchemyPay is a fiat-to-crypto platform independently operated by a third-party entity. Portkey
                    shall not be held liable for any loss or damage suffered as a result of using AlchemyPay service.
                  </TextM>
                ),
                buttons: [{ title: 'OK' }],
              });
            }}>
            the Disclaimer
          </TextM>
          .
        </TextM>
        <CommonButton
          type="primary"
          onPress={() => {
            ActionSheet.alert({
              title2: (
                <TextM style={[GStyles.textAlignCenter]}>
                  On-ramp is not supported on the Testnet. The on-ramp service on Mainnet is coming soon.
                </TextM>
              ),
              buttons: [{ title: 'OK' }],
            });
            return;
          }}>
          Go to AlchemyPay
        </CommonButton>
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  pageWrap: {
    flex: 1,
    backgroundColor: defaultColors.bg1,
    justifyContent: 'space-between',
    ...GStyles.paddingArg(60, 20, 16, 20),
  },
  amountContainer: {
    marginBottom: pTd(60),
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryWrap: {
    marginBottom: pTd(12),
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  primaryAmount: {
    fontSize: pTd(30),
    lineHeight: pTd(34),
    marginRight: pTd(8),
    ...fonts.mediumFont,
  },
  primaryUnit: {
    ...fonts.mediumFont,
    marginBottom: pTd(4),
  },
  paymentWrap: {
    marginTop: pTd(8),
    borderRadius: pTd(6),
    borderColor: defaultColors.border6,
    borderWidth: StyleSheet.hairlineWidth,
    ...GStyles.paddingArg(16, 12),
  },
  achImgStyle: {
    height: pTd(22),
  },
  achPaymentImgStyle: {
    height: pTd(20),
  },
});
