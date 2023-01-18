import { StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme/index';
import { pTd } from 'utils/unit';

const { font4, font2, primaryColor, bg5, bg6 } = defaultColors;

export const styles = StyleSheet.create({
  buttonStyle: {
    borderWidth: pTd(1),
    height: pTd(48),
    backgroundColor: bg6,
  },
  titleStyle: {
    color: font4,
    fontSize: pTd(16),
  },
  solidButtonStyle: {
    backgroundColor: bg5,
    borderColor: bg5,
  },
  solidTitleStyle: {
    color: font2,
  },
  outlineTitleStyle: {
    color: font2,
  },
  outlineButtonStyle: {
    backgroundColor: 'transparent',
  },
  primaryButtonStyle: {
    backgroundColor: primaryColor,
  },
  primaryTitleStyle: {
    color: font2,
  },
  disabledStyle: {
    opacity: 0.4,
  },
  disabledTitleStyle: {
    color: font2,
  },
  clearButtonStyle: {
    borderWidth: 0,
  },
});
