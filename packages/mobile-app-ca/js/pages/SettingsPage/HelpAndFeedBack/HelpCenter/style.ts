import { StyleSheet } from 'react-native';
import gStyles from 'assets/theme/GStyles';
const { marginArg, paddingArg } = gStyles;

export const PageStyle = StyleSheet.create({
  box: {
    // padding: pTd(20),
    backgroundColor: 'white',
  },
  bottomBox: {
    // padding: pTd(30),
    borderBottomWidth: 1,
    borderBottomColor: 'red',
    backgroundColor: 'white',
  },
  itemBox: {
    // marginBottom: pTd(20),
    borderBottomWidth: 0,
  },
  textMargin: {
    // marginLeft: pTd(20),
    // marginTop: pTd(40),
    // marginBottom: pTd(20),
    fontWeight: 'bold',
  },
  subtitleBox: {
    // height: pTd(60),
    borderBottomWidth: 1,
    // borderBottomColor: Colors.borderColor,
    overflow: 'hidden',
  },
  subtitleStyle: {
    // color: Colors.fontGray,
  },
  textStyle: {
    // marginTop: pTd(20),
    // color: Colors.fontGray,
  },
  detailsText: {
    flex: 1,
    // color: Colors.fontGray,
  },
  titleBox: {
    flexDirection: 'row',
    // marginBottom: pTd(10),
  },
  titleStyle: {
    flex: 1,
  },
});
