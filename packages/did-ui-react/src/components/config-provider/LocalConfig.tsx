import { NetworkList } from '@portkey/constants/constants-ca/network';
import { GlobalConfigProps } from './types';

const defaultConfig: GlobalConfigProps = {
  network: {
    networkList: NetworkList,
    defaultNetwork: NetworkList[0].networkType,
  },
  // fontFamily400: '../../assets/fonts/Roboto-Regular.ttf',
  // fontFamily500: '../../assets/fonts/Roboto-Medium.ttf',
  // fontFamily600: '../../assets/fonts/Roboto-Bold.ttf',
  // storage?: Storage; //
  // prefixCls: string;
};

type ConfigKey = keyof GlobalConfigProps;

class LocalConfigProvider {
  config: GlobalConfigProps;

  constructor(config: GlobalConfigProps) {
    this.config = config;
  }

  getGlobalConfig = () => {
    return this.config;
  };

  getConfig = (key: ConfigKey) => {
    return this.config?.[key];
  };

  setGlobalConfig = (_config: Partial<GlobalConfigProps>) => {
    this.config = { ...this.config, ..._config };
  };

  setNetwork = (network: string) => {
    this.config.network.defaultNetwork = network;
  };
}

export const localConfigProvider = new LocalConfigProvider(defaultConfig);
