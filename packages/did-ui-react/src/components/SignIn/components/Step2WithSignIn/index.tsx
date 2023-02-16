import { GUARDIAN_TYPE_TYPE } from '@portkey/constants/constants-ca/guardian';
import { BaseGuardianItem } from '@portkey/store/store-ca/guardians/type';
import { ChainType } from '@portkey/types';
import { GuardianAccount, GuardiansApprovedType, GuardiansInfo } from '@portkey/types/guardian';
import { LoginType } from '@portkey/types/types-ca/wallet';
import { VerifierItem, VerifyStatus } from '@portkey/types/verifier';
import { Button } from 'antd';
import { memo, useMemo, useState, useEffect, useCallback } from 'react';
import { OnErrorFunc } from '../../../../types/error';
import { contractErrorHandler, errorTip } from '../../../../utils/errorHandler';
import { getHolderInfo } from '../../../../utils/sandboxUtil/getHolderInfo';
import BackHeader from '../../../BackHeader';
import GuardianApproval from '../../../GuardianApproval/index.component';
import { ChainInfoType } from '../../types';
import './index.less';

interface Step2WithSignInProps {
  sandboxId?: string;
  loginType: LoginType;
  serviceUrl: string;
  chainInfo?: ChainInfoType;
  chainType?: ChainType;
  isErrorTip?: boolean;
  guardianList?: BaseGuardianItem[];
  guardianAccount: string;
  verifierList?: VerifierItem[];
  approvedList?: GuardiansApprovedType[];
  onFinish?: (guardianList: GuardiansApprovedType[]) => void;
  onCancel?: () => void;
  onError?: OnErrorFunc;
}

function Step2WithSignIn({
  sandboxId,
  loginType,
  serviceUrl,
  chainInfo,
  chainType,
  isErrorTip,
  verifierList,
  approvedList,
  guardianAccount,
  onFinish,
  onCancel,
  onError,
}: Step2WithSignInProps) {
  const [guardianList, setGuardianList] = useState<BaseGuardianItem[] | undefined>();

  const getGuardianList = useCallback(async () => {
    try {
      //
      if (!chainInfo) return;
      const verifierMap: { [x: string]: VerifierItem } = {};
      verifierList?.forEach((item) => {
        verifierMap[item.id] = item;
      });

      const payload = await getHolderInfo({
        sandboxId,
        rpcUrl: chainInfo.endPoint,
        address: chainInfo.contractAddress,
        chainType: chainType || 'aelf',
        paramsOption: {
          loginGuardianAccount: guardianAccount as string,
        },
      });
      const { loginGuardianAccountIndexes, guardianAccounts } = payload?.guardiansInfo as GuardiansInfo;
      const _guardianAccounts: (GuardianAccount & { isLoginAccount?: boolean })[] = [...guardianAccounts];
      loginGuardianAccountIndexes.forEach((item) => {
        _guardianAccounts[item].isLoginAccount = true;
      });

      const guardiansList = _guardianAccounts.map((_guardianAccount) => {
        const guardianAccount = _guardianAccount.value;
        const verifier = verifierMap?.[_guardianAccount.guardian.verifier.id];
        const guardianType: LoginType = (
          typeof _guardianAccount.guardian.type === 'string'
            ? GUARDIAN_TYPE_TYPE[_guardianAccount.guardian.type]
            : _guardianAccount.guardian.type
        ) as any;

        const _guardian: BaseGuardianItem = {
          key: `${guardianAccount}&${verifier?.id}`,
          isLoginAccount: _guardianAccount.isLoginAccount,
          verifier: verifier,
          guardianAccount,
          guardianType,
        };
        return _guardian;
      });

      setGuardianList(guardiansList);
    } catch (error) {
      //

      console.log(error, 'error===GuardianApproval');

      errorTip(
        {
          errorFields: 'GuardianApproval',
          error: contractErrorHandler(error),
        },
        isErrorTip,
        onError,
      );
    }
  }, [chainInfo, chainType, guardianAccount, isErrorTip, onError, sandboxId, verifierList]);

  useEffect(() => {
    getGuardianList();
  }, [getGuardianList]);

  const _guardianList = useMemo(() => {
    if (!approvedList) return guardianList;
    const approvedMap: { [x: string]: GuardiansApprovedType } = {};
    approvedList.forEach((item) => {
      approvedMap[`${item.value}&${item.verifierId}`] = item;
    });
    return guardianList?.map((guardian) => {
      const approvedItem = approvedMap[`${guardian.guardianAccount}&${guardian.verifier?.id}`];
      if (approvedItem)
        return {
          ...guardian,
          status: VerifyStatus.Verified,
          verificationDoc: approvedItem.verificationDoc,
          signature: approvedItem.signature,
        };
      return guardian;
    });
  }, [approvedList, guardianList]);

  console.log(guardianList, _guardianList, 'guardianList===');

  return (
    <div className="step-page-wrapper step2-sign-in-wrapper">
      <GuardianApproval
        header={<BackHeader onBack={onCancel} />}
        loginType={loginType}
        serviceUrl={serviceUrl}
        guardianList={_guardianList}
        isErrorTip={isErrorTip}
        onConfirm={onFinish}
        onError={onError}
      />
      {/* TODO */}
      <Button
        onClick={() =>
          onFinish?.([
            { type: 'Email', value: 'string', verifierId: 'string', verificationDoc: 'string', signature: 'string' },
          ])
        }>
        test btn
      </Button>
    </div>
  );
}

export default memo(Step2WithSignIn);
