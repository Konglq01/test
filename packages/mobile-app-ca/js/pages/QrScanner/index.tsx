import React, { useCallback, useState } from 'react';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import navigationService from 'utils/navigationService';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import { defaultColors } from 'assets/theme';
import { ScreenWidth } from '@rneui/base';
import { useLanguage } from 'i18n/hooks';
import { useWallet } from 'hooks/store';
import { handleQRCodeData, invalidQRCode, RouteInfoType } from 'utils/qrcode';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

// import { useAppCASelector } from '@portkey/hooks';

interface QrScannerProps {
  route?: any;
  type?: 'login' | 'send';
}

const QrScanner: React.FC<QrScannerProps> = () => {
  const { t } = useLanguage();
  const { currentNetwork } = useWallet();
  const navigation = useNavigation();
  const routesArr: RouteInfoType[] = navigation.getState().routes;
  const previousRouteInfo = routesArr[routesArr.length - 2];
  console.log(previousRouteInfo, '=====previousRouteInfo');

  const [refresh, setRefresh] = useState<boolean>();
  useFocusEffect(
    useCallback(() => {
      setRefresh(false);
    }, []),
  );

  const handleBarCodeScanned = useCallback(
    ({ data = '' }) => {
      try {
        if (typeof data === 'string') {
          const qrCodeData = JSON.parse(data);
          // if not currentNetwork

          if (currentNetwork !== qrCodeData.netWorkType) return invalidQRCode();
          handleQRCodeData(qrCodeData, previousRouteInfo, setRefresh);
        }
      } catch (error) {
        console.log(error);
      }
    },
    [currentNetwork, previousRouteInfo],
  );

  // TODO: test ui in Mason's Phone
  return (
    <View style={PageStyle.wrapper}>
      {refresh ? null : (
        <BarCodeScanner style={PageStyle.barCodeScanner} onBarCodeScanned={handleBarCodeScanned}>
          <SafeAreaView style={PageStyle.innerView}>
            <View style={PageStyle.iconWrap}>
              <Text style={PageStyle.leftBlock} />
              <TouchableOpacity
                onPress={() => {
                  navigationService.goBack();
                }}>
                <Svg icon="close1" size={pTd(14)} iconStyle={PageStyle.icon} />
              </TouchableOpacity>
            </View>
            {/* <Svg icon="scan-frame" size={pTd(240)} iconStyle={PageStyle.scan} /> */}
            {/* <Text style={PageStyle.title}>{t('Scan QR code')}</Text> */}
            <Text style={PageStyle.tips}>{t('Receive code / Login code')}</Text>
          </SafeAreaView>
        </BarCodeScanner>
      )}
    </View>
  );
};

export default QrScanner;

export const PageStyle = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: '100%',
  },
  barCodeScanner: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 100,
  },
  innerView: {
    width: '100%',
    height: '100%',
  },
  iconWrap: {
    width: '100%',
    height: pTd(50),
    marginRight: pTd(25),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  icon: {
    width: pTd(40),
    marginRight: pTd(25),
  },
  scan: {
    marginTop: pTd(142),
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  title: {
    marginTop: pTd(62),
    fontSize: pTd(16),
    color: defaultColors.font2,
    textAlign: 'center',
  },
  tips: {
    position: 'absolute',
    bottom: 100,
    fontSize: pTd(12),
    color: defaultColors.font7,
    textAlign: 'center',
    width: ScreenWidth,
    lineHeight: pTd(16),
  },
  leftBlock: {
    flex: 1,
  },
});
