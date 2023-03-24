import { screenHeight, screenWidth, windowHeight } from '@portkey-wallet/utils/mobile/device';
import { StyleSheet } from 'react-native';
import { pTd } from 'utils/unit';

const styles = StyleSheet.create({
  backgroundContainer: {
    height: screenHeight,
  },
  containerStyles: {
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  logoIconStyle: {
    marginTop: 0,
  },
  titleStyle: {
    marginTop: pTd(12),
  },
  card: {
    flex: 1,
    width: screenWidth - 32,
    borderRadius: 16,
    marginTop: 32,
    paddingHorizontal: 20,
    paddingVertical: 24,
    minHeight: Math.min(screenHeight * 0.58, 494),
  },
  inputContainerStyle: {
    marginTop: 8,
    flex: 1,
  },
  viewContainer: {
    minHeight: windowHeight - pTd(160),
  },
  iconBox: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  iconStyle: {
    width: 60,
    height: 60,
  },
  signUpTip: {
    position: 'absolute',
    bottom: 80,
  },
  termsServiceTip: {
    position: 'absolute',
    bottom: 24,
  },
  qrCodeTitle: {
    marginTop: 18,
    marginBottom: 8,
  },
  qrCodeBox: {
    marginTop: 48,
  },
  loading: {
    top: 0,
    position: 'absolute',
    width: 250,
    height: 250,
    backgroundColor: '#ffffffee',
    zIndex: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  networkRow: {
    marginTop: 24,
  },
  networkTip: {
    marginRight: pTd(8),
  },
});
export default styles;
