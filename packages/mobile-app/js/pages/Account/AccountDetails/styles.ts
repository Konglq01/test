import { defaultColors } from 'assets/theme';
import { StyleSheet } from 'react-native';
import { screenWidth } from 'utils/device';
import { pTd } from 'utils/unit';

const styles = StyleSheet.create({
  closeBox: {
    padding: 5,
  },
  containerStyle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountRow: {},
  accountNameText: {
    marginRight: pTd(4),
    width: screenWidth * 0.63,
    overflow: 'hidden',
    textAlign: 'center',
  },
  inputStyle: {
    // textAlign: 'center',
    fontSize: pTd(16),
  },
  inputContainerStyle: {
    height: pTd(40),
  },
  accountContainerStyle: {
    height: pTd(40),
  },
  editRow: {
    marginTop: 61,
    marginBottom: 14,
    alignItems: 'center',
  },
  inputRow: {
    position: 'relative',
    width: screenWidth * 0.67,
  },
  finishBox: {
    height: pTd(40),
    position: 'absolute',
    right: pTd(-32),
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomBox: {
    width: '100%',
  },
  removeTitleStyle: {
    color: defaultColors.error,
  },
});

export default styles;
