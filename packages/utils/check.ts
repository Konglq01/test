import { isValidEmail } from './reg';
export enum EmailError {
  noEmail = 'Please enter email address',
  invalidEmail = 'Invalid email address',
  alreadyRegistered = 'This address is already registered',
  noAccount = 'Failed to log in with this email. Please use your login account.',
}

export function checkEmail(email?: string) {
  if (!email) return EmailError.noEmail;
  if (!isValidEmail(email)) return EmailError.invalidEmail;
}

export function checkHolderError(message?: string) {
  if (message?.includes('Not found ca_hash')) return EmailError.noAccount;
  if (message?.includes('not exit')) return EmailError.noAccount;
  return message;
}
