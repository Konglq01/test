import { StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import { screenWidth } from 'utils/device';

const { bg5, font2 } = defaultColors;

export const styles = StyleSheet.create({
  cardWrap: {
    backgroundColor: bg5,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshWrap: {
    marginTop: pTd(8),
    width: screenWidth,
    display: 'flex',
    flexDirection: 'row',
    paddingRight: pTd(16),
    justifyContent: 'flex-end',
  },
  usdtBalance: {
    marginTop: pTd(13),
    fontSize: pTd(28),
    color: font2,
  },
  accountName: {
    color: font2,
    opacity: 0.8,
    lineHeight: pTd(20),
    marginTop: pTd(4),
  },
  buttonGroupWrap: {
    marginTop: pTd(24),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  space: {
    width: pTd(50),
  },
});
