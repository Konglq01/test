import { NetworkItem } from '@portkey/types/types-ca/network';
import { Locale } from 'antd/lib/locale-provider';
import { IStorage } from '@portkey/types/storage';

export interface ConfigProviderProps {
  children?: React.ReactNode;
}

export interface GlobalConfigProps {
  network: {
    networkList?: NetworkItem[];
    /**
     * NetworkItem['networkType'];
     */
    defaultNetwork?: string;
  };
  storage?: IStorage; //

  locale?: Locale;
  // TODO There feature
  // autoClose?: boolean;
  // prefixCls?: string;
  // fontFamily400?: string;
  // fontFamily500?: string;
  // fontFamily600?: string;
}
