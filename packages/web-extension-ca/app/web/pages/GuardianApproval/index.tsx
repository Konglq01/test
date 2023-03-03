import { Button } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLoginInfo, useGuardiansInfo, useCommonState } from 'store/Provider/hooks';
import { VerifyStatus } from '@portkey-wallet/types/verifier';
import { useNavigate, useLocation } from 'react-router';
import { UserGuardianStatus } from '@portkey-wallet/store/store-ca/guardians/type';
import { getApprovalCount } from '@portkey-wallet/utils/guardian';
import './index.less';
import PortKeyTitle from 'pages/components/PortKeyTitle';
import clsx from 'clsx';
import CommonTooltip from 'components/CommonTooltip';
import SettingHeader from 'pages/components/SettingHeader';
import { useTranslation } from 'react-i18next';
import GuardianItems from './components/GuardianItems';
import { useRecovery } from './hooks/useRecovery';

export default function GuardianApproval() {
  const { userGuardianStatus, guardianExpiredTime, opGuardian, preGuardian } = useGuardiansInfo();
  const { loginAccount } = useLoginInfo();
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const navigate = useNavigate();
  const { state } = useLocation();
  const { isPrompt } = useCommonState();
  const { t } = useTranslation();

  const userVerifiedList = useMemo(() => {
    const tempVerifiedList = Object.values(userGuardianStatus ?? {});
    let filterVerifiedList: UserGuardianStatus[] = tempVerifiedList;
    if (state === 'guardians/edit') {
      filterVerifiedList = tempVerifiedList.filter((item) => item.key !== preGuardian?.key);
    } else if (['guardians/del', 'guardians/add'].includes(state)) {
      filterVerifiedList = tempVerifiedList.filter((item) => item.key !== opGuardian?.key);
    }
    return filterVerifiedList;
  }, [opGuardian, preGuardian, state, userGuardianStatus]);

  console.log(userVerifiedList, userGuardianStatus, 'userGuardianStatus==');
  const approvalLength = useMemo(() => {
    return getApprovalCount(userVerifiedList.length);
  }, [userVerifiedList.length]);

  const alreadyApprovalLength = useMemo(
    () => userVerifiedList.filter((item) => item?.status === VerifyStatus.Verified).length,
    [userVerifiedList],
  );

  const handleGuardianRecovery = useRecovery();

  const recoveryWallet = useCallback(() => {
    if (state && state.indexOf('guardians') !== -1) {
      handleGuardianRecovery();
    } else {
      navigate('/login/set-pin/login');
    }
  }, [handleGuardianRecovery, navigate, state]);

  useEffect(() => {
    if (!guardianExpiredTime) return setIsExpired(false);
    const timeGap = (guardianExpiredTime ?? 0) - Date.now();
    if (timeGap <= 0) return setIsExpired(true);

    const timer = setInterval(() => {
      const timeGap = (guardianExpiredTime ?? 0) - Date.now();
      if (timeGap <= 0) return setIsExpired(true);
      setIsExpired(false);
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [guardianExpiredTime]);

  const handleBack = useCallback(() => {
    if (state && state.indexOf('guardians') !== -1) {
      if (['guardians/del', 'guardians/edit'].includes(state)) {
        navigate(`/setting/guardians/edit`);
      } else if ('guardians/add' === state) {
        navigate('/setting/guardians/add', { state: 'back' });
      }
    } else {
      navigate('/register/start');
    }
  }, [navigate, state]);

  return (
    <div className={clsx('guardian-approval-wrapper', isPrompt ? 'common-page' : 'popup-page')}>
      {isPrompt ? <PortKeyTitle leftElement leftCallBack={handleBack} /> : <SettingHeader leftCallBack={handleBack} />}
      <div className="common-content1 guardian-approval-content">
        <div className="title">{t('Guardian Approval')}</div>
        <p className="description">{isExpired ? t('Expired') : t('Expire after 1 hour')}</p>
        <div className="flex-between-center approve-count">
          <span className="flex-row-center">
            {t("Guardians' approval")}
            <CommonTooltip placement="top" title={t('guardianApprovalTip')} />
          </span>
          <div>
            <span className="already-approval">{alreadyApprovalLength}</span>
            <span className="all-approval">{`/${approvalLength}`}</span>
          </div>
        </div>
        <ul className={clsx('verifier-content', !isPrompt && 'popup-verifier-content')}>
          {userVerifiedList?.map((item) => (
            <GuardianItems
              key={item.key}
              disabled={alreadyApprovalLength >= approvalLength && item.status !== VerifyStatus.Verified}
              isExpired={isExpired}
              item={item}
              loginAccount={loginAccount}
            />
          ))}
        </ul>
        {!isExpired && (
          <div className={clsx(!isPrompt && 'btn-wrap')}>
            <Button
              type="primary"
              className="recovery-wallet-btn"
              disabled={alreadyApprovalLength <= 0 || alreadyApprovalLength !== approvalLength}
              onClick={recoveryWallet}>
              {t('Confirm')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
