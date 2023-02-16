import SignUpAndLogin, { SignUpAndLoginProps } from '../../../SignUpAndLogin/index.component';
import { useCallback, useState, memo } from 'react';
import { CreateWalletType, DIDWalletInfo } from '../../../types';
import { Button } from 'antd';

export type OnSignInFinishedFun = (values: {
  isFinished: boolean;
  result: {
    type?: CreateWalletType;
    value: string | DIDWalletInfo;
  };
}) => void;

interface Step1Props extends SignUpAndLoginProps {
  onSignInFinished: OnSignInFinishedFun;
}

function Step1({ onSignInFinished, ...props }: Step1Props) {
  const [createType, setCreateType] = useState<CreateWalletType>('Login');

  const onSuccess = useCallback(
    (value: string) => {
      onSignInFinished?.({
        isFinished: false,
        result: {
          type: createType,
          value,
        },
      });
    },
    [createType, onSignInFinished],
  );

  const _onFinish = useCallback(
    (walletInfo: any) => {
      onSignInFinished?.({
        isFinished: true,
        result: {
          value: walletInfo,
        },
      });
    },
    [onSignInFinished],
  );

  return (
    <>
      <SignUpAndLogin
        {...props}
        onSignTypeChange={(type) => setCreateType(type)}
        onSuccess={onSuccess}
        onFinish={_onFinish}
      />
      <Button
        onClick={() =>
          onSignInFinished?.({
            isFinished: false,
            result: {
              type: 'SignUp',
              value: '111.com',
            },
          })
        }>
        test btn SignUp
      </Button>
      <Button
        onClick={() =>
          onSignInFinished?.({
            isFinished: false,
            result: {
              type: 'Login',
              value: '111.com',
            },
          })
        }>
        test btn Login
      </Button>
    </>
  );
}
export default memo(Step1);
