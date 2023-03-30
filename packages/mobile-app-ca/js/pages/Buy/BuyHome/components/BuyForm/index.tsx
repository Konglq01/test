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
import { INIT_BUY_AMOUNT, MAX_REFRESH_TIME, tokenList } from 'pages/Buy/constants';
import Loading from 'components/Loading';

export default function BuyForm() {
  const { t } = useLanguage();
  const { buyFiatList: fiatList } = usePayment();
  const [fiat, setFiat] = useState<FiatType | undefined>(
    fiatList.find(item => item.currency === 'USD' && item.country === 'US'),
  );
  const [token, setToken] = useState<any>(tokenList[0]);
  const [amount, setAmount] = useState<string>(INIT_BUY_AMOUNT);
  const [amountError, setAmountError] = useState<ErrorType>(INIT_NONE_ERROR);
  const [receiveAmount, setReceiveAmount] = useState<string>('');
  const [rate, setRate] = useState<string>('');

  const rateRefreshTimeRef = useRef(MAX_REFRESH_TIME);
  const [rateRefreshTime, setRateRefreshTime] = useState<number>(MAX_REFRESH_TIME);
  const limitAmountRef = useRef<LimitType>();
  const refreshReceiveRef = useRef<() => void>();
  const cryptoListRef = useRef<CryptoInfoType[]>();
  const refreshReceiveTimerRef = useRef<NodeJS.Timer>();
  const isRefreshReceiveValid = useRef<boolean>(false);

  const isAllowAmount = useMemo(() => {
    const reg = /^\d+(\.\d+)?$/;
    if (amount === '' || !reg.test(amount)) return false;
    return true;
  }, [amount]);

  const registerRefreshReceive = useCallback(() => {
    rateRefreshTimeRef.current = MAX_REFRESH_TIME;
    setRateRefreshTime(MAX_REFRESH_TIME);
    const timer = setInterval(() => {
      rateRefreshTimeRef.current = --rateRefreshTimeRef.current;
      if (rateRefreshTimeRef.current === 0) {
        refreshReceiveRef.current?.();
        rateRefreshTimeRef.current = MAX_REFRESH_TIME;
      }
      setRateRefreshTime(rateRefreshTimeRef.current);
    }, 1000);

    refreshReceiveTimerRef.current = timer;
  }, []);

  const refreshReceive = useCallback(
    async (isInit = false) => {
      if (fiat === undefined || token === undefined || limitAmountRef.current === undefined || !isAllowAmount) return;

      const { min, max } = limitAmountRef.current;
      const amountNum = Number(amount);

      if (amountNum < min || amountNum > max) {
        setAmountError({
          ...INIT_HAS_ERROR,
          errorMsg: `Limit Amount ${min}-${max} ${fiat?.currency}`,
        });
        setRate('');
        setReceiveAmount('');
        clearInterval(refreshReceiveTimerRef.current);
        return;
      }

      try {
        const rst = await fetchOrderQuote({
          crypto: token.crypto,
          network: token.network,
          fiat: fiat.currency,
          country: fiat.country,
          amount,
          side: 'BUY',
        });
        if (isInit) {
          clearInterval(refreshReceiveTimerRef.current);
          registerRefreshReceive();
        }

        isRefreshReceiveValid.current = true;
        const _rate = (1 / Number(rst.cryptoPrice)).toFixed(2) + '';
        const _receiveAmount = rst.cryptoQuantity;
        setRate(_rate);
        setReceiveAmount(_receiveAmount);
        return {
          rate: _rate,
          receiveAmount: _receiveAmount,
        };
      } catch (error) {
        if (isInit) clearInterval(refreshReceiveTimerRef.current);
        console.log('error', error);
        CommonToast.failError(error);
      }
    },
    [amount, fiat, isAllowAmount, registerRefreshReceive, token],
  );
  refreshReceiveRef.current = refreshReceive;

  useEffectOnce(() => {
    registerRefreshReceive();
    return () => {
      clearInterval(refreshReceiveTimerRef.current);
    };
  });

  const onAmountInput = useCallback((text: string) => {
    isRefreshReceiveValid.current = false;
    setAmountError(INIT_NONE_ERROR);
    const reg = /^(0|[1-9]\d*)(\.\d*)?$/;

    if (text === '') {
      setAmount('');
      return;
    }
    if (!reg.test(text)) return;
    setAmount(text);
  }, []);

  const onNext = useCallback(async () => {
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
    let _rate = rate,
      _receiveAmount = receiveAmount;

    if (isRefreshReceiveValid.current === false) {
      Loading.show();
      const rst = await refreshReceive();
      Loading.hide();
      if (rst === undefined) return;
      _rate = rst.rate;
      _receiveAmount = rst.receiveAmount;
    }
    navigationService.navigate('BuyPreview', {
      amount,
      fiat,
      token,
      type: TypeEnum.BUY,
      receiveAmount: _receiveAmount,
      rate: _rate,
    });
  }, [amount, fiat, rate, receiveAmount, refreshReceive, token]);

  const onAmountBlur = useCallback(() => {
    refreshReceive(true);
  }, [refreshReceive]);

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

    limitAmountRef.current = {
      min: cryptoInfo.minPurchaseAmount,
      max: cryptoInfo.maxPurchaseAmount,
    };
  }, [fiat, token]);

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
                  list: fiatList,
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

        {rate !== '' && (
          <View style={styles.rateWrap}>
            <TextM style={[GStyles.flex1, FontStyles.font3]}>{`1 ${token?.crypto} ≈ ${rate} ${fiat?.currency}`}</TextM>
            <View style={[GStyles.flexRow, GStyles.alignCenter]}>
              <Svg size={16} icon="time" />
              <TextS style={styles.refreshLabel}>{rateRefreshTime}s</TextS>
            </View>
          </View>
        )}
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
