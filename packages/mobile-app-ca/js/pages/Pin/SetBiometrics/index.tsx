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
import { intervalGetResult, onResultFail, TimerResult } from 'utils/wallet';
import { CAInfo } from '@portkey/types/types-ca/wallet';
import Loading from 'components/Loading';
import { setCAInfo } from '@portkey/store/store-ca/wallet/actions';
import { DefaultChainId } from '@portkey/constants/constants-ca/network';
import { handleError } from '@portkey/utils';
import { VerificationType } from '@portkey/types/verifier';
import CommonToast from 'components/CommonToast';
const ScrollViewProps = { disabled: true };
export default function SetBiometrics() {
  usePreventHardwareBack();
  const dispatch = useAppDispatch();
  const timer = useRef<TimerResult>();
  const { pin, caInfo: paramsCAInfo } = useRouterParams<{ pin?: string; caInfo?: CAInfo }>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const { walletInfo } = useCurrentWallet();
  const { apiUrl } = useCurrentNetworkInfo();
  const [caInfo, setStateCAInfo] = useState<CAInfo | undefined>(paramsCAInfo);

  const isSyncCAInfo = useMemo(
    () => walletInfo.address && walletInfo.managerInfo && !walletInfo.AELF?.caAddress,
    [walletInfo.AELF?.caAddress, walletInfo.address, walletInfo.managerInfo],
  );
  useEffect(() => {
    if (isSyncCAInfo) {
      setTimeout(() => {
        if (walletInfo.managerInfo && apiUrl)
          timer.current = intervalGetResult({
            apiUrl,
            managerInfo: walletInfo.managerInfo,
            onPass: setStateCAInfo,
            onFail: message =>
              onResultFail(
                dispatch,
                message,
                walletInfo.managerInfo?.verificationType === VerificationType.communityRecovery,
                true,
              ),
          });
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSyncCAInfo]);
  const getResult = useCallback(async () => {
    if (!pin) return;
    if (!isSyncCAInfo) return navigationService.reset('Tab');
    if (caInfo) {
      dispatch(
        setCAInfo({
          caInfo,
          pin,
          chainId: DefaultChainId,
        }),
      );
      return navigationService.reset('Tab');
    }
    if (walletInfo.managerInfo) {
      timer.current?.remove();
      Loading.show();
      timer.current = intervalGetResult({
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
        onFail: message =>
          onResultFail(
            dispatch,
            message,
            walletInfo.managerInfo?.verificationType === VerificationType.communityRecovery,
            true,
          ),
      });
    }
  }, [apiUrl, caInfo, dispatch, isSyncCAInfo, pin, walletInfo.managerInfo]);
  const openBiometrics = useCallback(async () => {
    if (!pin) return;
    try {
      await setSecureStoreItem('Pin', pin);
      dispatch(setBiometrics(true));
      await getResult();
    } catch (error) {
      setErrorMessage(handleError(error, 'Failed To Verify'));
    }
  }, [dispatch, getResult, pin]);
  const onSkip = useCallback(async () => {
    try {
      dispatch(setBiometrics(false));
      await getResult();
    } catch (error) {
      CommonToast.failError(error);
    }
  }, [dispatch, getResult]);
  return (
    <PageContainer scrollViewProps={ScrollViewProps} leftDom titleDom containerStyles={styles.containerStyles}>
      <Touchable style={GStyles.itemCenter} onPress={openBiometrics}>
        <Image resizeMode="contain" source={biometric} style={styles.biometricIcon} />
        <TextL style={styles.tipText}>Enable biometric authentication</TextL>
        {errorMessage ? <TextS style={styles.errorText}>{errorMessage}</TextS> : null}
      </Touchable>
      <CommonButton type="clear" title="Skip" buttonStyle={BGStyles.transparent} onPress={onSkip} />
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
