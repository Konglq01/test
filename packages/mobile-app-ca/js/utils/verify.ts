// import reduxUtils from './redux';
import VerifyPassword from 'components/VerifyPassword';
const payShow = (callBack?: (v: boolean) => void) => {
  // const { wallet } = reduxUtils.getState() || {};
  // const { biometrics, payPw } = settings || {};
  VerifyPassword.payShow(callBack);
};
export default {
  payShow,
};
