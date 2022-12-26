import { StyleSheet } from 'react-native';
import GStyles from 'assets/theme/GStyles';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import gSTyles from 'assets/theme/GStyles';

const { font5, border6, font3, font7, font2, bgColor, bg5 } = defaultColors;

export const pageStyles = StyleSheet.create({
  pageWrap: {
    flex: 1,
    backgroundColor: bgColor,
    ...gSTyles.paddingArg(0),
  },
  inputWrap: {
    backgroundColor: bg5,
    ...GStyles.paddingArg(0, 16, 16),
  },
  listWrapper: {
    flex: 1,
  },
  itemWrap: {
    height: pTd(73),
    width: '100%',
    ...gSTyles.paddingArg(16, 16, 18),
    display: 'flex',
    justifyContent: 'space-between',
    borderBottomColor: border6,
    borderBottomWidth: pTd(0.5),
  },
  itemTitle: {
    color: font5,
    fontSize: pTd(14),
    lineHeight: pTd(20),
  },
  itemAddress: {
    color: font3,
    fontSize: pTd(10),
  },
  noResult: {
    fontSize: pTd(14),
    width: '100%',
    marginTop: pTd(40),
    textAlign: 'center',
    color: font7,
  },
  addButtonWrap: {
    width: '100%',
    height: pTd(40),
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  addButton: {
    marginBottom: pTd(81),
    borderRadius: pTd(4),
    color: font2,
    backgroundColor: bg5,
    height: pTd(40),
    fontSize: pTd(14),
  },
  addIconWrap: {
    paddingRight: pTd(8),
  },
  addText: {
    marginLeft: pTd(8),
    color: font2,
  },
  addButtonTitleStyle: {
    fontSize: pTd(14),
  },
});
