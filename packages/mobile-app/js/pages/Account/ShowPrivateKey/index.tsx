import React, { useCallback, useMemo, useRef, useState } from 'react';
import PageContainer from 'components/PageContainer';
import { TextL, TextM, TextS, TextXXXL } from 'components/CommonText';
import GStyles from 'assets/theme/GStyles';
import VerifyPasswordInput, { VerifyPasswordInputInterface } from 'components/VerifyPasswordInput';
import { sleep } from 'utils';
import Touchable from 'components/Touchable';
import { setStringAsync } from 'expo-clipboard';
import CommonToast from 'components/CommonToast';
import navigationService from 'utils/navigationService';
import { AccountType } from '@portkey-wallet/types/wallet';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useWallet } from 'hooks/store';
import aes from '@portkey-wallet/utils/aes';
import { defaultColors } from 'assets/theme';
import { StyleSheet, View } from 'react-native';
import { pTd } from 'utils/unit';
import { windowHeight } from 'utils/device';
import CommonButton from 'components/CommonButton';
import fonts from 'assets/theme/fonts';
import Svg from 'components/Svg';
import useKeyboardHeight from 'hooks/useKeyboardHeight';
import i18n from 'i18n';
import { useLanguage } from 'i18n/hooks';

type RouterParams = RouteProp<{
  params: {
    account: AccountType;
  };
}>;

export default function ShowPrivateKey() {
  const passwordRef = useRef<VerifyPasswordInputInterface>();
  const [tmpPassword, setTmpPassword] = useState<string>();
  const { params } = useRoute<RouterParams>();
  const { account } = params || {};
  const { t } = useLanguage();
  const keyboardHeight = useKeyboardHeight();
  const { currentAccount } = useWallet();
  const accountInfo = useMemo(() => account || currentAccount, [account, currentAccount]);
  const [loading, setLoading] = useState<boolean>();
  const [privateKey, setPrivateKey] = useState<string>();
  const onNext = useCallback(async () => {
    if (!passwordRef.current) return;
    setLoading(true);
    await sleep(100);
    const [success, password] = await passwordRef.current.verifyPassword();
    if (success) setPrivateKey(aes.decrypt(accountInfo.AESEncryptPrivateKey, password) || '');
    setLoading(false);
  }, [accountInfo.AESEncryptPrivateKey]);
  return (
    <PageContainer containerStyles={styles.containerStyle} titleDom type="leftBack" safeAreaColor={['blue', 'gray']}>
      <View style={{ minHeight: windowHeight - pTd(255) - keyboardHeight }}>
        <TextXXXL style={[GStyles.alignCenter, GStyles.marginTop(16), GStyles.marginBottom(32)]}>
          {t('Show Private Key')}
        </TextXXXL>
        {privateKey ? (
          <>
            <TextM style={styles.showLabel}>{t('Show Private Key')}</TextM>
            <View style={styles.privateKeyRow}>
              <TextM>{privateKey}</TextM>
              <Touchable
                onPress={async () => {
                  if (!privateKey) return;
                  const isCopy = await setStringAsync(privateKey);
                  isCopy && CommonToast.success(i18n.t('Copy Success'));
                }}
                style={[styles.copyRow, GStyles.flexRowWrap, GStyles.itemCenter]}>
                <Svg icon="copy" size={pTd(12)} />
                <TextS style={styles.primaryText}>{t('Copy')}</TextS>
              </Touchable>
            </View>
          </>
        ) : (
          <VerifyPasswordInput
            label={t('Enter Password to Continue2')}
            placeholder={t('Enter Password')}
            onChangeText={setTmpPassword}
            ref={passwordRef}
          />
        )}
      </View>
      <View style={styles.bottomRow}>
        <View style={styles.tipRow}>
          <TextL style={[styles.tipText, fonts.mediumFont, styles.tipTitle]}>
            {t('DO NOT SHARE THIS KEY WITH ANYONE!')}
          </TextL>
          <TextM style={[styles.tipText, GStyles.marginTop(8)]}>
            {t('This private key can be used by others to steal your assets')}
          </TextM>
        </View>
        <CommonButton
          disabled={!tmpPassword}
          type="primary"
          loading={loading}
          title={t(privateKey ? 'Close' : 'Show Private Key')}
          onPress={
            privateKey ? () => (account ? navigationService.navigate('Wallet') : navigationService.goBack()) : onNext
          }
        />
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: defaultColors.bg4,
    paddingHorizontal: pTd(16),
  },
  viewContainer: {
    minHeight: windowHeight - pTd(260),
  },
  bottomRow: {
    marginBottom: 20,
  },
  tipRow: {
    paddingVertical: 12,
    paddingHorizontal: pTd(16),
    backgroundColor: defaultColors.bg10,
    marginBottom: pTd(24),
    borderRadius: pTd(6),
  },
  tipText: {
    color: defaultColors.error,
  },
  tipTitle: {
    fontSize: 16,
  },
  privateKeyRow: {
    position: 'relative',
    backgroundColor: defaultColors.bg1,
    padding: 16,
    borderRadius: 6,
    minHeight: 120,
  },
  copyRow: {
    zIndex: 99,
    position: 'absolute',
    right: pTd(14),
    bottom: -24,
  },
  primaryText: {
    marginLeft: 8,
    color: defaultColors.primaryColor,
  },
  showLabel: {
    color: defaultColors.font3,
    marginLeft: pTd(10),
    marginBottom: 8,
  },
});
