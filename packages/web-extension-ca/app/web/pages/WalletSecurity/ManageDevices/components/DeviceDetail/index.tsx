import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'antd';
import { useNavigate } from 'react-router';
import { useAppDispatch } from 'store/Provider/hooks';
import { resetUserGuardianStatus } from '@portkey-wallet/store/store-ca/guardians/actions';
import useGuardianList from 'hooks/useGuardianList';
import { useCurrentWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';

interface DeviceDetailProps {
  deviceName: string;
  isCurrent: boolean;
}

export default function DeviceDetail(props: DeviceDetailProps) {
  const { t } = useTranslation();
  const { deviceName, isCurrent } = props;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const userGuardianList = useGuardianList();
  const { walletInfo } = useCurrentWallet();

  const handleDelete = useCallback(async () => {
    dispatch(resetUserGuardianStatus());
    await userGuardianList({ caHash: walletInfo.caHash });
    navigate('/setting/wallet-security/manage-devices/guardian-approval');
  }, [dispatch, navigate, userGuardianList, walletInfo.caHash]);

  return (
    <div className="device-detail">
      <div className="flex device-detail-content">
        <span>{deviceName}</span>
      </div>
      {!isCurrent && (
        <div className="device-detail-btn">
          <Button type="link" htmlType="submit" onClick={handleDelete}>
            {t('Delete')}
          </Button>
        </div>
      )}
    </div>
  );
}
