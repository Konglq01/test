import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import PageContainer from 'components/PageContainer';
import ListItem, { ListItemProps } from 'components/ListItem';
import { useUser, useWallet } from 'hooks/store';
import { authenticationReady, touchAuth } from 'utils/authentication';
import CommonToast from 'components/CommonToast';
import { useAppDispatch } from 'store/hooks';
import { setBiometrics } from 'store/user/actions';
import useBiometricsReady from 'hooks/useBiometrics';
import navigationService from 'utils/navigationService';
import Touchable from 'components/Touchable';
import { PrimaryText } from 'components/CommonText';
import useLogOut from 'hooks/useLogOut';
import GStyles from 'assets/theme/GStyles';
import { isIos, windowHeight } from 'utils/device';
import { StyleSheet, View, DeviceEventEmitter } from 'react-native';
import { pTd } from 'utils/unit';
import { defaultColors } from 'assets/theme';
import Svg from 'components/Svg';
import { headerHeight } from 'components/CustomHeader/style/index.style';
import { checkPassword } from 'utils/redux';
import secureStore from 'utils/secureStore';
import useEffectOnce from 'hooks/useEffectOnce';
import { useLanguage } from 'i18n/hooks';
import i18n from 'i18n';

const list: ListItemProps[] = [
  {
    title: 'Change Password',
    onPress: () => navigationService.navigate('CheckPassword'),
  },
  {
    title: 'Show Secret Recovery Phrase',
    onPress: () => navigationService.navigate('ShowMnemonic'),
  },
];

export default function SecurityAndPrivacy() {
  const { currentAccount } = useWallet();
  const { biometrics } = useUser();
  const dispatch = useAppDispatch();
  const biometricsReady = useBiometricsReady();
  const onLogOut = useLogOut();
  const { t } = useLanguage();
  const memoList = useMemo(() => {
    const tmpList = [...list];
    if (currentAccount)
      tmpList.push({
        title: t('Show Private Key for', {
          accountName: currentAccount.accountName,
        }),
        onPress: () => navigationService.navigate('ShowPrivateKey'),
      });
    return tmpList;
  }, [currentAccount, t]);
  const openBiometrics = useCallback(
    async (password: string) => {
      if (checkPassword(password)) {
        try {
          // iOS manually open authenticate
          if (isIos) {
            const enrolled = await touchAuth();
            if (!enrolled.success) throw { message: enrolled.warning || enrolled.error };
          }
          // android secureStore requires authenticate by default
          await secureStore.setItemAsync('Password', password);
          dispatch(setBiometrics(true));
        } catch (error: any) {
          CommonToast.fail(typeof error.message === 'string' ? error.message : i18n.t('Failed to enable biometrics'));
          dispatch(setBiometrics(false));
        }
      }
    },
    [dispatch],
  );
  useEffectOnce(() => {
    const listener = DeviceEventEmitter.addListener('openBiometrics', openBiometrics);
    return () => listener.remove();
  });
  const onValueChange = useCallback(
    async (value: boolean) => {
      if (value) {
        const result = await authenticationReady();
        if (!result) return CommonToast.fail('该设备暂不支持生物识别');
        navigationService.navigate('CheckPassword', { openBiometrics: true });
      } else {
        const enrolled = await touchAuth();
        if (enrolled.success) dispatch(setBiometrics(value));
        else CommonToast.fail(enrolled.warning || enrolled.error);
      }
    },
    [dispatch],
  );
  return (
    <PageContainer
      type="leftBack"
      containerStyles={styles.containerStyles}
      safeAreaColor={['blue', 'gray']}
      titleDom={t('Security & Privacy')}>
      <View style={[{ minHeight: windowHeight - pTd(80) - headerHeight }]}>
        {memoList.map(item => (
          <ListItem style={styles.listStyle} key={item.title} {...item} title={t(item.title)} />
        ))}
        {biometricsReady && (
          <ListItem
            disabled
            switching
            switchValue={biometrics}
            style={styles.biometricsRow}
            onValueChange={onValueChange}
            title={t('Unlock with Biometrics?')}
            switchStyles={styles.switchStyles}
            titleStyle={styles.switchTitleStyle}
          />
        )}
      </View>
      <Touchable style={[GStyles.alignCenter, GStyles.flexRow, GStyles.itemCenter]} onPress={onLogOut}>
        <Svg size={pTd(16)} icon="reload" />
        <PrimaryText style={styles.resetText}>{t('Reset Wallet')}</PrimaryText>
      </Touchable>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  containerStyles: {
    backgroundColor: defaultColors.bg4,
  },
  listStyle: {
    marginTop: 12,
    marginBottom: 0,
  },
  switchStyles: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
  switchTitleStyle: {
    fontSize: pTd(14),
    color: defaultColors.font3,
  },
  biometricsRow: {
    padding: 0,
    paddingVertical: 0,
    paddingHorizontal: 0,
    minHeight: 0,
    backgroundColor: 'transparent',
    marginTop: 25,
  },
  resetText: {
    marginTop: 10,
    marginLeft: pTd(8),
  },
});
