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
import { usePayment } from 'hooks/store';
import SelectCurrency from '../SelectCurrency';
import { FiatType } from '@portkey-wallet/store/store-ca/payment/type';
import useEffectOnce from 'hooks/useEffectOnce';
import { FontStyles } from 'assets/theme/styles';
import CommonButton from 'components/CommonButton';
import navigationService from 'utils/navigationService';
import { countryCodeMap } from '@portkey-wallet/constants/constants-ca/payment';
import { fetchOrderQuote, getCryptoList } from '@portkey-wallet/api/api-did/payment/util';
import CommonToast from 'components/CommonToast';
import { ErrorType } from 'types/common';
import { INIT_HAS_ERROR, INIT_NONE_ERROR } from 'constants/common';
import { CryptoInfoType } from '@portkey-wallet/api/api-did/payment/type';
import { LimitType, TypeEnum } from 'pages/Buy/types';
import { tokenList } from 'pages/Buy/constants';

const MAX_REFRESH_TIME = 12;

export default function BuyForm() {
  const { t } = useLanguage();
  const { buyFiatList } = usePayment();
  const [fiat, setFiat] = useState<FiatType | undefined>(
    buyFiatList.find(item => item.currency === 'USD' && item.country === 'US'),
  );
  const [token, setToken] = useState<any>(tokenList[0]);
  const [amount, setAmount] = useState<string>('100');
  const [amountError, setAmountError] = useState<ErrorType>(INIT_NONE_ERROR);
  const [receiveAmount, setReceiveAmount] = useState<string>('');
  const [rate, setRate] = useState<string>('');

  const rateRefreshTimeRef = useRef(MAX_REFRESH_TIME);
  const [rateRefreshTime, setRateRefreshTime] = useState<number>(MAX_REFRESH_TIME);
  const limitAmountRef = useRef<LimitType>();
  const refreshReceiveRef = useRef<() => void>();
  const cryptoListRef = useRef<CryptoInfoType[]>();

  const setLimitAmount = useCallback(async () => {
    limitAmountRef.current = undefined;

    if (fiat === undefined) return;
    if (cryptoListRef.current === undefined) {
      try {
        const rst = await getCryptoList({ fiat: fiat.currency });
        cryptoListRef.current = rst;
      } catch (error) {
        console.log(error);
      }
    }
    if (token === undefined || cryptoListRef.current === undefined) return;
    const cryptoInfo = cryptoListRef.current.find(
      item => item.crypto === token.crypto && item.network === token.network,
    );

    if (cryptoInfo === undefined || cryptoInfo.minPurchaseAmount === null || cryptoInfo.maxPurchaseAmount === null)
      return;

    console.log('cryptoInfo', cryptoInfo);
    limitAmountRef.current = {
      min: cryptoInfo.minPurchaseAmount,
      max: cryptoInfo.maxPurchaseAmount,
    };
  }, [fiat, token]);

  const isAllowAmount = useMemo(() => {
    const reg = /^\d+(\.\d+)?$/;
    if (amount === '' || !reg.test(amount)) return false;
    return true;
  }, [amount]);

  const refreshReceive = useCallback(async () => {
    if (fiat === undefined || token === undefined || limitAmountRef.current === undefined || !isAllowAmount) return;

    const { min, max } = limitAmountRef.current;
    const amountNum = Number(amount);
    let _amount = amount;
    let isOnlySetRate = false;

    if (amountNum < min || amountNum > max) {
      setAmountError({
        ...INIT_HAS_ERROR,
        errorMsg: `Limit Amount ${min}-${max} ${fiat?.currency}`,
      });
      setReceiveAmount('');
      isOnlySetRate = true;
      _amount = min + '';
    }

    try {
      const rst = await fetchOrderQuote({
        crypto: token.crypto,
        network: token.network,
        fiat: fiat.currency,
        country: fiat.country,
        amount: _amount,
        side: 'BUY',
      });

      setRate((1 / Number(rst.cryptoPrice)).toFixed(2) + '');
      if (!isOnlySetRate) setReceiveAmount(rst.cryptoQuantity);
    } catch (error) {
      console.log('error', error);
      CommonToast.failError(error);
    }
  }, [amount, fiat, isAllowAmount, token]);
  refreshReceiveRef.current = refreshReceive;

  useEffectOnce(() => {
    const timer = setInterval(() => {
      rateRefreshTimeRef.current = --rateRefreshTimeRef.current;
      if (rateRefreshTimeRef.current === 0) {
        refreshReceiveRef.current?.();
        rateRefreshTimeRef.current = MAX_REFRESH_TIME;
      }
      setRateRefreshTime(rateRefreshTimeRef.current);
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  });

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
    navigationService.navigate('BuyPreview', {
      amount,
      fiat,
      token,
      type: TypeEnum.BUY,
      receiveAmount,
      rate,
    });
  }, [amount, fiat, rate, receiveAmount, token]);

  const onAmountBlur = useCallback(() => {
    refreshReceive();
  }, [refreshReceive]);

  const onChooseChange = useCallback(async () => {
    await setLimitAmount();
    refreshReceiveRef.current?.();
  }, [setLimitAmount]);

  useEffect(() => {
    // only fiat||token change will trigger
    onChooseChange();
  }, [onChooseChange]);

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
          onBlur={onAmountBlur}
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
                  value: `${token.network}_${token.crypto}`,
                  list: tokenList,
                  callBack: setToken,
                });
              }}>
              <Svg size={24} icon="elf-icon" iconStyle={styles.unitIconStyle} />
              <TextL style={[GStyles.flex1, fonts.mediumFont]}>{token.crypto}</TextL>
              <Svg size={16} icon="down-arrow" color={defaultColors.icon1} />
            </Touchable>
          }
          type="general"
          maxLength={30}
          autoCorrect={false}
          keyboardType="decimal-pad"
          placeholder=" "
        />

        <View style={styles.rateWrap}>
          <TextM style={[GStyles.flex1, FontStyles.font3]}>
            {rate === '' ? '' : `1 ${token?.crypto} ≈ ${rate} ${fiat?.currency}`}
          </TextM>
          <View style={[GStyles.flexRow, GStyles.alignCenter]}>
            <Svg size={16} icon="time" />
            <TextS style={styles.refreshLabel}>{rateRefreshTime}s</TextS>
          </View>
        </View>
      </View>

      <CommonButton type="primary" disabled={!isAllowAmount} onPress={onNext}>
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
