import React, { useCallback, useState } from 'react';
import { TextL, TextXXXL } from 'components/CommonText';
import AElf from 'aelf-sdk';
import { sleep } from 'utils';
import navigationService from 'utils/navigationService';
import PageContainer from 'components/PageContainer';
import PasswordInput from 'components/PasswordInput';
import { pTd } from 'utils/unit';
import { StyleSheet, View } from 'react-native';
import { defaultColors } from 'assets/theme';
import CommonButton from 'components/CommonButton';
import { windowHeight } from 'utils/device';
import { useLanguage } from 'i18n/hooks';
const defaultMnemonic = __DEV__
  ? 'emerge antenna grocery such ticket stem castle place myself flat magnet chronic'
  : '';
export default function ImportWallet() {
  const [mnemonic, setMnemonic] = useState<string>(defaultMnemonic);
  const { t } = useLanguage();
  const [isError, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>();
  const Confirm = useCallback(async () => {
    setLoading(true);
    await sleep(10);
    const mnemonicWallet = AElf.wallet.getWalletByMnemonic(mnemonic.replaceAll(/\s+/g, ' ').trim() || '');
    setLoading(false);
    if (!mnemonicWallet) return setError(true);
    delete mnemonicWallet.childWallet;
    navigationService.reset('CreateSuccess', { walletInfo: mnemonicWallet });
  }, [mnemonic]);
  return (
    <PageContainer type="leftBack" titleDom>
      <View style={styles.viewContainer}>
        <TextXXXL style={styles.titleStyle}>{t('Enter Secret Recovery Phrase')}</TextXXXL>
        <TextL style={styles.detailsStyle}>{t('Access an existing wallet with your Secret Recovery Phrase')}</TextL>
        <PasswordInput
          multiline
          value={mnemonic}
          maxLength={200}
          textAlignVertical="top"
          onChangeText={setMnemonic}
          placeholder={t('Enter or paste your Secret Recovery Phrase, separating words with space')}
          proclaimInputStyle={styles.inputStyle}
          inputContainerStyle={styles.inputContainerStyle}
          rightIconContainerStyle={styles.rightIconContainerStyle}
          errorMessage={isError ? t('Invalid Secret Recovery Phrase2') : undefined}
        />
      </View>
      <CommonButton disabled={!mnemonic} type="primary" loading={loading} onPress={Confirm}>
        {t('Confirm')}
      </CommonButton>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  titleStyle: {
    marginTop: pTd(8),
    paddingHorizontal: pTd(20),
    alignSelf: 'center',
    textAlign: 'center',
  },
  detailsStyle: {
    alignSelf: 'center',
    textAlign: 'center',
    paddingHorizontal: pTd(10),
    color: defaultColors.font3,
    marginTop: pTd(8),
    marginBottom: pTd(24),
  },
  inputContainerStyle: {
    width: '100%',
    height: windowHeight * 0.25,
    alignItems: 'flex-start',
  },
  rightIconContainerStyle: {
    position: 'absolute',
    justifyContent: 'flex-end',
    bottom: 5,
    right: 5,
  },
  viewContainer: {
    minHeight: windowHeight - pTd(150),
  },
  inputStyle: {
    height: windowHeight * 0.19,
  },
});
