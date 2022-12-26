/* eslint-disable no-useless-escape */
const protocolAndDomainRE = /^(?:\w+:)?\/\/(\S+)$/;
const localhostDomainRE = /^localhost[\:?\d]*(?:[^\:?\d]\S*)?$/;
const nonLocalhostDomainRE = /^[^\s\.]+\.\S{2,}$/;

export function isUrl(string: string) {
  if (typeof string !== 'string') {
    return false;
  }

  const match = string.match(protocolAndDomainRE);
  if (!match) {
    return false;
  }

  const everythingAfterProtocol = match[1];
  if (!everythingAfterProtocol) {
    return false;
  }

  if (localhostDomainRE.test(everythingAfterProtocol) || nonLocalhostDomainRE.test(everythingAfterProtocol)) {
    return true;
  }

  return false;
}

const SYMBOL_REG = /^[A-Za-z0-9]+$/;
export function isSymbol(symbol: string) {
  return SYMBOL_REG.test(symbol);
}

const P_N_REG = /^[0-9]+.?[0-9]*$/;

export function isValidNumber(n: string) {
  if (n.includes('-')) return false;
  return P_N_REG.test(n);
}

const PASSWORD_REG = /^[a-zA-Z\d! ~@#_^*%/.+:;=\\|，'~{}[\]]{8,16}$/;

const WALLET_REG = /^[a-zA-Z\d! ~@#_^*%/.+:;=\\|，'~{}[\]]{1,30}$/;

const CA_WALLET_REG = /^[a-zA-Z\d _]{1,16}$/;

export function isValidPassword(password?: string) {
  if (!password) return false;
  return PASSWORD_REG.test(password);
}

export function isValidWalletName(walletName?: string) {
  if (!walletName) return false;
  return WALLET_REG.test(walletName);
}

export function isValidCAWalletName(walletName?: string) {
  if (!walletName) return false;
  return CA_WALLET_REG.test(walletName);
}

export const EmailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

export function isValidEmail(email?: string) {
  if (!email) return false;
  return EmailReg.test(email);
}

export const POSITIVE_INTEGER = /^\+?[1-9][0-9]*$/;

export function isValidPositiveInteger(num?: string) {
  if (!num) return false;
  return POSITIVE_INTEGER.test(num);
}
