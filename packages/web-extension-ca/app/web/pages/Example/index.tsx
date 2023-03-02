/* eslint-disable no-inline-styles/no-inline-styles */
import {
  SignUpAndLogin,
  VerifierSelect,
  CodeVerify,
  SetPinAndAddManager,
  GuardianList,
  GuardianApproval,
} from '@portkey/did-ui-react';
import { Button, Divider, Input } from 'antd';
import { useCallback } from 'react';
import { VerificationType } from '@portkey/types/verifier';
import { useEffectOnce } from 'react-use';
import useGuardiansList from 'hooks/useGuardianList';
import './index.less';

const guardianAccount = '';

const VERIFIER = {
  endPoints: ['http://192.168.66.250:5599'],
  verifierAddresses: ['2mBnRTqXMb5Afz4CWM2QakLRVDfaq2doJNRNQT1MXoi2uc6Zy3'],
  id: 'a609b5f0f73a9ac46208a18ea526af8a2ed9525866caf46285095b4a8df009ad',
  name: 'Portkey',
  imageUrl: 'https://portkey-did.s3.ap-northeast-1.amazonaws.com/img/Portkey.png',
};
export default function Example() {
  const fetchGuardiansList = useGuardiansList();
  useEffectOnce(() => {
    fetchGuardiansList({
      loginGuardianAccount: '11@aelf.io', // 11@aelf.io , summer@eforest.finance
    });
  });

  const inputValidator = useCallback((email?: string) => {
    console.log('inputValidator===SignUpAndLogin', email);
    return Promise.resolve(true);
  }, []);

  return (
    <div>
      <div className="grid-content">
        <div className="common-content1">
          <SignUpAndLogin
            sandboxId="portkey-ui-sandbox"
            inputValidator={inputValidator}
            onSignTypeChange={(type) => console.log(type, 'onSignTypeChange==SignUpAndLogin')}
            onSuccess={(res) => {
              console.log(res, 'SignUpAndLogin====onSuccess');
            }}
            onFinish={(wallet) => {
              console.log(wallet, 'onFinish===');
            }}
          />
        </div>
        <div className="common-content1">
          <VerifierSelect
            guardianAccount={guardianAccount}
            onConfirm={(result: any) => {
              console.log('onConfirm==SelectVerifier', result);
            }}
          />
        </div>

        <div className="common-content1">
          <CodeVerify
            chainId="AELF"
            guardianAccount={guardianAccount}
            verifierSessionId={'7f362e57-88a7-4084-b195-4205bd8cf5cf' || ''}
            isLoginAccount
            verifier={VERIFIER}
            onSuccess={(res) => {
              console.log(res, 'VerifierAccount==');
            }}
          />
        </div>
        <div className="common-content1" style={{ minHeight: 500 }}>
          <SetPinAndAddManager
            chainId="AELF"
            guardianAccount={guardianAccount}
            verificationType={VerificationType.register}
            guardianApprovedList={[
              {
                type: 'Email',
                value: guardianAccount,
                verifierId: 'a609b5f0f73a9ac46208a18ea526af8a2ed9525866caf46285095b4a8df009ad',
                verificationDoc: '0,@qq.com,02/02/2023 09:49:16,2mBnRTqXMb5Afz4CWM2QakLRVDfaq2doJNRNQT1MXoi2uc6Zy3',
                signature:
                  '0611040f8c354be856200690e1208b2c266df9530645ab64eb32d94ba73557a714701bd72220f1d1429491df0c741d2ee6c632653249281aa5f4883b0264102001',
              },
            ]}
            onFinish={(values) => {
              console.log(values, 'onConfirm===SetPinAndAddManager');
            }}
          />
        </div>

        <div className="common-content1" style={{ minHeight: 500 }}>
          <GuardianList />
        </div>
        <div className="common-content1" style={{ minHeight: 500 }}>
          <GuardianApproval
            chainId="AELF"
            onConfirm={(info) => {
              console.log('GuardianApproval', info);
            }}
          />
        </div>
      </div>
      <Divider />

      <Divider />
      <Button>Button</Button>
      <Input />
    </div>
  );
}
