import type { AccountType } from '@portkey/types/wallet';
import { useWallet } from 'hooks/store';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import { TextM } from 'components/CommonText';
import Svg from 'components/Svg';
import AccountOverlay from 'components/AccountOverlay';
import { useLanguage } from 'i18n/hooks';

interface FromProps {
  accountList?: AccountType[];
  selectedFromAccount: AccountType;
  setSelectedFromAccount: any;
}

export default function From({ selectedFromAccount, setSelectedFromAccount }: FromProps) {
  const { accountList } = useWallet();
  const { t } = useLanguage();

  const changeFromAccount = () => {
    if (accountList?.length === 1) return;
    AccountOverlay.showAccountList('innerPage', account => setSelectedFromAccount?.(account));
  };

  return (
    <View style={styles.fromWrap}>
      <TextM style={styles.leftTitle}>{t('From')}</TextM>
      <Text style={styles.middle} onPress={changeFromAccount}>
        {selectedFromAccount?.accountName}
      </Text>
      {accountList?.length && accountList?.length > 1 && (
        <TouchableOpacity onPress={changeFromAccount}>
          <Svg icon="down-arrow" size={pTd(16)} />
        </TouchableOpacity>
      )}
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
  },
  right: {
    width: pTd(17),
  },
});
