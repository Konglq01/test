import { useCurrentNetwork } from '@portkey-wallet/hooks/network';
import { ScreenWidth } from '@rneui/base';
import { defaultColors } from 'assets/theme';
import { TextM } from 'components/CommonText';
import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import QRCodeStyled from 'react-native-qrcode-styled';

import portkeyLogo from 'assets/image/pngs/portkeyBlack.png';

import { pTd } from 'utils/unit';
import { TokenItemShowType } from '@portkey-wallet/types/types-ca/token';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { shrinkSendQrData, QRCodeDataObjType, QrCodeDataArrType } from '@portkey-wallet/utils/qrCode';

const cardWidth = ScreenWidth * 0.63;

export default function AccountCard({
  tokenInfo,
  toCaAddress,
  style,
}: {
  tokenInfo: TokenItemShowType;
  toCaAddress: string;
  style?: StyleProp<ViewStyle>;
}) {
  const { chainType } = useCurrentNetwork();
  // const address = addressFormat(account.address, chainId, chainType);

  const currentNetWork = useCurrentNetworkInfo();

  const info: QRCodeDataObjType = {
    address: toCaAddress,
    netWorkType: currentNetWork.networkType,
    chainType,
    type: 'send',
    toInfo: {
      name: '',
      address: toCaAddress,
    },
    assetInfo: {
      symbol: tokenInfo?.symbol,
      tokenContractAddress: tokenInfo?.tokenContractAddress || tokenInfo?.address,
      chainId: tokenInfo?.chainId,
      decimals: tokenInfo?.decimals || 0,
    },
  };

  return (
    <View style={[styles.container, style]}>
      {/* <View style={styles.logoBox}>
        <Svg size={ScreenWidth * 0.08} icon="logo-icon" color={defaultColors.font9} />
      </View> */}

      <QRCodeStyled
        data={JSON.stringify(shrinkSendQrData(info))}
        padding={0}
        pieceSize={5}
        pieceBorderRadius={1}
        color={'#F57F17'}
        logo={{
          href: portkeyLogo,
          scale: 4.0,
          padding: pTd(6),
        }}
        gradient={{
          type: 'radial',
          options: {
            center: [0.5, 0.5],
            radius: [1, 1],
            colors: ['#ff7bc6', '#0f0080'],
            locations: [0, 1],
          },
        }}
        outerEyesOptions={{
          topLeft: {
            borderRadius: [20, 20, 0, 20],
          },
          topRight: {
            borderRadius: [20, 20, 20],
          },
          bottomLeft: {
            borderRadius: [20, 0, 20, 20],
          },
        }}
      />

      <TextM style={styles.textStyle}>{toCaAddress}</TextM>
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
    padding: pTd(6),
    borderRadius: pTd(6),
    backgroundColor: defaultColors.bg1,
    alignSelf: 'center',
    top: ScreenWidth * 0.3,
  },
});
