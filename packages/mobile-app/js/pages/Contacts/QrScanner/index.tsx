import React from 'react';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import navigationService from 'utils/navigationService';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import { defaultColors } from 'assets/theme';
import { ScreenWidth } from '@rneui/base';
import { useLanguage } from 'i18n/hooks';

interface QrScannerProps {
  route?: any;
  onScanFinish?: () => void;
}

const QrScanner: React.FC<QrScannerProps> = ({ route }) => {
  const { t } = useLanguage();
  const { params } = route;
  const fromSendPage = !!params?.fromSendPage;

  const handleBarCodeScanned = ({ type = '', data = '' }) => {
    console.log(type);

    if (typeof data === 'string') {
      navigationService.navigate(fromSendPage ? 'SendHome' : 'ContactsDetail', { address: data });
    }
  };

  // TODO: test ui in Mason's Phone
  return (
    <View style={PageStyle.wrapper}>
      <BarCodeScanner style={PageStyle.barCodeScanner} onBarCodeScanned={handleBarCodeScanned}>
        <SafeAreaView style={PageStyle.innerView}>
          <TouchableOpacity
            style={PageStyle.iconWrap}
            onPress={() => {
              navigationService.goBack();
            }}>
            <Svg icon="close1" size={pTd(14)} iconStyle={PageStyle.icon} />
          </TouchableOpacity>
          <Svg icon="scan-frame" size={pTd(240)} iconStyle={PageStyle.scan} />
          <Text style={PageStyle.title}>{t('Scan QR code')}</Text>
          <Text style={PageStyle.tips}>
            {t('Please place the QR code of the receiving address in front of the camera')}
          </Text>
        </SafeAreaView>
      </BarCodeScanner>
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
    fontSize: pTd(12),
    color: defaultColors.font7,
    textAlign: 'center',
    width: ScreenWidth * 0.76,
    marginTop: pTd(8),
    marginLeft: 'auto',
    marginRight: 'auto',
    lineHeight: pTd(16),
  },
});
