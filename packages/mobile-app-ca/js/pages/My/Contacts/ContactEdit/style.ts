import { StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import GStyles from 'assets/theme/GStyles';

const { error1, bg4, font5 } = defaultColors;

export const pageStyles = StyleSheet.create({
  pageWrap: {
    flex: 1,
    backgroundColor: bg4,
    ...GStyles.paddingArg(24, 16, 20),
  },
  addAddressBtn: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: pTd(110),
  },
  nameInputStyle: {
    color: font5,
    fontSize: pTd(14),
  },
  nameLableStyle: {
    marginLeft: pTd(4),
  },
  deleteTitle: {
    color: error1,
  },
});
