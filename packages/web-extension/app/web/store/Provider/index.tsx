import { ConfigProvider } from 'antd';
import ErrorBoundary from 'components/ErrorBoundary';
import ScreenLoading from 'components/ScreenLoading';
import { useLanguage } from 'i18n';
import { ANTD_LOCAL } from 'i18n/config';
import Modals from 'models';
import PermissionCheck from 'pages/components/PermissionCheck';
import { useEffect } from 'react';
import { HashRouter } from 'react-router-dom';
import { prefixCls } from '../../constants';
import ReduxProvider from './ReduxProvider';
import Updater from './Updater';
const bodyRootWrapper = document.body;

ConfigProvider.config({
  prefixCls,
});

export default function ContextProviders({
  children,
  pageType = 'Popup',
}: {
  children?: React.ReactNode;
  pageType?: 'Popup' | 'Prompt';
}) {
  const { language } = useLanguage();
  useEffect(() => {
    let preLanguageWrapper: string | null = null;
    bodyRootWrapper.classList.forEach((item) => {
      if (item.includes('-language-wrapper')) {
        preLanguageWrapper = item;
      }
    });
    preLanguageWrapper && bodyRootWrapper.classList.remove(preLanguageWrapper);
    bodyRootWrapper.classList.add(`${language}-language-wrapper`);
  }, [language]);

  return (
    <ConfigProvider locale={ANTD_LOCAL[language]} autoInsertSpaceInButton={false} prefixCls={prefixCls}>
      <ErrorBoundary>
        <ReduxProvider>
          <ScreenLoading />
          <HashRouter>
            <Modals />
            <Updater />
            <PermissionCheck pageType={pageType}>{children}</PermissionCheck>
          </HashRouter>
        </ReduxProvider>
      </ErrorBoundary>
    </ConfigProvider>
  );
}
