import React, { useCallback, useRef, useState } from 'react';
import PageContainer from 'components/PageContainer';
import { TextL, TextM, TextS, TextXXXL } from 'components/CommonText';
import GStyles from 'assets/theme/GStyles';
import VerifyPasswordInput, { VerifyPasswordInputInterface } from 'components/VerifyPasswordInput';
import { sleep } from 'utils';
import Touchable from 'components/Touchable';
import { setStringAsync } from 'expo-clipboard';
import CommonToast from 'components/CommonToast';
import navigationService from 'utils/navigationService';
import { defaultColors } from 'assets/theme';
import { StyleSheet, View } from 'react-native';
import { pTd } from 'utils/unit';
import { windowHeight } from '@portkey/utils/mobile/device';
import CommonButton from 'components/CommonButton';
import fonts from 'assets/theme/fonts';
import Svg from 'components/Svg';
import useKeyboardHeight from 'hooks/useKeyboardHeight';
import { getWalletMnemonic } from 'utils/redux';
import i18n from 'i18n';
import { useLanguage } from 'i18n/hooks';
export default function ShowPrivateKey() {
  const passwordRef = useRef<VerifyPasswordInputInterface>();
  const [tmpPassword, setTmpPassword] = useState<string>();
  const keyboardHeight = useKeyboardHeight();
  const [loading, setLoading] = useState<boolean>();
  const [mnemonic, setMnemonic] = useState<string>();
  const { t } = useLanguage();
  const onNext = useCallback(async () => {
    if (!passwordRef.current) return;
    setLoading(true);
    await sleep(100);
    const [success, password] = await passwordRef.current.verifyPassword();
    if (success) setMnemonic(getWalletMnemonic(password));
    setLoading(false);
  }, []);
  return (
    <PageContainer containerStyles={styles.containerStyle} titleDom type="leftBack" safeAreaColor={['blue', 'gray']}>
      <View style={{ minHeight: windowHeight - pTd(255) - keyboardHeight }}>
        <TextXXXL style={[GStyles.alignCenter, GStyles.marginTop(16)]}>{t('Show Secret Recovery Phrase')}</TextXXXL>
        <TextL style={[GStyles.alignCenter, GStyles.textAlignCenter, styles.mnemonicTipText]}>
          {t(
            'If you switch to other devices or browsers, you will need this Secret Recovery Phrase to access your accounts. Please save it in a safe place',
          )}
        </TextL>
        {mnemonic ? (
          <>
            <TextM style={styles.showLabel}>{t('Show Secret Recovery Phrase')}</TextM>
            <View style={styles.privateKeyRow}>
              <TextM>{mnemonic}</TextM>
              <Touchable
                onPress={async () => {
                  if (!mnemonic) return;
                  const isCopy = await setStringAsync(mnemonic);
                  isCopy && CommonToast.success(i18n.t('Copy Success'));
                }}
                style={[styles.copyRow, GStyles.flexRow, GStyles.itemCenter]}>
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
            {t('DO NOT SHARE THIS PHRASE WITH ANYONE!2')}
          </TextL>
          <TextM style={[styles.tipText, GStyles.marginTop(pTd(8))]}>
            {t('These words can be used to steal all your accounts.')}
          </TextM>
        </View>
        <CommonButton
          disabled={!tmpPassword}
          type="primary"
          loading={loading}
          title={t(mnemonic ? 'Close' : 'Show Secret Recovery Phrase')}
          onPress={mnemonic ? () => navigationService.navigate('Wallet') : onNext}
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
  mnemonicTipText: {
    ...GStyles.marginArg(8, pTd(10), 32),
    color: defaultColors.font3,
  },
});
