import React, { useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { PrimaryText, TextL, TextM, TextXXXL } from 'components/CommonText';
import useStyles from './styles';
import GStyles from 'assets/theme/GStyles';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import aes from '@portkey-wallet/utils/aes';
import { setBackup } from '@portkey-wallet/store/wallet/actions';
import navigationService from 'utils/navigationService';
import CommonToast from 'components/CommonToast';
import PageContainer from 'components/PageContainer';
import CommonButton from 'components/CommonButton';
import Touchable from 'components/Touchable';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import { usePreventScreenCapture } from 'expo-screen-capture';
import { useLanguage } from 'i18n/hooks';
import i18n from 'i18n';

type mnemonicItem = {
  value: string;
  key: number;
};
export default function MnemonicConfirmation() {
  const styles = useStyles();
  const { t } = useLanguage();
  const [mnemonicList, setMnemonicList] = useState<mnemonicItem[]>();
  const { walletInfo, credentials } = useAppSelector(state => ({
    walletInfo: state.wallet.walletInfo,
    credentials: state.user.credentials,
  }));
  usePreventScreenCapture('MnemonicConfirmation');
  const dispatch = useAppDispatch();

  const mnemonic = useMemo(() => {
    if (!walletInfo?.AESEncryptMnemonic || !credentials?.password) return;
    const tempMnemonic = aes.decrypt(walletInfo?.AESEncryptMnemonic, credentials?.password);
    // FIXME: delete setMnemonicList
    tempMnemonic &&
      __DEV__ &&
      setMnemonicList(
        tempMnemonic.split(' ').map((value, key) => ({
          value,
          key,
        })),
      );
    if (tempMnemonic) return tempMnemonic;
  }, [credentials?.password, walletInfo?.AESEncryptMnemonic]);
  const defaultMnemonic = useMemo(() => mnemonic?.split(' '), [mnemonic]);
  const sortMnemonic = useMemo(() => defaultMnemonic?.sort(() => 0.5 - Math.random()), [defaultMnemonic]);
  const completed = mnemonicList?.length === defaultMnemonic?.length;
  const inputMnemonic = mnemonicList?.map(i => i.value)?.join(' ');
  return (
    <PageContainer titleDom type="leftBack">
      <View style={styles.viewContainer}>
        <TextXXXL style={styles.titleStyle}>{t('Confirm Your Secret Recovery Phrase')}</TextXXXL>
        <TextL style={styles.detailsStyle}>{t('Please select the words in the right order')}</TextL>
        <View
          style={[
            styles.mnemonicBox,
            GStyles.flexRowWrap,
            // eslint-disable-next-line react-native/no-inline-styles
            { height: !mnemonicList || mnemonicList?.length <= 9 ? 190 : undefined },
          ]}>
          {mnemonicList?.map((i, k) => {
            return (
              <Touchable
                style={styles.mnemonicItem}
                key={i.value + i.key}
                onPress={() => setMnemonicList(v => v?.filter(item => item.key !== i.key))}>
                <TextM style={styles.mnemonicKey}>{k + 1}</TextM>
                <Text style={styles.mnemonicText}>{i.value}</Text>
              </Touchable>
            );
          })}
        </View>
        {completed && inputMnemonic !== mnemonic ? (
          <TextM style={styles.tipText}>{t('Invalid Secret Recovery Phrase')}</TextM>
        ) : null}
        <View style={[styles.mnemonicBox, styles.sortMnemonicBox, GStyles.flexRowWrap]}>
          {sortMnemonic?.map((i, key) => {
            return (
              <Touchable
                onPress={() => setMnemonicList([...(mnemonicList || []), { value: i, key }])}
                disabled={!!mnemonicList?.find(item => item.key === key)}
                style={[
                  styles.mnemonicItem,
                  styles.sortMnemonicItem,
                  !!mnemonicList?.find(item => item.key === key) && styles.mnemonicItemDisabled,
                ]}
                key={i}>
                <TextM>{i}</TextM>
              </Touchable>
            );
          })}
        </View>
        {mnemonicList?.length ? (
          <Touchable style={styles.reloadRow} onPress={() => setMnemonicList(undefined)}>
            <Svg size={pTd(14)} icon="reload" />
            <PrimaryText style={styles.reloadText}>{t('Clear')}</PrimaryText>
          </Touchable>
        ) : null}
      </View>
      <CommonButton
        containerStyle={GStyles.marginBottom(20)}
        type="primary"
        disabled={!completed || inputMnemonic !== mnemonic}
        onPress={() => {
          if (inputMnemonic !== mnemonic) return;
          const { password } = credentials || {};
          if (!password) return;
          try {
            dispatch(setBackup({ password, isBackup: true }));
            CommonToast.success(i18n.t('Backup Successfully'));
            navigationService.reset('CreateSuccess', { isBackup: true });
          } catch (error) {
            console.log(error, '==error');
          }
        }}>
        {t('Confirm')}
      </CommonButton>
    </PageContainer>
  );
}
