export default {
  sendRegisterVerificationCode: '/api/app/account/register/sendVerificationRequest',
  sendRecoveryVerificationCode: '/api/app/account/recovery/sendVerificationRequest',
  checkRegisterVerificationCode: '/api/app/account/register/verifyCode',
  checkRecoveryVerificationCode: '/api/app/account/recovery/verifyCode',
  loginGuardianTypeCheck: '/api/app/account/loginGuardianTypeCheck',
  getAccountVerifierList: '',
} as const;
