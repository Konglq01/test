import { LoginQRData, QRData, SendTokenQRDataType } from '@portkey/types/types-ca/qrcode';
import { isAddress } from '@portkey/utils';
import CommonToast from 'components/CommonToast';
import navigationService from './navigationService';

export interface RouteInfoType {
  name: string;
  params: {
    symbol: string;
  };
}

export function invalidQRCode() {
  CommonToast.fail('Invalid QR code, please re-confirm');
  navigationService.goBack();
}

export function handleQRCodeData(data: QRData, previousRouteInfo: RouteInfoType) {
  const { type, address, chainType } = data;
  if (!isAddress(address, chainType)) return invalidQRCode();

  if (type !== 'login') {
    // send event

    const newData: SendTokenQRDataType = { ...data } as SendTokenQRDataType;

    if (previousRouteInfo.name === 'SendHome' && previousRouteInfo.params.symbol !== newData.assetInfo.symbol)
      return invalidQRCode();

    navigationService.navigate('SendHome', newData);
  } else {
    navigationService.navigate('ScanLogin', { data: data as LoginQRData });
  }
}
