import React from 'react';
import { AccountType } from '@portkey-wallet/types/wallet';
import { TextM, TextS, TextXL } from 'components/CommonText';
import Touchable from 'components/Touchable';
import { StyleSheet, View } from 'react-native';
import { divDecimals, unitConverter } from '@portkey-wallet/utils/converter';
import { pTd } from 'utils/unit';
import { defaultColors } from 'assets/theme';
import Svg from 'components/Svg';
import { useWallet } from 'hooks/store';
import GStyles from 'assets/theme/GStyles';
import { useLanguage } from 'i18n/hooks';

export function AccountItem({
  account,
  onPress,
  balances,
}: {
  account: AccountType;
  onPress: () => void;
  balances?: string;
}) {
  const { t } = useLanguage();
  const { currentAccount } = useWallet();
  return (
    <Touchable style={styles.accountRow} onPress={onPress}>
      <View style={GStyles.flexRowWrap}>
        <View style={styles.nameRow}>
          <TextXL numberOfLines={1}>{account.accountName}</TextXL>
          <TextM numberOfLines={1} style={styles.balanceText}>
            {unitConverter(divDecimals(balances, 8))} ELF
          </TextM>
        </View>
        {account.accountType === 'Import' && (
          <View style={styles.importRow}>
            <TextS>{t('IMPORTED')}</TextS>
          </View>
        )}
      </View>
      {currentAccount?.address === account.address && (
        <Touchable style={styles.selectedRow}>
          <Svg icon="selected" size={pTd(24)} />
        </Touchable>
      )}
    </Touchable>
  );
}
const styles = StyleSheet.create({
  accountRow: {
    position: 'relative',
    paddingHorizontal: pTd(24),
    paddingVertical: pTd(15),
    borderBottomWidth: 1,
    borderBottomColor: defaultColors.border6,
    justifyContent: 'center',
  },
  balanceText: {
    color: defaultColors.font7,
    marginTop: 4,
  },
  selectedRow: {
    position: 'absolute',
    right: pTd(25),
  },
  importRow: {
    height: pTd(22),
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: defaultColors.border6,
    borderWidth: 1,
    paddingHorizontal: pTd(12),
    marginLeft: pTd(16),
  },
  importText: {
    color: defaultColors.font3,
  },
  nameRow: {
    maxWidth: '55%',
  },
});
