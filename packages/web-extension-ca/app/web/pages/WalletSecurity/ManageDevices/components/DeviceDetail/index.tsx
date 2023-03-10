import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'antd';
import GuardianApproval from 'pages/GuardianApproval';
import BaseDrawer from 'components/BaseDrawer';
import BackHeader from 'components/BackHeader';
import CustomSvg from 'components/CustomSvg';
import './index.less';

interface DeviceDetailProps {
  open: boolean;
  setOpen: (f: boolean) => void;
  initValue: Record<string, string>;
}

enum Stage {
  'Detail',
  'Approval',
}

export default function DeviceDetail(props: DeviceDetailProps) {
  const { t } = useTranslation();
  const { initValue, open, setOpen } = props;
  const [stage, setStage] = useState(Stage.Detail);

  const handleDelete = useCallback(() => {
    setStage(Stage.Approval);
  }, []);

  const obj = useMemo(
    () => ({
      0: {
        element: (
          <>
            <div className="flex device-content">
              <span>{initValue.name}</span>
            </div>
            <div className="device-btn">
              <Button type="link" htmlType="submit" onClick={handleDelete}>
                {t('Delete')}
              </Button>
            </div>
          </>
        ),
      },
      1: {
        element: <GuardianApproval />,
      },
    }),
    [handleDelete, initValue.name, t],
  );

  return (
    <BaseDrawer
      destroyOnClose
      open={open}
      className="device-detail-drawer"
      title={
        stage === Stage.Detail ? (
          <div className="device-detail-title">
            <BackHeader
              title={t('Device Details')}
              leftCallBack={() => {
                setOpen(false);
              }}
              rightElement={
                <CustomSvg
                  type="Close2"
                  onClick={() => {
                    setOpen(false);
                  }}
                />
              }
            />
          </div>
        ) : (
          ''
        )
      }
      placement="right">
      {obj[stage].element}
    </BaseDrawer>
  );
}
