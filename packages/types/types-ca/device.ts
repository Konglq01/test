export interface DeviceInfoType {
  deviceName?: string;
}

export interface ExtraDataType {
  transactionTime: number;
  deviceInfo: string;
  version: string;
}

export interface DeviceItemType extends Omit<ExtraDataType, 'deviceInfo'> {
  managerAddress?: string | null;
  deviceInfo: DeviceInfoType;
}

// version 0.0.1
export enum DeviceType {
  other,
  mac,
  ios,
  windows,
  android,
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
