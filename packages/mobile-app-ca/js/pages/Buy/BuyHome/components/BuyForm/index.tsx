import { defaultColors } from 'assets/theme';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import { fetchOrderQuote, getCryptoInfo } from '@portkey-wallet/api/api-did/payment/util';
import CommonToast from 'components/CommonToast';
import { ErrorType } from 'types/common';
import { INIT_HAS_ERROR, INIT_NONE_ERROR } from 'constants/common';

const list = [
  {
    symbol: 'ELF',
    name: 'ELF',
    chainId: 'AELF' as ChainId,
  },
];

const MAX_REFRESH_TIME = 12;
interface LimitType {
  min: number;
  max: number;
}

export default function BuyForm() {
  const { t } = useLanguage();
  const { buyFiatList } = usePayment();
  const [fiat, setFiat] = useState<FiatType | undefined>(
    buyFiatList.find(item => item.currency === 'USD' && item.country === 'US'),
  );
  const [token, setToken] = useState<any>(list[0]);
  const [amount, setAmount] = useState<string>('100');
  const [amountError, setAmountError] = useState<ErrorType>(INIT_NONE_ERROR);
  const [receiveAmount, setReceiveAmount] = useState<string>('');

  const rateRefreshTimeRef = useRef(MAX_REFRESH_TIME);
  const [rateRefreshTime, setRateRefreshTime] = useState<number>(MAX_REFRESH_TIME);
  const limitAmountRef = useRef<LimitType>();

  const setLimitAmount = useCallback(async () => {
    limitAmountRef.current = undefined;
    if (fiat === undefined || token === undefined) return;
    try {
      const rst = await getCryptoInfo(
        {
          fiat: fiat.currency,
        },
        token.symbol,
        token.chainId,
      );
      console.log('rst', rst);
      if (rst && rst.maxPurchaseAmount !== null && rst.minPurchaseAmount !== null) {
        limitAmountRef.current = {
          min: rst.minPurchaseAmount,
          max: rst.maxPurchaseAmount,
        };
      }
    } catch (error) {
      console.log(error);
    }
  }, [fiat, token]);

  // useEffectOnce(() => {
  //   const defaultFiat = buyFiatList.find(item => item.currency === 'USD' && item.country === 'US');
  //   if (defaultFiat) {
  //     setFiat(defaultFiat);
  //   }
  //   setToken(list[0]);
  // });

  const refreshReceive = useCallback(async () => {
    if (fiat === undefined || token === undefined) return;
    const reg = /^\d+(\.\d+)?$/;
    if (amount === '' || !reg.test(amount)) {
      setReceiveAmount('');
      return;
    }

    try {
      const rst = await fetchOrderQuote({
        crypto: token.symbol,
        network: token.chainId,
        fiat: fiat.currency,
        country: fiat.country,
        amount,
        side: 'BUY',
      } as any);
      console.log('rst', rst);
      // TODO: setReceiveAmount
    } catch (error) {
      console.log('error');
      CommonToast.failError(error);
    }
  }, [amount, fiat, token]);

  const refreshRate = useCallback(async () => {
    if (fiat === undefined || token === undefined) return;

    try {
      const rst = await fetchOrderQuote({
        crypto: token.symbol,
        network: token.chainId,
        fiat: fiat.currency,
        country: fiat.country,
        amount: '1',
        side: 'BUY',
      } as any);
      console.log('refreshRate:rst', rst);
    } catch (error) {
      console.log('error');
      CommonToast.failError(error);
    }
  }, [fiat, token]);

  useEffectOnce(() => {
    refreshRate();
    const timer = setInterval(() => {
      rateRefreshTimeRef.current = --rateRefreshTimeRef.current;
      if (rateRefreshTimeRef.current === 0) {
        refreshRate();
        refreshReceive();
        rateRefreshTimeRef.current = MAX_REFRESH_TIME;
      }
      setRateRefreshTime(rateRefreshTimeRef.current);
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  });

  useEffect(() => {
    setLimitAmount();
  }, [setLimitAmount]);

  useEffect(() => {
    refreshReceive();
  }, [refreshReceive]);

  const onAmountInput = useCallback((text: string) => {
    setAmountError(INIT_NONE_ERROR);
    const reg = /^(0|[1-9]\d*)(\.\d*)?$/;

    if (text === '') {
      setAmount('');
      return;
    }
    if (!reg.test(text)) return;
    setAmount(text);
  }, []);

  const isAllowNext = useMemo(() => {
    const reg = /^\d+(\.\d+)?$/;
    if (amount === '' || !reg.test(amount)) return false;
    return true;
  }, [amount]);

  const onNext = useCallback(() => {
    if (limitAmountRef.current === undefined) return;
    const amountNum = Number(amount);
    const { min, max } = limitAmountRef.current;
    if (amountNum < min || amountNum > max) {
      setAmountError({
        ...INIT_HAS_ERROR,
        errorMsg: `Limit Amount ${min}-${max} ${fiat?.currency}`,
      });
      return;
    }
    navigationService.navigate('BuyPreview');
  }, [amount, fiat?.currency]);

  return (
    <View style={styles.formContainer}>
      <View>
        <CommonInput
          label={'I want to pay'}
          inputContainerStyle={styles.inputContainerStyle}
          value={amount}
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
          onChangeText={onAmountInput}
          errorMessage={amountError.isError ? amountError.errorMsg : ''}
          // placeholder={t('Enter Phone Number')}
        />

        <CommonInput
          label={'I will receive≈'}
          inputContainerStyle={styles.inputContainerStyle}
          disabled
          value={receiveAmount}
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

      <CommonButton type="primary" disabled={!isAllowNext} onPress={onNext}>
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
