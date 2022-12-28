export default {
  sendRegisterVerificationCode: '/api/app/account/register/sendVerificationRequest',
  sendRecoveryVerificationCode: '/api/app/account/recovery/sendVerificationRequest',
  checkRegisterVerificationCode: '/api/app/account/register/verifyCode',
  loginGuardianTypeCheck: '/api/app/account/loginGuardianTypeCheck',
  getVerifierList: '/api/app/getVerifiers',
  getAccountVerifierList: '',
} as const;
