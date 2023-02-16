import { Button } from 'antd';
import BackHeader from '../../../BackHeader';
import CommonModal from '../../../CommonModal';
import { memo, useCallback, useState } from 'react';
import { VerificationType } from '@portkey/types/verifier';
import SetPinAndAddManagerCom, { SetPinAndAddManagerProps } from '../../../SetPinAndAddManager/index.component';
import './index.less';

interface Step3Props extends SetPinAndAddManagerProps {
  onCancel?: () => void;
}

function Step3({
  serviceUrl,
  chainId,
  loginType,
  guardianAccount,
  verificationType,
  guardianApprovedList = [],
  onFinish,
  onCancel,
}: Step3Props) {
  const [returnOpen, setReturnOpen] = useState<boolean>(false);

  const onBackHandler = useCallback(() => {
    if (verificationType === VerificationType.register) {
      setReturnOpen(true);
    } else {
      onCancel?.();
    }
  }, [onCancel, verificationType]);

  return (
    <div className="step-page-wrapper">
      <BackHeader onBack={onBackHandler} />
      <SetPinAndAddManagerCom
        className="content-padding"
        serviceUrl={serviceUrl}
        chainId={chainId}
        loginType={loginType}
        guardianAccount={guardianAccount}
        verificationType={verificationType}
        guardianApprovedList={guardianApprovedList}
        onFinish={onFinish}
      />
      <CommonModal
        closable={false}
        open={returnOpen}
        className="confirm-return-modal"
        title={'Leave this page?'}
        width={320}
        getContainer={'#set-pin-wrapper'}>
        <p className="modal-content">Are you sure you want to leave this page? All changes will not be saved.</p>
        <div className="btn-wrapper">
          <Button onClick={() => setReturnOpen(false)}>No</Button>
          <Button type="primary" onClick={onCancel}>
            Yes
          </Button>
        </div>
      </CommonModal>
    </div>
  );
}

export default memo(Step3);
