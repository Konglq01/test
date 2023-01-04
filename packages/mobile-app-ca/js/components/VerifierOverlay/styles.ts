import { defaultColors } from 'assets/theme';
import { StyleSheet } from 'react-native';
import { screenWidth, windowHeight } from '@portkey/utils/mobile/device';
import { pTd } from 'utils/unit';

const styles = StyleSheet.create({
  centerBox: {
    maxHeight: windowHeight * 0.7,
    maxWidth: 500,
    width: screenWidth - 48,
    backgroundColor: defaultColors.bg1,
    borderRadius: pTd(8),
    padding: pTd(24),
  },
  itemRow: {
    paddingVertical: 20,
    paddingHorizontal: pTd(24),
    borderBottomWidth: 1,
    borderBottomColor: defaultColors.border4,
  },
  itemName: {
    marginLeft: 12,
  },
  itemIcon: {
    position: 'absolute',
    right: 26,
  },
  iconStyle: {
    height: 36,
    width: 36,
    borderRadius: 18,
  },
});

export default styles;
