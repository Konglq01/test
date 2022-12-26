import { defaultColors } from 'assets/theme';
import { StyleSheet } from 'react-native';
import { pTd } from 'utils/unit';

const styles = StyleSheet.create({
  container: {
    paddingTop: pTd(25),
    width: '90%',
    backgroundColor: 'white',
    alignSelf: 'center',
    borderRadius: pTd(10),
    alignItems: 'center',
  },
  loadingBox: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  style: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  containerStyle: {
    flex: 0,
  },
  buttonItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: defaultColors.border1,
    overflow: 'hidden',
  },
  rightButtonItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  buttonsBox: {
    height: 60,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: defaultColors.border1,
    overflow: 'hidden',
  },
  buttonText: {
    color: defaultColors.primaryColor,
    fontSize: 16,
  },
  cancelText: {
    color: defaultColors.font3,
    fontSize: 16,
  },
  leftTextStyle: {
    width: 80,
  },
  leftTitleBox: {
    width: '80%',
    marginVertical: pTd(20),
    marginBottom: pTd(15),
  },
  tips: {
    flex: 1,
    marginBottom: pTd(10),
  },
  inputTipStyle: {
    marginTop: pTd(5),
    alignSelf: 'flex-end',
    color: defaultColors.font4,
    marginRight: pTd(30),
  },
  pleasePayPwd: {
    flex: 1,
    textAlign: 'center',
  },
  pleasePayPwdBox: {
    flexDirection: 'row',
    paddingHorizontal: pTd(15),
    alignItems: 'center',
  },
  payTipsBox: {
    height: pTd(35),
    alignItems: 'center',
  },
});

export default styles;
