import { StyleSheet } from 'react-native';
import { pTd } from 'utils/unit';
import { defaultColors } from 'assets/theme';

const { font2, font4 } = defaultColors;

export const dashBoardBtnStyle = StyleSheet.create({
  buttonWrap: {
    color: font2,
    marginBottom: pTd(24),
  },
  titleStyle: {
    marginTop: pTd(2),
    textAlign: 'center',
    color: font2,
    fontSize: pTd(14),
    lineHeight: pTd(20),
  },
});

export const innerPageStyles = StyleSheet.create({
  buttonWrap: {
    color: font4,
    marginBottom: pTd(24),
  },
  titleStyle: {
    marginTop: pTd(2),
    textAlign: 'center',
    color: font4,
    fontSize: pTd(14),
    lineHeight: pTd(20),
  },
});

export default dashBoardBtnStyle;
