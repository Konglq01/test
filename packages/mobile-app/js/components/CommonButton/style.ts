import { StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme/index';
import { pTd } from 'utils/unit';

const { font4, font2, primaryColor, bg5 } = defaultColors;

export const styles = StyleSheet.create({
  buttonStyle: {
    borderWidth: pTd(1),
    height: pTd(48),
  },
  titleStyle: {
    color: font4,
    fontSize: pTd(16),
  },
  solidButtonStyle: {
    backgroundColor: bg5,
    width: pTd(343),
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
  disabledStyle: { opacity: 0.4 },
  disabledTitleStyle: {},
  clearButtonStyle: {
    borderWidth: 0,
  },
});
