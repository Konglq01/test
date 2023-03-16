import { StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import GStyles from 'assets/theme/GStyles';

const { bg4 } = defaultColors;

export const pageStyles = StyleSheet.create({
  pageWrap: {
    flex: 1,
    backgroundColor: bg4,
    ...GStyles.paddingArg(0, 16, 18),
  },

  avatarWrap: {
    height: pTd(160),
    justifyContent: 'center',
    alignItems: 'center',
  },
  exitButton: {},
});
