import React, { useCallback } from 'react';
import PageContainer from 'components/PageContainer';
import ListItem from 'components/ListItem';
import { touchAuth } from '@portkey/utils/mobile/authentication';
import CommonToast from 'components/CommonToast';
import { useAppDispatch } from 'store/hooks';
import { setBiometrics } from 'store/user/actions';
import useBiometricsReady from 'hooks/useBiometrics';
import navigationService from 'utils/navigationService';
import { StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme';
import { checkPin } from 'utils/redux';
import useEffectOnce from 'hooks/useEffectOnce';
import { useLanguage } from 'i18n/hooks';
import i18n from 'i18n';
import { useUser } from 'hooks/store';
import { TextM } from 'components/CommonText';
import ActionSheet from 'components/ActionSheet';
import { setSecureStoreItem } from '@portkey/utils/mobile/biometric';
import myEvents from 'utils/deviceEvent';

export default function Biometric() {
  const dispatch = useAppDispatch();
  const { biometrics } = useUser();

  const biometricsReady = useBiometricsReady();
  const { t } = useLanguage();
  const openBiometrics = useCallback(
    async (pin: string) => {
      if (checkPin(pin)) {
        try {
          await setSecureStoreItem('Pin', pin);
          dispatch(setBiometrics(true));
        } catch (error: any) {
          CommonToast.failError(error, i18n.t('Failed to enable biometrics'));
          dispatch(setBiometrics(false));
        }
      }
    },
    [dispatch],
  );
  useEffectOnce(() => {
    const listener = myEvents.openBiometrics.addListener(openBiometrics);
    return () => listener.remove();
  });
  const onValueChange = useCallback(
    async (value: boolean) => {
      if (value) {
        // const result = await authenticationReady();
        // if (!result) return CommonToast.fail('This device does not currently support biometrics');
        navigationService.navigate('CheckPin', { openBiometrics: true });
      } else {
        ActionSheet.alert({
          title2: 'Confirm to turn off fingerprint recognition? ',
          buttons: [
            { type: 'outline', title: 'Cancel' },
            {
              type: 'primary',
              title: 'Confirm',
              onPress: async () => {
                const enrolled = await touchAuth();
                if (enrolled.success) dispatch(setBiometrics(value));
                else CommonToast.fail(enrolled.warning || enrolled.error);
              },
            },
          ],
        });
      }
    },
    [dispatch],
  );
  return (
    <PageContainer containerStyles={styles.containerStyles} safeAreaColor={['blue', 'gray']} titleDom={t('Biometric')}>
      {biometricsReady && (
        <>
          <ListItem
            disabled
            switching
            switchValue={biometrics}
            style={styles.listStyle}
            onValueChange={onValueChange}
            title={t('Biometrics')}
          />
          <TextM style={styles.tipText}>After opening, you can quickly unlock the device</TextM>
        </>
      )}
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  containerStyles: {
    paddingTop: 8,
    backgroundColor: defaultColors.bg4,
  },
  listStyle: {
    marginTop: 24,
    marginBottom: 0,
  },
  tipText: {
    paddingLeft: 8,
    marginTop: 24,
    color: defaultColors.font3,
  },
});
