import { StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme/index';
import GStyles from 'assets/theme/GStyles';
import { pTd } from 'utils/unit';

const { font3, font5, error, bg1, border4 } = defaultColors;

export const generalStyles = StyleSheet.create({
  containerStyle: {
    ...GStyles.paddingArg(0),
    ...GStyles.marginArg(0),
    height: pTd(48),
  },
  labelStyle: {
    color: font3,
    paddingLeft: pTd(8),
    lineHeight: pTd(20),
    marginBottom: pTd(8),
    fontWeight: '400',
  },
  outerWrap: {
    height: pTd(56),
    position: 'relative',
    borderRadius: pTd(6),
    overflow: 'hidden',
    borderWidth: 0,
  },
  inputContainerStyle: {
    overflow: 'hidden',
    height: pTd(56),
    borderRadius: pTd(4),
    borderColor: 'white', // how to delete bottom border?
    backgroundColor: bg1,
  },
  inputStyle: {
    color: 'font5',
    fontSize: pTd(14),
    minHeight: pTd(60),
    ...GStyles.marginArg(14, 5, 14, 70),
  },
  rightIconContainerStyle: {
    paddingRight: pTd(60),
  },
  commonFix: {
    zIndex: 100,
    position: 'absolute',
    width: pTd(56),
    height: pTd(56),
    paddingTop: pTd(18),
    paddingBottom: pTd(18),
    fontSize: pTd(14),
    lineHeight: pTd(20),
    textAlign: 'center',
    color: font5,
  },
  prefix: {
    left: 0,
    top: 0,
  },
  suffix: {
    right: 0,
    top: 0,
  },
  commonDivider: {
    zIndex: 100,
    position: 'absolute',

    height: pTd(56),
    width: pTd(1),
    backgroundColor: border4,
  },
  leftDivider: {
    left: pTd(56),
    top: 0,
  },
  rightDivider: {
    right: pTd(56),
    top: 0,
  },
  errorStyle: {
    marginTop: pTd(4),
    paddingLeft: pTd(8),
    color: error,
    fontSize: pTd(12),
    lineHeight: pTd(16),
  },
  disabledInputStyle: {
    color: font5,
    opacity: 1,
  },
});
