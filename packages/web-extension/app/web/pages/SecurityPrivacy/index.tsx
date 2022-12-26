import clsx from 'clsx';
import { useNavigate } from 'react-router';
import './index.less';
import BaseDrawer from 'pages/components/BaseDrawer';
import ChangePassword from 'pages/SecurityPrivacy/components/ChangePassword';
import SettingHeader from 'pages/components/SettingHeader';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { useCommonState, useWalletInfo } from 'store/Provider/hooks';
import ShowRecoveryPhrase from './components/ShowRecoveryPhrase';
import ShowPrivateKey from './components/ShowPrivateKey';
import ResetWalletModal from 'pages/components/ResetWalletModal';
import MenuItem from 'components/MenuItem';
import CustomSvg from 'components/CustomSvg';
import PromptSettingColumn from 'pages/components/PromptSettingColumn';
import { useTranslation } from 'react-i18next';

export enum SecurityPrivacyType {
  changePassword = 'changePassword',
  showRecoveryPhrase = 'showRecoveryPhrase',
  showPrivateKey = 'showPrivateKey',
}

export interface SecurityPrivacyMenuInfo {
  label: string;
  type: SecurityPrivacyType;
  element: ReactNode;
}

export default function SecurityPrivacy({ curMenu }: { curMenu?: string }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { currentAccount } = useWalletInfo();
  const { isPrompt } = useCommonState();
  const [drawerType, setDrawerType] = useState<SecurityPrivacyType | boolean>(false);
  const [resetModalVisible, setResetModalVisible] = useState<boolean>();

  const [curMenuInfo, setCurMenuInfo] = useState<SecurityPrivacyMenuInfo | null>(null);
  const list = useMemo<SecurityPrivacyMenuInfo[]>(
    () => [
      {
        label: 'Change Password',
        type: SecurityPrivacyType.changePassword,
        element: (
          <ChangePassword
            onBack={() => {
              setCurMenuInfo(null);
            }}
          />
        ),
      },
      {
        label: 'Show Secret Recovery Phrase',
        type: SecurityPrivacyType.showRecoveryPhrase,
        element: (
          <ShowRecoveryPhrase
            onBack={() => {
              setCurMenuInfo(null);
            }}
          />
        ),
      },
      {
        label: `Show Private Key for`,
        type: SecurityPrivacyType.showPrivateKey,
        element: (
          <ShowPrivateKey
            title={currentAccount?.accountName}
            onBack={() => {
              setCurMenuInfo(null);
            }}
          />
        ),
      },
    ],
    [currentAccount?.accountName],
  );
  useEffect(() => {
    curMenu && setCurMenuInfo(list.find((item) => item.type === curMenu) || null);
  }, []);

  return (
    <>
      {!isPrompt ? (
        <div className="security-privacy">
          <SettingHeader
            title={t('Security & Privacy')}
            leftCallBack={() => navigate(-1)}
            rightElement={<CustomSvg type="Close2" style={{ width: 18, height: 18 }} onClick={() => navigate(-1)} />}
          />
          <div className="security-privacy-body">
            <div className="security-menu-list">
              {list.map((item) => (
                <MenuItem key={item.type} onClick={() => setDrawerType(item.type)}>
                  {t(item.label, { accountName: currentAccount?.accountName })}
                </MenuItem>
              ))}
            </div>
            <div className="reset-area">
              <div className="reset-btn" onClick={() => setResetModalVisible(true)}>
                {t('Reset Wallet')}
              </div>
            </div>
          </div>

          <BaseDrawer
            className={clsx(
              'security-privacy-drawer',
              drawerType !== SecurityPrivacyType.changePassword && 'security-privacy-drawer-header-no-border',
            )}
            open={!!drawerType}
            title={
              <SettingHeader
                title={
                  drawerType === SecurityPrivacyType.showPrivateKey
                    ? t('Show Private Key')
                    : t(list.find((item) => item.type === drawerType)?.label || '')
                }
                leftCallBack={() => setDrawerType(false)}
                rightElement={
                  <CustomSvg type="Close2" style={{ width: 18, height: 18 }} onClick={() => setDrawerType(false)} />
                }
              />
            }
            placement="right">
            {drawerType === SecurityPrivacyType.changePassword && (
              <ChangePassword onBack={() => setDrawerType(false)} />
            )}
            {drawerType === SecurityPrivacyType.showRecoveryPhrase && (
              <ShowRecoveryPhrase onBack={() => setDrawerType(false)} />
            )}
            {drawerType === SecurityPrivacyType.showPrivateKey && (
              <ShowPrivateKey title={currentAccount?.accountName} onBack={() => setDrawerType(false)} />
            )}
          </BaseDrawer>
          <ResetWalletModal open={resetModalVisible} onCancel={() => setResetModalVisible(false)} />
        </div>
      ) : (
        <div className="security-privacy-prompt">
          <PromptSettingColumn
            title={`${t('Security & Privacy')} ${
              curMenuInfo ? `> ${t(curMenuInfo.label, { accountName: currentAccount?.accountName })}` : ''
            }`}
            rightElement={curMenuInfo?.element}>
            <div className="security-privacy-body">
              <div className={clsx('security-menu-list', !!curMenuInfo && 'security-menu-list-selected')}>
                {list.map((item) => (
                  <MenuItem
                    height={48}
                    className={item.type === curMenuInfo?.type ? 'menu-item-select' : undefined}
                    key={item.type}
                    onClick={() => setCurMenuInfo(item)}>
                    {t(item.label, { accountName: currentAccount?.accountName })}
                  </MenuItem>
                ))}
              </div>
              {!curMenuInfo && (
                <div className="reset-btn" onClick={() => setResetModalVisible(true)}>
                  {t('Reset Wallet')}
                </div>
              )}
            </div>
          </PromptSettingColumn>
          <ResetWalletModal open={resetModalVisible} onCancel={() => setResetModalVisible(false)} />
        </div>
      )}
    </>
  );
}
