import { defaultColors } from 'assets/theme';
import React from 'react';
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

enum TabType {
  BUY,
  SELL,
}

export default function BuyHome() {
  const { t } = useLanguage();

  return (
    <PageContainer
      safeAreaColor={['blue', 'white']}
      titleDom={t('Buy ELF')}
      containerStyles={styles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <View>
        <View style={styles.amountContainer}>
          <View style={styles.primaryWrap}>
            <Text style={styles.primaryAmount}>500</Text>
            <TextM style={styles.primaryUnit}>USD</TextM>
          </View>
          <TextM style={FontStyles.font3}>I will receive 1735 ELF</TextM>
        </View>

        <TextS style={GStyles.marginLeft(8)}>Service provider</TextS>
        <View style={styles.paymentWrap}>
          <View style={[GStyles.flexRow, GStyles.spaceBetween, GStyles.itemCenter, GStyles.marginBottom(24)]}>
            <Image resizeMode="contain" source={achImg} style={styles.achImgStyle} />
            <TextM style={FontStyles.font3}>1 ELF ≈ 0.2874 USD</TextM>
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
        <CommonButton type="primary">Go to AlchemyPay</CommonButton>
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
