import { defaultColors } from 'assets/theme';
import { StyleSheet } from 'react-native';
import { pTd } from 'utils/unit';
import { windowHeight } from '@portkey-wallet/utils/mobile/device';

const styles = StyleSheet.create({
  overlayWrap: {
    height: windowHeight - pTd(68),
  },
  titleWrap: {
    paddingHorizontal: pTd(16),
    marginBottom: pTd(8),
  },
  titleLabel: {
    textAlign: 'center',
    marginVertical: pTd(16),
  },
  titleInputWrap: {
    height: pTd(44),
  },
  titleInput: {
    fontSize: pTd(14),
  },
  itemRow: {
    height: pTd(72),
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemContent: {
    flex: 1,
    marginLeft: pTd(12),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: defaultColors.border6,
    height: pTd(72),
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIcon: {
    position: 'absolute',
    right: 26,
  },
  noResult: {
    lineHeight: pTd(22),
    textAlign: 'center',
    marginVertical: pTd(60),
    color: defaultColors.font7,
  },
});

export default styles;
