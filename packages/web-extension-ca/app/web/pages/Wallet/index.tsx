import { Button, message } from 'antd';
import { ReactNode, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import BackHeader from 'components/BackHeader';
import MenuItem from 'components/MenuItem';
import CustomSvg from 'components/CustomSvg';
import BaseDrawer from 'components/BaseDrawer';
import WalletName from './components/WalletName';
import AutoLock from './components/AutoLock';
import SwitchNetworks from './components/SwitchNetworks';
import AboutUs from './components/AboutUs';
import ExitWallet from './components/ExitWallet';
import { useWalletInfo } from 'store/Provider/hooks';
import svgsList from 'assets/svgs';
import './index.less';
import { useSetWalletName } from '@portkey-wallet/hooks/hooks-ca/wallet';

export type WalletAvatar = keyof typeof svgsList;
interface MenuItemInfo {
  title: string;
  value: string;
  element: ReactNode;
}

export default function Wallet() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { walletName, walletAvatar } = useWalletInfo();
  const [curMenu, setCurMenu] = useState<MenuItemInfo | null>(null);
  const [exitVisible, setExitVisible] = useState<boolean>(false);
  const setWalletName = useSetWalletName();

  const handleUpdateName = useCallback(
    async (name: string) => {
      try {
        await setWalletName(name);
        setCurMenu(null);
        message.success(t('Saved Successful'));
      } catch (error) {
        message.error('set wallet name error');
        console.log('setWalletName: error', error);
      }
    },
    [setWalletName, t],
  );

  const MenuList: MenuItemInfo[] = useMemo(
    () => [
      {
        title: 'Wallet Name',
        value: walletName,
        element: <WalletName onSave={handleUpdateName} initValue={{ name: walletName }} />,
      },
      {
        title: 'Auto-lock',
        value: 'Auto-lock',
        element: <AutoLock />,
      },
      {
        title: 'Switch Networks',
        value: 'Switch Networks',
        element: <SwitchNetworks />,
      },
      {
        title: 'About Us',
        value: 'About Us',
        element: <AboutUs />,
      },
    ],
    [walletName, handleUpdateName],
  );

  return (
    <div className="flex-column setting-wallet-frame">
      <div className="wallet-title">
        <BackHeader
          title={t('Wallet')}
          leftCallBack={() => navigate('/')}
          rightElement={
            <CustomSvg
              type="Close2"
              onClick={() => {
                navigate('/setting');
              }}
            />
          }
        />
      </div>
      <div className="flex-center wallet-icon">
        <CustomSvg type={(walletAvatar as WalletAvatar) || 'master1'} className="wallet-svg" />
      </div>
      <div className="menu-list">
        {MenuList.map((item) => (
          <MenuItem key={item.title} height={53} onClick={() => setCurMenu(item)}>
            {t(item.value)}
          </MenuItem>
        ))}
      </div>
      <div className="wallet-btn">
        <Button
          type="default"
          onClick={() => {
            setExitVisible(true);
          }}>
          {t('Exit Wallet')}
        </Button>
      </div>
      <BaseDrawer
        open={!!curMenu}
        className="setting-wallet-drawer"
        title={
          <div className="wallet-drawer-title">
            <BackHeader
              title={curMenu?.title}
              leftCallBack={() => {
                setCurMenu(null);
              }}
              rightElement={
                <CustomSvg
                  type="Close2"
                  onClick={() => {
                    setCurMenu(null);
                  }}
                />
              }
            />
          </div>
        }
        placement="right">
        {curMenu?.element}
      </BaseDrawer>
      <ExitWallet
        open={exitVisible}
        onCancel={() => {
          setExitVisible(false);
        }}
      />
    </div>
  );
}
