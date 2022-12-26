export default {
  sendRegisterVerificationCode: '/api/app/account/register/sendVerificationRequest',
  checkRegisterVerificationCode: '/api/app/account/register/verifyCode',
  loginGuardianTypeCheck: '/api/app/account/loginGuardianTypeCheck',
  getVerifierList: '/api/app/getVerifiers',
  getAccountVerifierList: '',
} as const;
