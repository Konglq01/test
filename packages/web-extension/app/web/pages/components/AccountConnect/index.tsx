import clsx from 'clsx';
import useConnection from 'hooks/useConnection';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useWalletInfo } from 'store/Provider/hooks';
import { getCurrentTab } from 'utils/platforms';
import './index.less';
import { setAccountConnectModal } from 'store/reducers/modal/slice';
import { useTranslation } from 'react-i18next';

export default function AccountConnect() {
  const { t } = useTranslation();
  const [currentTab, setCurrentTab] = useState<chrome.tabs.Tab | undefined>();
  const { currentAccount } = useWalletInfo();
  const dispatch = useAppDispatch();

  const getCurrentTabPermission = useCallback(async () => {
    const tab = await getCurrentTab();
    setCurrentTab(tab);
  }, []);

  const connections = useConnection();
  const connectionPermission = useMemo(() => {
    const url = currentTab?.url;
    if (!url) return;
    const origin = new URL(url).origin;
    return origin ? connections?.[origin]?.permission : undefined;
  }, [connections, currentTab?.url]);

  useEffect(() => {
    getCurrentTabPermission();
  }, [getCurrentTabPermission]);

  const onClick = useCallback(() => dispatch(setAccountConnectModal(true)), [dispatch]);

  const isHasCurrentAccount = useMemo(() => {
    let isHas = false;
    connectionPermission?.accountList?.forEach((item) => {
      isHas = isHas || item === currentAccount?.address;
    });
    return isHas;
  }, [connectionPermission?.accountList, currentAccount]);

  return (
    <>
      <p className="info" onClick={onClick}>
        <span className={clsx('status', isHasCurrentAccount && 'connected')} />
        {t(isHasCurrentAccount ? 'Connected' : 'Not Connected')}
      </p>
    </>
  );
}
