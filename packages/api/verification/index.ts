export default {
  sendRegisterVerificationCode: '/api/app/account/register/sendVerificationRequest',
  sendRecoveryVerificationCode: '/api/app/account/recovery/sendVerificationRequest',
  sendVerificationCode: '/api/app/account/verification/sendVerificationRequest',
  checkRegisterVerificationCode: '/api/app/account/register/verifyCode',
  checkRecoveryVerificationCode: '/api/app/account/recovery/verifyCode',
  checkVerificationCode: '/api/app/account/verification/verifyCode',
  loginGuardianTypeCheck: '/api/app/account/loginGuardianTypeCheck',
  getAccountVerifierList: '',
} as const;
