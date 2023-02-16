import { useMemo } from 'react';
import { ConfigProvider } from 'antd';
import type { ConfigProviderProps } from 'antd/lib/config-provider';
import localConfigProvider from './index';
import ScreenLoading from '../ScreenLoading';
import { useEffectOnce } from 'react-use';
import { configVerification } from './api';

export default function BaseConfigProvider({ children }: { children: ConfigProviderProps['children'] }) {
  const config = useMemo(() => localConfigProvider.getGlobalConfig(), []);
  // useEffectOnce(() => {
  //   ConfigProvider.config({
  //     prefixCls: 'antd',
  //   });
  // });
  useEffectOnce(() => {
    config.storage && configVerification(config.storage);
    // TODO
    // const fontFamily400 = config?.fontFamily400;
    // const fontFamily500 = config?.fontFamily500;
    // const fontFamily600 = config?.fontFamily600;
    // fontFamily400 && loadFonts('portkey-ui-font', fontFamily400, { weight: '400' });
    // fontFamily500 && loadFonts('portkey-ui-font', fontFamily500, { weight: '500' });
    // fontFamily600 && loadFonts('portkey-ui-font', fontFamily600, { weight: '600' });
  });

  return (
    <>
      <ConfigProvider locale={config?.locale}>
        <div
          className="portkey-ui-wrapper"
          //</ConfigProvider>style={{ fontFamily: 'portkey-ui-font' }}
        >
          <ScreenLoading />
          {children}
        </div>
      </ConfigProvider>
    </>
  );
}
