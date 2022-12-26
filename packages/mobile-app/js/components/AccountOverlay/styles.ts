import { defaultColors } from 'assets/theme';
import { StyleSheet } from 'react-native';
import { screenHeight, screenWidth, windowHeight } from 'utils/device';
import { pTd } from 'utils/unit';

export const styles = StyleSheet.create({
  tips: {
    marginBottom: pTd(10),
  },
  // bottom
  bottomBox: {
    overflow: 'hidden',
    borderTopLeftRadius: pTd(8),
    borderTopRightRadius: pTd(8),
    width: screenWidth,
    backgroundColor: defaultColors.bg1,
    maxHeight: screenHeight * 0.6,
    marginBottom: 20,
  },
  centerBox: {
    maxHeight: windowHeight * 0.7,
    maxWidth: 500,
    width: screenWidth - 48,
    backgroundColor: defaultColors.bg1,
    borderRadius: pTd(8),
    padding: pTd(24),
  },
  accountRow: {
    backgroundColor: defaultColors.bg4,
    padding: pTd(16),
    marginTop: 8,
  },
  addressText: {
    marginTop: 8,
    color: defaultColors.font3,
  },
  replaceTip: {
    marginTop: 16,
    color: defaultColors.font3,
    marginBottom: pTd(12),
  },
  //account list
  headerRow: {
    paddingTop: 14,
    paddingBottom: 7,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: defaultColors.border6,
  },
  headerIcon: {
    height: 5,
    borderRadius: 3,
    backgroundColor: defaultColors.bg7,
    width: '13%',
  },
  listButtonContainerStyle: {
    borderTopWidth: 1,
    borderTopColor: defaultColors.border6,
  },
  listButtonStyle: {
    height: 56,
  },
  listButtonTitleStyle: {
    fontSize: pTd(14),
  },
});
