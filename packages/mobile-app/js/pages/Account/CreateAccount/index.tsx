import React, { useCallback, useState } from 'react';
import CommonInput from 'components/CommonInput';
import { StyleSheet, View } from 'react-native';
import navigationService from 'utils/navigationService';
import { useAppDispatch } from 'store/hooks';
import { addAccount, addAndReplaceAccount } from '@portkey-wallet/store/wallet/actions';
import CommonToast from 'components/CommonToast';
import { sleep } from 'utils';
import { isWalletError } from '@portkey-wallet/store/wallet/utils';
import { WalletError } from '@portkey-wallet/store/wallet/type';
import { useCredentials } from 'hooks/store';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import CommonButton from 'components/CommonButton';
import { isIos, screenHeight } from 'utils/device';
import Svg from 'components/Svg';
import { TextXXXL } from 'components/CommonText';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Touchable from 'components/Touchable';
import AccountOverlay from 'components/AccountOverlay';
import useKeyboardHeight from 'hooks/useKeyboardHeight';
import { useLanguage } from 'i18n/hooks';
import i18n from 'i18n';
const TopBoxHeight = 210;
const bottomHeight = !isIos ? 10 : 0;

const minHeight = screenHeight - bottomHeight - TopBoxHeight - pTd(48);

export default function CreateAccount() {
  const [loading, setLoading] = useState<boolean>();
  const [accountName, setAccountName] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const keyboardHeight = useKeyboardHeight();
  const credentials = useCredentials();
  const dispatch = useAppDispatch();
  const { t } = useLanguage();
  const onCreate = useCallback(async () => {
    setLoading(true);
    await sleep(10);
    try {
      dispatch(addAccount({ password: credentials?.password || '', accountName }));
      CommonToast.success(i18n.t('Account Successfully Create!'));
      navigationService.goBack();
    } catch (error: any) {
      const message = isWalletError(error);
      if (message === WalletError.accountExists) {
        const accountInfo = JSON.parse(error.accountInfo);
        AccountOverlay.replaceAccount({
          account1: {
            ...accountInfo,
            accountName: accountName ? accountName : accountInfo.accountName,
          },
          account2: accountInfo,
          buttons: [
            { title: i18n.t('Never Mind'), type: 'outline' },
            {
              title: i18n.t('Replace'),
              type: 'primary',
              onPress: () => {
                dispatch(addAndReplaceAccount({ password: credentials?.password || '', accountName }));
                CommonToast.success(i18n.t('Account Successfully Create!'));
                navigationService.goBack();
              },
            },
          ],
        });
      } else {
        message && setErrorMessage(message);
      }
    }
    setLoading(false);
  }, [accountName, credentials?.password, dispatch]);
  const { top, bottom } = useSafeAreaInsets();
  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
        <View style={[styles.paddingContainer, styles.topBox, { paddingTop: top + 45 }]}>
          <TextXXXL style={styles.titleText}>{t('Create Account')}</TextXXXL>
          <Svg icon="add3" size={pTd(48)} />
          <Touchable onPress={navigationService.goBack} style={[styles.closeIcon, { top: top + 15 }]}>
            <Svg icon="close" size={pTd(14)} />
          </Touchable>
        </View>
        <View
          style={[styles.paddingContainer, styles.middleBox, { minHeight: minHeight - bottom - keyboardHeight - 45 }]}>
          <CommonInput
            onChangeText={setAccountName}
            value={accountName}
            label={t('Account Name')}
            type="general"
            placeholder={t('Enter a Name')}
            errorMessage={t(errorMessage || '')}
          />
        </View>
        <View style={[styles.paddingContainer, styles.bottomBox, { paddingBottom: bottom + bottomHeight }]}>
          <CommonButton type="primary" loading={loading} onPress={onCreate}>
            {t('Create')}
          </CommonButton>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: defaultColors.bg1,
  },
  paddingContainer: {
    paddingHorizontal: pTd(16),
  },
  topBox: {
    paddingHorizontal: pTd(32),
    flexDirection: 'column-reverse',
    paddingBottom: 48,
    position: 'relative',
    backgroundColor: defaultColors.bg9,
  },
  titleText: {
    marginTop: 24,
  },
  middleBox: {
    paddingTop: 32,
    backgroundColor: defaultColors.bg1,
  },
  bottomBox: {
    backgroundColor: defaultColors.bg1,
  },
  closeIcon: {
    position: 'absolute',
    right: 20,
    padding: 5,
  },
});
