import { loginSlice } from './slice';
import { setLoginAccountAction, setWalletInfoAction, resetLoginInfoAction, setRegisterVerifierAction } from './actions';
import { doExpression } from '@babel/types';

const reducer = loginSlice.reducer;

describe('setLoginAccountAction', () => {
  test('set loginAccount', () => {
    expect(
      reducer(
        {},
        setLoginAccountAction({
          guardianAccount: 'x@q.com',
          loginType: 0,
        }),
      ),
    ).toEqual({
      loginAccount: {
        guardianAccount: 'x@q.com',
        loginType: 0,
      },
    });
  });
});

describe('setWalletInfoAction', () => {
  const params = {
    walletInfo: {
      guardianAccount: 'x@q.com',
      loginType: 0,
    },
    caWalletInfo: {
      guardianAccount: 'x@q.com',
      loginType: 0,
    },
  };
  test('set scanWalletInfo scanCaWalletInfo', () => {
    // expect(reducer({}, setWalletInfoAction(params))).toEqual()
  });
});
