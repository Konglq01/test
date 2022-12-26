import React, { useMemo } from 'react';
import navigationService from 'utils/navigationService';
import { RouteProp, useRoute } from '@react-navigation/native';
import PageContainer from 'components/PageContainer';
import { Image, StyleSheet, View } from 'react-native';
import successIcon from 'assets/image/pngs/success-icon.png';
import { windowHeight, screenWidth } from 'utils/device';
import GStyles from 'assets/theme/GStyles';
import { TextL, TextM, TextXXXL } from 'components/CommonText';
import { pTd } from 'utils/unit';
import { defaultColors } from 'assets/theme';
import CommonButton from 'components/CommonButton';
import { useLanguage } from 'i18n/hooks';

type RouterParams = {
  walletInfo: any;
  importSuccess?: boolean;
  isBackup?: boolean;
};

export default function CreateSuccess() {
  const { params } = useRoute<RouteProp<{ params?: RouterParams }>>();
  const { t } = useLanguage();
  const [title, buttonTitle, onPress, tip] = useMemo(() => {
    const isImport = !!params?.walletInfo;
    const isImportSuccess = !!params?.importSuccess;
    const isBackup = !!params?.isBackup;
    let titleTmp = 'The wallet has been created successfully',
      buttonTitleTmp = 'View Secret Recovery Phrase',
      tipTmp =
        'Before getting started, you need to view and back up your Secret Recovery Phrase. This can help you protect your wallet',
      onPressTmp = () => navigationService.navigate('Mnemonic');
    if (isImport) {
      titleTmp = 'The Secret Recovery Phrase confirmed successfully2';
      buttonTitleTmp = 'Create Wallet';
      tipTmp =
        'Please create a wallet name and password. The password is used to unlock your wallet only on this device';
      onPressTmp = () => navigationService.navigate('CreateWallet', params);
    } else if (isImportSuccess) {
      titleTmp = 'The wallet has been created successfully';
      buttonTitleTmp = 'Enter Wallet';
      tipTmp = '';
      onPressTmp = () => navigationService.reset('Tab');
    } else if (isBackup) {
      titleTmp = 'The Secret Recovery Phrase confirmed successfully';
      buttonTitleTmp = 'Enter Wallet';
      tipTmp = '';
      onPressTmp = () => navigationService.reset('Tab');
    }
    return [titleTmp, buttonTitleTmp, onPressTmp, tipTmp];
  }, [params]);
  return (
    <PageContainer leftDom titleDom containerStyles={styles.containerStyle}>
      <Image style={[styles.iconStyles, GStyles.alignCenter]} source={successIcon} />
      <TextXXXL style={[GStyles.alignCenter, GStyles.marginTop(pTd(20))]}>{t('Congratulations!')}</TextXXXL>
      <TextL style={[GStyles.textAlignCenter, GStyles.marginTop(pTd(24))]}>{t(title)}</TextL>
      {tip ? (
        <View style={styles.tipRow}>
          <TextM style={styles.tipText}>{t(tip)}</TextM>
        </View>
      ) : null}
      <CommonButton containerStyle={styles.buttonStyle} type="primary" onPress={onPress}>
        {t(buttonTitle)}
      </CommonButton>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  iconStyles: {
    width: screenWidth * 0.45,
    height: screenWidth * 0.45,
  },
  containerStyle: {
    paddingTop: windowHeight * 0.05,
  },
  tipRow: {
    marginTop: pTd(32),
    padding: pTd(16),
    backgroundColor: defaultColors.bg2,
  },
  tipText: {
    color: defaultColors.font6,
  },
  buttonStyle: {
    marginTop: pTd(48),
  },
});
