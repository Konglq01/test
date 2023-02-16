import { useState, useCallback, ReactNode } from 'react';
import clsx from 'clsx';
import { BaseGuardianItem, UserGuardianStatus } from '@portkey/store/store-ca/guardians/type';
import { VerifierItem, VerifyStatus } from '@portkey/types/verifier';
import { LoginType } from '@portkey/types/types-ca/wallet';
import GuardianList from '../GuardianList/index.component';
import VerifierPage from './components/VerifierPage';
import { GuardiansApprovedType } from '@portkey/types/guardian';
import { LoginStrType } from '@portkey/constants/constants-ca/guardian';
import { OnErrorFunc } from '../../types/error';
import { errorTip } from '../../utils/errorHandler';
import { useUpdateEffect } from 'react-use';
import './index.less';

export interface GuardianApprovalProps {
  header?: ReactNode;
  loginType: LoginType;
  className?: string;
  serviceUrl: string;
  guardianList?: BaseGuardianItem[];
  isErrorTip?: boolean;
  onError?: OnErrorFunc;
  onConfirm?: (guardianList: GuardiansApprovedType[]) => void;
}

export default function GuardianApproval({
  header,
  loginType = LoginType.email,
  className,
  serviceUrl,
  guardianList = [],
  isErrorTip,
  onError,
  onConfirm,
}: GuardianApprovalProps) {
  const [verifyAccountIndex, setVerifyAccountIndex] = useState<number | undefined>();
  const [_guardianList, setGuardianList] = useState<UserGuardianStatus[]>(guardianList);
  const [expiredTime, setExpiredTime] = useState<number>();

  useUpdateEffect(() => {
    !_guardianList.length && guardianList?.length && setGuardianList(guardianList);
  }, [guardianList, _guardianList]);

  console.log(_guardianList, '_guardianList===');

  const onSendCodeHandler = useCallback(
    async (item: UserGuardianStatus, index: number) => {
      try {
        if (!expiredTime) setExpiredTime(Date.now());

        setVerifyAccountIndex(index);
        setGuardianList((v) => {
          v[index] = {
            ...item,
            status: VerifyStatus.Verifying,
            isInitStatus: true,
          };

          return v;
        });
      } catch (error: any) {
        console.log(error, 'error===');
        return errorTip(
          {
            errorFields: 'GuardianApproval',
            error: error?.error?.message ?? error?.type ?? 'Something error',
          },
          isErrorTip,
          onError,
        );
      }
    },
    [expiredTime, isErrorTip, onError],
  );

  const onVerifyingHandler = useCallback(
    async (_item: UserGuardianStatus, index: number) => {
      try {
        setVerifyAccountIndex(index);
        setGuardianList((v) => {
          v[index].isInitStatus = false;
          return v;
        });
      } catch (error: any) {
        console.log(error, 'error===');
        return errorTip(
          {
            errorFields: 'GuardianApproval',
            error: error?.error?.message ?? error?.type ?? 'Something error',
          },
          isErrorTip,
          onError,
        );
      }
    },
    [isErrorTip, onError],
  );

  const onCodeVerifyHandler = useCallback(
    (res: { verificationDoc: string; signature: string; verifierId: string }, index: number) => {
      setGuardianList((v) => {
        v[index] = {
          ...v[index],
          status: VerifyStatus.Verified,
          verificationDoc: res.verificationDoc,
          signature: res.signature,
        };
        return v;
      });
      setVerifyAccountIndex(undefined);
    },
    [],
  );

  const onConfirmHandler = useCallback(() => {
    const verificationList = _guardianList.map((item) => ({
      type: LoginStrType[item.guardianType],
      value: item.guardianAccount,
      verifierId: item.verifier?.id || '',
      verificationDoc: item.verificationDoc || '',
      signature: item.signature || '',
    }));
    onConfirm?.(verificationList);
  }, [_guardianList, onConfirm]);

  return (
    <div className={clsx('ui-guardian-approval-wrapper', className)}>
      {typeof verifyAccountIndex === 'number' ? (
        <VerifierPage
          onBack={() => setVerifyAccountIndex(undefined)}
          serviceUrl={serviceUrl}
          guardianAccount={_guardianList[verifyAccountIndex].guardianAccount || ''}
          verifierSessionId={_guardianList[verifyAccountIndex].verifierInfo?.sessionId || ''}
          isLoginAccount={_guardianList[verifyAccountIndex].isLoginAccount}
          isCountdownNow={_guardianList[verifyAccountIndex].isInitStatus}
          loginType={loginType}
          isErrorTip={isErrorTip}
          verifier={_guardianList[verifyAccountIndex].verifier as VerifierItem}
          onSuccess={(res) => onCodeVerifyHandler(res, verifyAccountIndex)}
          onError={onError}
        />
      ) : (
        <>
          {header}
          <GuardianList
            expiredTime={expiredTime}
            serviceUrl={serviceUrl}
            guardianList={_guardianList}
            isErrorTip={isErrorTip}
            onSend={onSendCodeHandler}
            onVerifying={onVerifyingHandler}
            onConfirm={onConfirmHandler}
            onError={onError}
          />
        </>
      )}
    </div>
  );
}
