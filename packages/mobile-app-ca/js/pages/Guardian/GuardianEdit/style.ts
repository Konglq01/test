import { StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import GStyles from 'assets/theme/GStyles';
import { windowHeight } from '@portkey-wallet/utils/mobile/device';

const { font3, bg4, error } = defaultColors;

export const pageStyles = StyleSheet.create({
  pageWrap: {
    flex: 1,
    backgroundColor: bg4,
    justifyContent: 'space-between',
    ...GStyles.paddingArg(24, 20, 18),
    minHeight: windowHeight - pTd(100),
  },
  contentWrap: {
    flex: 1,
  },
  titleLabel: {
    color: font3,
    lineHeight: pTd(20),
  },
  titleTextStyle: {
    fontSize: pTd(14),
  },
  errorTips: {
    color: error,
  },
});
