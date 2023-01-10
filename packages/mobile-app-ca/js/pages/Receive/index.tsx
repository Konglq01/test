import React, { useMemo, useState } from 'react';
import PageContainer from 'components/PageContainer';
import { TextL, TextM, TextXL, TextS } from 'components/CommonText';
import { useAppCASelector } from '@portkey/hooks';
import { AccountType } from '@portkey/types/wallet';
import { setStringAsync } from 'expo-clipboard';
import CommonToast from 'components/CommonToast';
import AccountCard from 'pages/Receive/components/AccountCard';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { pTd } from 'utils/unit';
import { useWallet } from 'hooks/store';
import Svg from 'components/Svg';
import { defaultColors } from 'assets/theme';
import { useLanguage } from 'i18n/hooks';
import CommonAvatar from 'components/CommonAvatar';
import GStyles from 'assets/theme/GStyles';

export default function Receive() {
  const { t } = useLanguage();
  const { currentChain } = useAppCASelector(state => state.chain);

  const [account, setAccount] = useState<AccountType>({
    address: 'ELFSASA',
  } as AccountType);

  const addressShow = useMemo(() => {
    if (account?.address.match(/^ELF_.+_AELF$/g)) return account?.address || '';
    if (currentChain?.chainType === 'aelf') return `ELF_${account?.address || ''}_AELF`;
    return account?.address;
  }, [account?.address, currentChain.chainType]);

  return (
    <PageContainer titleDom={t('Receive')} safeAreaColor={['blue', 'gray']} containerStyles={styles.containerStyles}>
      <TextXL style={styles.tips}>{t('You can provide QR code to receive')}</TextXL>
      <View style={styles.topWrap}>
        <CommonAvatar title={'ELF'} svgName={'aelf-avatar'} avatarSize={pTd(32)} style={styles.svgStyle} />
        <View>
          <TextL>ELF</TextL>
          <TextS>MainChain AELF</TextS>
        </View>
      </View>
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
        <TextM style={styles.buttonText}>{t('Copy')}</TextM>
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  containerStyles: {
    backgroundColor: defaultColors.bg4,
  },
  tips: {
    marginTop: pTd(49),
    width: '100%',
    color: defaultColors.font5,
    textAlign: 'center',
  },
  topWrap: {
    ...GStyles.flexRow,
    marginTop: pTd(20),
    height: pTd(38),
    justifyContent: 'center',
    alignItems: 'center',
  },
  svgStyle: {
    marginRight: pTd(8),
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
