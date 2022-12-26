import { isValidEmail } from './reg';
export enum EmailError {
  noEmail = 'Please enter Email address',
  invalidEmail = 'Invalid email address',
  alreadyRegistered = 'This address is already registered',
}

export function checkEmail(email?: string) {
  if (!email) return EmailError.noEmail;
  if (!isValidEmail(email)) return EmailError.invalidEmail;
}
