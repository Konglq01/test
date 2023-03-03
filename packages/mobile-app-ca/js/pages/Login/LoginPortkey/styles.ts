import { screenHeight, screenWidth, windowHeight } from '@portkey-wallet/utils/mobile/device';
import { defaultColors } from 'assets/theme';
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
    marginTop: 44,
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
    paddingVertical: 32,
    minHeight: Math.min(screenHeight * 0.5, 416),
  },
  inputContainerStyle: {
    marginTop: 8,
  },
  viewContainer: {
    minHeight: windowHeight - pTd(160),
  },
  signUpbuttonStyle: {
    borderColor: defaultColors.primaryColor,
  },
  signUpTitleStyle: {
    color: defaultColors.primaryColor,
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
    bottom: 32,
    left: 20,
  },
  qrCodeTitle: {
    marginTop: 18,
    marginBottom: 8,
  },
  qrCodeBox: {
    marginTop: 32,
  },
  loading: {
    position: 'absolute',
    width: 200,
    height: 200,
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
