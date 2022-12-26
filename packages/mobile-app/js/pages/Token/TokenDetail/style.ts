import { StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import GStyles from 'assets/theme/GStyles';

const { bg1, bg4, font3, font5, font7 } = defaultColors;

export const styles = StyleSheet.create({
  pageWrap: {
    backgroundColor: bg1,
    ...GStyles.paddingArg(0),
  },
  card: {
    backgroundColor: bg4,
    height: pTd(316),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  tokenImage: {
    marginTop: pTd(40),
  },
  tokenBalance: {
    marginTop: pTd(16),
    color: font5,
    fontWeight: 'bold',
    fontSize: pTd(28),
    lineHeight: pTd(28),
  },
  dollarBalance: {
    marginTop: pTd(4),
    color: font3,
    fontSize: pTd(14),
    lineHeight: pTd(20),
  },
  buttonGroupWrap: {
    marginTop: pTd(40),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  space: {
    width: pTd(50),
  },
  transferWrap: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultWrap: {
    backgroundColor: bg1,
  },
  noResultText: {
    textAlign: 'center',
    marginTop: pTd(8),
    color: font7,
    fontSize: pTd(16),
    lineHeight: pTd(22),
  },
  listWrap: {
    backgroundColor: defaultColors.bg1,
  },
});
