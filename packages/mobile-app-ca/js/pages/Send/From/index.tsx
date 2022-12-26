import { useWallet } from 'hooks/store';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import { TextM } from 'components/CommonText';
import Svg from 'components/Svg';
import { useLanguage } from 'i18n/hooks';

interface FromProps {
  selectedFromAccount: any;
}

export default function From({ selectedFromAccount }: FromProps) {
  const { t } = useLanguage();
  const { walletName, currentNetwork } = useWallet();

  // const changeFromAccount = () => {
  //   if (accountList?.length === 1) return;
  //   AccountOverlay.showAccountList('innerPage', account => setSelectedFromAccount?.(account));
  // };

  return (
    <View style={styles.fromWrap}>
      <TextM style={styles.leftTitle}>{t('From')}</TextM>
      {/* TODO: change account name */}
      <Text style={styles.middle}>{walletName}</Text>
    </View>
  );
}

export const styles = StyleSheet.create({
  fromWrap: {
    height: pTd(56),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftTitle: {
    width: pTd(49),
    color: defaultColors.font3,
  },
  middle: {
    flex: 1,
    color: defaultColors.font5,
  },
  right: {
    width: pTd(17),
  },
});
