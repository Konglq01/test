import { LoginQRData, QRData, SendTokenQRDataType } from '@portkey/types/types-ca/qrcode';
import { isAddress } from '@portkey/utils';
import CommonToast from 'components/CommonToast';
import navigationService from './navigationService';

export function invalidQRCode() {
  CommonToast.fail('Invalid QR code, please re-confirm');
  navigationService.goBack();
}

export function handleQRCodeData(data: QRData) {
  const { type, address, chainType } = data;
  if (!isAddress(address, chainType)) return invalidQRCode();

  if (type !== 'login') {
    // send event
    // not current network
    navigationService.navigate('SendHome', { ...data } as SendTokenQRDataType);
  } else {
    navigationService.navigate('ScanLogin', { data: data as LoginQRData });
  }
}
