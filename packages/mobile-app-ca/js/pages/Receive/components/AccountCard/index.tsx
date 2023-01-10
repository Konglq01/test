import { useCurrentNetwork } from '@portkey/hooks/network';
import { AccountType } from '@portkey/types/wallet';
import { addressFormat } from '@portkey/utils';
import { ScreenWidth } from '@rneui/base';
import { defaultColors } from 'assets/theme';
import { TextM } from 'components/CommonText';
import CommonToast from 'components/CommonToast';
import Svg from 'components/Svg';
import { setStringAsync } from 'expo-clipboard';
import i18n from 'i18n';
import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { pTd } from 'utils/unit';

const cardWidth = ScreenWidth * 0.63;

const info = {
  chainId: 'ELF',
  tokenSymbol: 'xxx',
  caAddress: 'xxxx',
  networkType: 'MAIN',
};

export default function AccountCard({ account, style }: { account: AccountType; style?: StyleProp<ViewStyle> }) {
  const { chainType, chainId } = useCurrentNetwork();
  const address = addressFormat(account.address, chainId, chainType);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.logoBox}>
        <Svg size={ScreenWidth * 0.13} icon="logo-icon" color={defaultColors.font9} />
      </View>
      <QRCode size={cardWidth} value={JSON.stringify(info)} />
      <TextM
        onPress={async () => {
          const isCopy = await setStringAsync(account.address);
          isCopy && CommonToast.success(i18n.t('Copy Success'));
        }}
        style={styles.textStyle}>
        {address}
      </TextM>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    margin: pTd(10),
    backgroundColor: defaultColors.bg1,
    padding: pTd(16),
    borderRadius: pTd(12),
    // Shadow
    shadowColor: defaultColors.shadow1,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2,
  },
  textStyle: {
    marginTop: pTd(10),
    width: cardWidth,
    fontSize: 14,
    color: defaultColors.font3,
  },
  logoBox: {
    position: 'absolute',
    zIndex: 99,
    padding: pTd(14),
    borderRadius: pTd(4),
    backgroundColor: defaultColors.bg1,
    alignSelf: 'center',
    top: ScreenWidth * 0.27,
  },
});
