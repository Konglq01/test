import { defaultColors } from 'assets/theme';
import { StyleSheet } from 'react-native';
import { pTd } from 'utils/unit';

const styles = StyleSheet.create({
  itemRow: {
    height: pTd(60),
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemContent: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: defaultColors.border6,
    height: pTd(60),
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIcon: {
    position: 'absolute',
    right: 26,
  },
  typeOverlayTitleLabel: {
    marginTop: pTd(16),
    marginBottom: pTd(8),
    textAlign: 'center',
  },
});

export default styles;
