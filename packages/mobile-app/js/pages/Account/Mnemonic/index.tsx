import React, { useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { PrimaryText, TextL, TextM, TextXXXL } from 'components/CommonText';
import { useAppSelector } from 'store/hooks';
import aes from '@portkey-wallet/utils/aes';
import useStyles from './styles';
import GStyles from 'assets/theme/GStyles';
import * as Clipboard from 'expo-clipboard';
import navigationService from 'utils/navigationService';
import CommonToast from 'components/CommonToast';
import PageContainer from 'components/PageContainer';
import Touchable from 'components/Touchable';
import CommonButton from 'components/CommonButton';
import CheckTermsOfService from 'components/CheckTermsOfService';
import { usePreventScreenCapture } from 'expo-screen-capture';
import { useLanguage } from 'i18n/hooks';
import i18n from 'i18n';
export default function Mnemonic() {
  const styles = useStyles();
  const { t } = useLanguage();
  const [checked, setCheck] = useState(false);
  const { walletInfo, credentials } = useAppSelector(state => ({
    walletInfo: state.wallet.walletInfo,
    credentials: state.user.credentials,
  }));
  usePreventScreenCapture('Mnemonic');
  const { mnemonic, mnemonicList } =
    useMemo(() => {
      if (!walletInfo?.AESEncryptMnemonic || !credentials?.password) return;
      const tempMnemonic = aes.decrypt(walletInfo?.AESEncryptMnemonic, credentials?.password);
      if (tempMnemonic)
        return {
          mnemonic: tempMnemonic,
          mnemonicList: tempMnemonic.split(' '),
        };
    }, [credentials?.password, walletInfo?.AESEncryptMnemonic]) || {};
  return (
    <PageContainer type="leftBack" titleDom>
      <View style={styles.viewContainer}>
        <TextXXXL style={styles.titleStyle}>{t('Secret Recovery Phrase')}</TextXXXL>
        <TextL style={styles.detailsStyle}>
          {t(
            `This is your Secret Recovery Phrase. Please write it down and store it in a safe place. You'll be asked to re-enter this phrase (in the right order) on the next step`,
          )}
        </TextL>
        <View style={[styles.mnemonicBox, GStyles.flexRow]}>
          {mnemonicList?.map((i, k) => {
            return (
              <View style={styles.mnemonicItem} key={i}>
                <TextM style={styles.mnemonicKey}>{k + 1}</TextM>
                <Text style={styles.mnemonicText}>{i}</Text>
              </View>
            );
          })}
        </View>
        <Touchable
          onPress={async () => {
            if (!mnemonic) return;
            const isCopy = await Clipboard.setStringAsync(mnemonic);
            isCopy && CommonToast.success(i18n.t('Copy Success'));
          }}
          style={GStyles.alignCenter}>
          <PrimaryText>{t('Copy')}</PrimaryText>
        </Touchable>
      </View>
      <View style={GStyles.marginBottom(20)}>
        <View style={styles.tipsBox}>
          <TextM style={styles.tipsText}>
            {t('Tips: Never reveal your secret recovery phrase to others. Anyone who holds it can control your wallet')}
          </TextM>
        </View>
        <CheckTermsOfService title={t('I have stored it in a safe place')} checked={checked} onPress={setCheck} />
        <CommonButton
          disabled={!checked}
          type="primary"
          onPress={() => navigationService.navigate('MnemonicConfirmation')}>
          {t('Next')}
        </CommonButton>
      </View>
    </PageContainer>
  );
}
