import React, { useMemo, useState } from 'react';
import PageContainer from 'components/PageContainer';
import { TextM, TextXL } from 'components/CommonText';
import { AccountType } from '@portkey-wallet/types/wallet';
import { setStringAsync } from 'expo-clipboard';
import CommonToast from 'components/CommonToast';
import AccountOverlay from 'components/AccountOverlay';
import AccountCard from 'components/AccountCard';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { pTd } from 'utils/unit';
import { useWallet } from 'hooks/store';
import Svg from 'components/Svg';
import { defaultColors } from 'assets/theme';
import { useLanguage } from 'i18n/hooks';
import { useAppEOASelector } from '@portkey-wallet/hooks/hooks-eoa';

export default function Receive() {
  const { t } = useLanguage();
  const { currentChain } = useAppEOASelector(state => state.chain);
  const { currentAccount } = useAppEOASelector(state => state.wallet);
  const { accountList } = useWallet();

  const [account, setAccount] = useState<AccountType>(currentAccount as AccountType);

  const addressShow = useMemo(() => {
    if (account?.address.match(/^ELF_.+_AELF$/g)) return account?.address;
    if (currentChain.chainType === 'aelf') return `ELF_${account?.address}_AELF`;
    return account?.address;
  }, [account?.address, currentChain.chainType]);

  return (
    <PageContainer titleDom={t('Receive')} safeAreaColor={['blue', 'gray']} containerStyles={styles.containerStyles}>
      <TouchableOpacity
        style={styles.accountNameWrap}
        onPress={() => {
          AccountOverlay.showAccountList('innerPage', item => setAccount(item));
        }}>
        <TextXL>{account?.accountName}</TextXL>
        {accountList?.length && accountList?.length > 1 && (
          <Svg icon="down-arrow" size={pTd(16)} iconStyle={styles.svgStyle} />
        )}
      </TouchableOpacity>

      <TextM style={styles.tips}>{t('Scan the QR code to receive')}</TextM>
      <AccountCard account={account} style={styles.accountCardStyle} />

      <View style={styles.buttonWrap}>
        <TouchableOpacity
          style={styles.buttonTop}
          onPress={async () => {
            const isCopy = await setStringAsync(addressShow);
            isCopy && CommonToast.success(t('Copy Success'));
          }}>
          <Svg icon="copy" size={pTd(20)} color={defaultColors.font2} />
        </TouchableOpacity>
        <TextM style={styles.buttonText}>{t('Copy Success')}</TextM>
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  containerStyles: {
    backgroundColor: defaultColors.bg4,
  },
  accountNameWrap: {
    width: '100%',
    height: pTd(22),
    marginTop: pTd(48),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountName: {
    color: defaultColors.font5,
    fontSize: pTd(18),
  },
  svgStyle: {
    marginLeft: pTd(8),
  },
  tips: {
    marginTop: pTd(8),
    color: defaultColors.font3,
    textAlign: 'center',
  },
  accountCardStyle: {
    marginTop: pTd(40),
    width: pTd(280),
    alignItems: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  buttonWrap: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  buttonTop: {
    marginTop: pTd(40),
    width: pTd(48),
    height: pTd(48),
    borderRadius: pTd(48),
    backgroundColor: defaultColors.bg5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: defaultColors.font4,
    textAlign: 'center',
    marginTop: pTd(4),
    fontSize: pTd(14),
    lineHeight: pTd(20),
  },
});
