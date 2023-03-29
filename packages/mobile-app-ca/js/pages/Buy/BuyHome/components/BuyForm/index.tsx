import { defaultColors } from 'assets/theme';
import React, { useCallback, useRef, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { pTd } from 'utils/unit';
import { useLanguage } from 'i18n/hooks';
import GStyles from 'assets/theme/GStyles';
import { TextL, TextM, TextS } from 'components/CommonText';

import CommonInput from 'components/CommonInput';
import Touchable from 'components/Touchable';
import Svg from 'components/Svg';
import fonts from 'assets/theme/fonts';
import SelectToken from '../SelectToken';
import { ChainId } from '@portkey-wallet/types';
import { usePayment } from 'hooks/store';
import SelectCurrency from '../SelectCurrency';
import { FiatType } from '@portkey-wallet/store/store-ca/payment/type';
import useEffectOnce from 'hooks/useEffectOnce';
import { FontStyles } from 'assets/theme/styles';
import CommonButton from 'components/CommonButton';
import navigationService from 'utils/navigationService';
import { countryCodeMap } from '@portkey-wallet/constants/constants-ca/payment';
import { fetchOrderQuote } from '@portkey-wallet/api/api-did/payment/util';

const list = [
  {
    symbol: 'ELF',
    name: 'ELF',
    chainId: 'AELF' as ChainId,
  },
];

export default function BuyForm() {
  const { t } = useLanguage();
  const { buyFiatList } = usePayment();
  const [fiat, setFiat] = useState<FiatType>();
  const [token, setToken] = useState<any>();

  const rateRefreshTimeRef = useRef(12);
  const [rateRefreshTime, setRateRefreshTime] = useState<number>(12);

  const refreshRate = useCallback(() => {
    try {
      // const rst = fetchOrderQuote({});
    } catch (error) {
      //
    }
  }, []);

  useEffectOnce(() => {
    refreshRate();
    const timer = setInterval(() => {
      rateRefreshTimeRef.current = --rateRefreshTimeRef.current;
      if (rateRefreshTimeRef.current === 0) {
        refreshRate();
        rateRefreshTimeRef.current = 12;
      }
      setRateRefreshTime(rateRefreshTimeRef.current);
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  });

  useEffectOnce(() => {
    const defaultFiat = buyFiatList.find(item => item.currency === 'USD' && item.country === 'US');
    if (defaultFiat) {
      setFiat(defaultFiat);
    }
    setToken(list[0]);
  });

  return (
    <View style={styles.formContainer}>
      <View>
        <CommonInput
          label={'I want to pay'}
          inputContainerStyle={styles.inputContainerStyle}
          rightIcon={
            <Touchable
              style={styles.unitWrap}
              onPress={() => {
                SelectCurrency.showList({
                  value: `${fiat?.country}_${fiat?.currency}`,
                  list: buyFiatList,
                  callBack: setFiat,
                });
              }}>
              <Image style={styles.unitIconStyle} source={{ uri: countryCodeMap[fiat?.country || '']?.icon || '' }} />
              <TextL style={[GStyles.flex1, fonts.mediumFont]}>{fiat?.currency}</TextL>
              <Svg size={16} icon="down-arrow" color={defaultColors.icon1} />
            </Touchable>
          }
          type="general"
          maxLength={30}
          autoCorrect={false}
          keyboardType="decimal-pad"
          // placeholder={t('Enter Phone Number')}
        />

        <CommonInput
          label={'I will receive≈'}
          inputContainerStyle={styles.inputContainerStyle}
          rightIcon={
            <Touchable
              style={styles.unitWrap}
              onPress={() => {
                SelectToken.showList({
                  value: `${token.chainId} ${token.symbol}`,
                  list,
                  callBack: setToken,
                });
              }}>
              <Svg size={24} icon="elf-icon" iconStyle={styles.unitIconStyle} />
              <TextL style={[GStyles.flex1, fonts.mediumFont]}>ELF</TextL>
              <Svg size={16} icon="down-arrow" color={defaultColors.icon1} />
            </Touchable>
          }
          type="general"
          maxLength={30}
          autoCorrect={false}
          keyboardType="decimal-pad"
          // placeholder={t('Enter Phone Number')}
        />

        <View style={styles.rateWrap}>
          <TextM style={[GStyles.flex1, FontStyles.font3]}>1 ELF ≈ 0.2874 USD</TextM>
          <View style={[GStyles.flexRow, GStyles.alignCenter]}>
            <Svg size={16} icon="time" />
            <TextS style={styles.refreshLabel}>{rateRefreshTime}s</TextS>
          </View>
        </View>
      </View>

      <CommonButton
        type="primary"
        onPress={() => {
          navigationService.navigate('BuyPreview');
        }}>
        Next
      </CommonButton>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    height: '100%',
    justifyContent: 'space-between',
  },
  inputContainerStyle: {
    height: pTd(64),
  },
  unitWrap: {
    width: pTd(112),
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftColor: defaultColors.border6,
    borderLeftWidth: StyleSheet.hairlineWidth,
    paddingLeft: pTd(12),
  },
  unitIconStyle: {
    width: pTd(24),
    height: pTd(24),
    marginRight: pTd(8),
  },
  rateWrap: {
    flexDirection: 'row',
    paddingHorizontal: pTd(8),
  },
  refreshLabel: {
    marginLeft: pTd(4),
    color: defaultColors.font3,
  },
});
