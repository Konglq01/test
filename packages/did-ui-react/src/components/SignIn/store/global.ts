import { LoginType } from '@portkey/types/types-ca/wallet';

const initState = {
  network: 'TESTNET',
  loginType: LoginType.email,
};

interface GlobalState {
  network: string;
  loginType: LoginType;
}

class Global {
  state: GlobalState;

  constructor(state: GlobalState = initState) {
    this.state = state;
  }

  getState = (key: keyof GlobalState) => {
    return this.state?.[key];
  };

  setState = (key: keyof GlobalState, value: GlobalState[keyof GlobalState]) => {
    // if (this.state[key]) return (this.state[key] = value);
    this.state = {
      ...this.state,
      [key]: value,
    };
  };
}

export const globalState = new Global();
