import { StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import { windowHeight } from 'utils/device';

console.log('windowHeight', windowHeight);

const { error1, font3, bg4, font5, bg1 } = defaultColors;

export const pageStyles = StyleSheet.create({
  pageWrap: {
    flex: 1,
    backgroundColor: bg4,
  },
  viewWrap: {
    height: windowHeight - pTd(100),
  },
  inputsWrap: {
    width: '100%',
    marginTop: pTd(24),
  },
  nameInputStyle: {
    color: font5,
    fontSize: pTd(14),
  },
  scanIconWrap: {
    marginTop: pTd(2),
    marginRight: pTd(8),
    width: pTd(16),
    height: pTd(16),
  },
  whiteSpaceView: {
    width: pTd(10),
  },
  barCodeScanner: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 100,
    backgroundColor: bg1,
  },
  tips: {
    marginTop: pTd(12),
    width: '100%',
    height: pTd(40),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  tipsItem: {
    textAlign: 'left',
    color: font3,
  },
  buttonWrap: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: pTd(37),
    backgroundColor: bg4,
  },
  deleteButton: {
    marginTop: pTd(8),
    height: pTd(48),
    fontSize: pTd(16),
    lineHeight: pTd(48),
    width: '100%',
    textAlign: 'center',
  },
  deleteTitle: {
    color: error1,
  },
});
