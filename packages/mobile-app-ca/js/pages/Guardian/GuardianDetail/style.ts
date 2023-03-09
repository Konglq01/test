import { StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import GStyles from 'assets/theme/GStyles';

const { font3, bg1, bg4, border6 } = defaultColors;

export const pageStyles = StyleSheet.create({
  pageWrap: {
    flex: 1,
    backgroundColor: bg4,
    justifyContent: 'space-between',
    ...GStyles.paddingArg(24, 20, 18),
  },
  contentWrap: {
    flex: 1,
  },
  guardianInfoWrap: {
    backgroundColor: bg1,
    paddingHorizontal: pTd(16),
    marginBottom: pTd(24),
    borderRadius: pTd(6),
  },
  guardianTypeWrap: {
    height: pTd(56),
    justifyContent: 'center',
  },
  verifierInfoWrap: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: border6,
    height: pTd(56),
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginSwitchWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: pTd(16),
    backgroundColor: bg1,
    marginBottom: pTd(24),
    height: pTd(56),
    alignItems: 'center',
    borderRadius: pTd(6),
  },
  tips: {
    color: font3,
    lineHeight: pTd(20),
  },
});
