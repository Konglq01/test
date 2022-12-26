import React, { useCallback, useState } from 'react';
import { TextL, TextXXXL } from 'components/CommonText';
import CommonInput from 'components/CommonInput';
import { sleep } from 'utils';
import { importAccount, setCurrentAccount } from '@portkey/store/wallet/actions';
import { useAppDispatch } from 'store/hooks';
import { isWalletError } from '@portkey/store/wallet/utils';
import { useCredentials } from 'hooks/store';
import { StyleSheet, View } from 'react-native';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import navigationService from 'utils/navigationService';
import Touchable from 'components/Touchable';
import Svg from 'components/Svg';
import { isIos, screenHeight } from '@portkey/utils/mobile/device';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CommonButton from 'components/CommonButton';
import { WalletError } from '@portkey/store/wallet/type';
import ActionSheet from 'components/ActionSheet';
import { AccountType } from '@portkey/types/wallet';
import useKeyboardHeight from 'hooks/useKeyboardHeight';
import { useLanguage } from 'i18n/hooks';
import i18n from 'i18n';

const TopBoxHeight = 320;

const bottomHeight = !isIos ? 10 : 0;

const minHeight = screenHeight - bottomHeight - TopBoxHeight - pTd(48);

export default function ImportAccount() {
  const [privateKey, setPrivateKey] = useState<string>();
  const keyboardHeight = useKeyboardHeight();

  const [loading, setLoading] = useState<boolean>();
  const dispatch = useAppDispatch();
  const credentials = useCredentials();
  const [errorMessage, setErrorMessage] = useState<string>();

  const { t } = useLanguage();
  const onInput = useCallback(async () => {
    if (!privateKey || !credentials?.pin) return;
    setLoading(true);
    await sleep(500);
    try {
      dispatch(importAccount({ privateKey, password: credentials?.pin }));
      ActionSheet.alert({
        title: i18n.t('Account Successfully Imported!'),
        message: i18n.t('You are now able to view your account in Portkey') as string,
        buttons: [
          {
            title: i18n.t('Close'),
            onPress: () => {
              navigationService.goBack();
            },
          },
        ],
      });
    } catch (error: any) {
      const message = isWalletError(error);
      if (message === WalletError.accountExists) {
        const accountInfo: AccountType = JSON.parse(error.accountInfo);
        ActionSheet.alert({
          title: i18n.t('Account Import Failed!'),
          message: i18n.t('The account is already displayed in the account list') as string,
          buttons: [
            { title: i18n.t('Reimport'), type: 'outline' },
            {
              title: i18n.t('View This Account'),
              onPress: () => {
                dispatch(setCurrentAccount({ address: accountInfo.address, password: credentials.pin }));
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
  }, [credentials?.pin, dispatch, privateKey]);
  const { top, bottom } = useSafeAreaInsets();
  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
        <View style={[styles.paddingContainer, styles.topBox, { paddingTop: top + 45 }]}>
          <TextL style={styles.descriptionText}>
            {t('Imported accounts are not related to your original Portkey account or its private key')}
          </TextL>
          <TextXXXL style={styles.titleText}>{t('Import Account')}</TextXXXL>
          <Svg icon="import" size={pTd(48)} />
          <Touchable onPress={navigationService.goBack} style={[styles.closeIcon, { top: top + 15 }]}>
            <Svg icon="close" size={pTd(14)} />
          </Touchable>
        </View>
        <View
          style={[styles.paddingContainer, styles.middleBox, { minHeight: minHeight - bottom - keyboardHeight - 45 }]}>
          <CommonInput
            multiline
            inputStyle={styles.inputStyle}
            inputContainerStyle={styles.inputContainerStyle}
            errorMessage={t(errorMessage || '')}
            onChangeText={setPrivateKey}
            value={privateKey}
            label={t('Enter Your Private Key String')}
            type="general"
            placeholder={t('Enter Your Private Key String Here')}
          />
        </View>
        <View style={[styles.paddingContainer, styles.bottomBox, { paddingBottom: bottom + bottomHeight }]}>
          <CommonButton disabled={!privateKey} type="primary" loading={loading} onPress={onInput}>
            {t('Import')}
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
  descriptionText: {
    color: defaultColors.font3,
    marginTop: 43,
  },
  closeIcon: {
    position: 'absolute',
    right: 20,
    padding: 5,
  },
  inputContainerStyle: {
    height: 120,
    alignItems: 'flex-start',
  },
  inputStyle: {
    marginTop: 16,
  },
});
