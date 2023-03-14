export interface DeviceInfoType {
  deviceName?: string;
}

export interface ExtraDataType {
  transactionTime: number;
  deviceInfo: string;
  version: string;
}

export interface ExtraDataDecodeType extends Omit<ExtraDataType, 'deviceInfo'> {
  deviceInfo: DeviceInfoType;
}

export interface DeviceItemType extends ExtraDataDecodeType {
  managerAddress?: string | null;
}

// version 0.0.1
export enum DeviceType {
  OTHER,
  MAC,
  IOS,
  WINDOWS,
  ANDROID,
}

// version 0.0.1
// extraData: string
// format: deviceType:DeviceType,transactionTime:number,transactionTime?:number

// version 1.0.0
// extraData: ExtraDataType
// interface ExtraDataType {
//   transactionTime: number;
//   deviceInfo: string;
//   version: string;
// }
// interface DeviceInfoType {
//   deviceName: string;
// }
