import { LoginType } from '@portkey/types/types-ca/wallet';
import { VerifierItem } from '@portkey/types/verifier';
import { useState, useCallback, memo } from 'react';
import VerifierSelect from '../../../VerifierSelect/index.component';
import CodeVerify from '../../../CodeVerify/index.component';
import { IVerifyInfo } from '../../../types/verify';
import BackHeader from '../../../BackHeader';
import { Button } from 'antd';
import { OnErrorFunc } from '../../../../types/error';

type SetSignUpStepType = 'verifierSelect' | 'verifyAccount';

interface Step2WithSignUpProps {
  loginType: LoginType;
  verifierList?: VerifierItem[];
  guardianAccount: string;
  serviceUrl: string;
  isErrorTip?: boolean;
  onCancel?: () => void;
  onFinish?: (values: { verifier: VerifierItem } & IVerifyInfo) => void;
  onError?: OnErrorFunc;
}

interface ISendCodeInfo {
  endPoint: string;
  verifierSessionId: string;
  verifier: VerifierItem;
}

function Step2WithSignUp({
  loginType,
  serviceUrl,
  isErrorTip,
  verifierList,
  guardianAccount,
  onFinish,
  onCancel,
  onError,
}: Step2WithSignUpProps) {
  const [signUpStep, setSignUpStep] = useState<SetSignUpStepType>('verifierSelect');
  const [sendCodeInfo, setSendCodeInfo] = useState<ISendCodeInfo>();

  const onVerifierSelectConfirm = useCallback((info: ISendCodeInfo) => {
    setSendCodeInfo(info);
    setSignUpStep('verifyAccount');
  }, []);

  const onCodeVerifySuccess = useCallback(
    (res: IVerifyInfo) => {
      if (!sendCodeInfo?.verifier) throw 'No verifier Info';
      onFinish?.({
        verifier: sendCodeInfo.verifier,
        ...res,
      });
    },
    [onFinish, sendCodeInfo],
  );

  const onBackHandler = useCallback(() => {
    if (signUpStep === 'verifyAccount') {
      setSignUpStep('verifierSelect');
    } else {
      onCancel?.();
    }
  }, [onCancel, signUpStep]);

  return (
    <div className="step-page-wrapper">
      <BackHeader onBack={onBackHandler} />
      {signUpStep === 'verifierSelect' && (
        <VerifierSelect
          className="content-padding"
          guardianAccount={guardianAccount}
          serviceUrl={serviceUrl}
          verifierList={verifierList}
          isErrorTip={isErrorTip}
          onError={onError}
          onConfirm={onVerifierSelectConfirm}
        />
      )}
      {signUpStep === 'verifyAccount' && sendCodeInfo ? (
        <CodeVerify
          className="content-padding"
          guardianAccount={guardianAccount}
          serviceUrl={serviceUrl}
          verifier={sendCodeInfo.verifier}
          loginType={loginType}
          isCountdownNow={true}
          isLoginAccount={true}
          verifierSessionId={sendCodeInfo.verifierSessionId}
          isErrorTip={isErrorTip}
          onError={onError}
          onSuccess={onCodeVerifySuccess}
        />
      ) : (
        signUpStep === 'verifyAccount' && 'Missing sendCodeInfo'
      )}

      <Button
        onClick={() =>
          onFinish?.({
            verifier: {
              id: 'string', // aelf.Hash
              name: 'string',
              imageUrl: 'string',
              endPoints: [''],
              verifierAddresses: [''],
            },
            verificationDoc: 'string',
            signature: 'string',
          })
        }>
        test btn
      </Button>
    </div>
  );
}
export default memo(Step2WithSignUp);
