import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'antd';
import './index.less';

interface DeviceDetailProps {
  deviceName: string;
}

export default function DeviceDetail(props: DeviceDetailProps) {
  const { t } = useTranslation();
  const { deviceName } = props;

  const handleDelete = useCallback(async () => {
    // TODO Approval
  }, []);

  return (
    <div className="device-detail">
      <div className="flex device-detail-content">
        <span>{deviceName}</span>
      </div>
      <div className="device-detail-btn">
        <Button type="link" htmlType="submit" onClick={handleDelete}>
          {t('Delete')}
        </Button>
      </div>
    </div>
  );
}
