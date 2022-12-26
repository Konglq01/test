import { LoginQRData, QRData } from '@portkey/types/types-ca/qrcode';
import { isAddress } from '@portkey/utils';
import CommonToast from 'components/CommonToast';
import navigationService from './navigationService';

export function invalidQRCode() {
  CommonToast.fail('Invalid QR code, please re-confirm');
  navigationService.goBack();
}

export function handleQRCodeData(data: QRData) {
  const { type } = data;
  if (type !== 'login') {
    // send event
    // not current network
    navigationService.navigate('SendHome', { sendInfo: data });
  } else {
    const { address, chainType } = data as LoginQRData;
    if (!isAddress(address, chainType)) return invalidQRCode();
    navigationService.navigate('ScanLogin', { data });
  }
}
