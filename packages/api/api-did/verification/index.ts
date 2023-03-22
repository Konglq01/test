export default {
  sendVerificationRequest: '/api/app/account/sendVerificationRequest',
  checkVerificationCode: '/api/app/account/verifyCode',
  getCountry: '/api/app/ipInfo/ipInfo',
  verifyGoogleToken: '/api/app/account/verifyGoogleToken',
  verifyAppleToken: '/api/app/account/verifyAppleToken',
} as const;
