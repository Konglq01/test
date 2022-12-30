import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TextL, TextS } from 'components/CommonText';
import PageContainer from 'components/PageContainer';
import CommonButton from 'components/CommonButton';
import { setSecureStoreItem } from '@portkey/utils/mobile/biometric';
import useRouterParams from '@portkey/hooks/useRouterParams';
import { Image, StyleSheet } from 'react-native';
import GStyles from 'assets/theme/GStyles';
import { defaultColors } from 'assets/theme';
import { BGStyles } from 'assets/theme/styles';
import navigationService from 'utils/navigationService';
import Touchable from 'components/Touchable';
import { useAppDispatch } from 'store/hooks';
import { setBiometrics } from 'store/user/actions';
import { usePreventHardwareBack } from '@portkey/hooks/mobile';
import biometric from 'assets/image/pngs/biometric.png';
import { pTd } from 'utils/unit';
import { useCurrentWallet } from '@portkey/hooks/hooks-ca/wallet';
import { useCurrentNetworkInfo } from '@portkey/hooks/hooks-ca/network';
import { intervalGetRegisterResult, TimerResult } from 'utils/wallet';
import { CAInfo } from '@portkey/types/types-ca/wallet';
import Loading from 'components/Loading';
import { setCAInfo } from '@portkey/store/store-ca/wallet/actions';
import { DefaultChainId } from '@portkey/constants/constants-ca/network';
const ScrollViewProps = { disabled: true };
export default function SetBiometrics() {
  usePreventHardwareBack();
  const dispatch = useAppDispatch();
  const timer = useRef<TimerResult>();
  const { pin } = useRouterParams<{ pin?: string }>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const { walletInfo } = useCurrentWallet();
  const { apiUrl } = useCurrentNetworkInfo();
  const [caInfo, setStateCAInfo] = useState<CAInfo>();
  const isSyncCAInfo = useMemo(
    () => walletInfo.address && walletInfo.managerInfo && !walletInfo.AELF?.caAddress,
    [walletInfo.AELF?.caAddress, walletInfo.address, walletInfo.managerInfo],
  );
  useEffect(() => {
    if (isSyncCAInfo) {
      setTimeout(() => {
        if (walletInfo.managerInfo && apiUrl)
          timer.current = intervalGetRegisterResult({
            apiUrl,
            managerInfo: walletInfo.managerInfo,
            onPass: setStateCAInfo,
          });
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSyncCAInfo]);
  const openBiometrics = useCallback(async () => {
    if (!pin) return;
    try {
      await setSecureStoreItem('Pin', pin);
      dispatch(setBiometrics(true));
      if (isSyncCAInfo && !caInfo && walletInfo.managerInfo) {
        timer.current?.remove();
        Loading.show('loading...');
        timer.current = intervalGetRegisterResult({
          apiUrl,
          managerInfo: walletInfo.managerInfo,
          onPass: (info: CAInfo) => {
            dispatch(
              setCAInfo({
                caInfo: info,
                pin,
                chainId: DefaultChainId,
              }),
            );
            Loading.hide();
            navigationService.reset('Tab');
          },
        });
        return;
      } else if (caInfo) {
        dispatch(
          setCAInfo({
            caInfo,
            pin,
            chainId: DefaultChainId,
          }),
        );
        navigationService.reset('Tab');
      }
    } catch (error: any) {
      setErrorMessage(typeof error.message === 'string' ? error.message : 'Verification failed');
    }
  }, [apiUrl, caInfo, dispatch, isSyncCAInfo, pin, walletInfo.managerInfo]);
  return (
    <PageContainer scrollViewProps={ScrollViewProps} leftDom titleDom containerStyles={styles.containerStyles}>
      <Touchable style={GStyles.itemCenter} onPress={openBiometrics}>
        <Image resizeMode="contain" source={biometric} style={styles.biometricIcon} />
        <TextL style={styles.tipText}>Biometric for quick access</TextL>
        {errorMessage ? <TextS style={styles.errorText}>{errorMessage}</TextS> : null}
      </Touchable>
      <CommonButton
        type="clear"
        title="Skip"
        buttonStyle={BGStyles.transparent}
        onPress={() => navigationService.navigate('Tab')}
      />
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  containerStyles: {
    justifyContent: 'space-between',
    paddingBottom: 52,
    paddingTop: '25%',
    alignItems: 'center',
  },
  tipText: {
    marginTop: -38,
  },
  errorText: {
    marginTop: 16,
    color: defaultColors.error,
  },
  biometricIcon: {
    width: pTd(124),
  },
});
