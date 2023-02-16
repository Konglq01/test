import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { useState, useMemo, useEffect } from 'react';
import { getApprovalCount } from '@portkey/utils/guardian';
import clsx from 'clsx';
import { UserGuardianStatus } from '@portkey/store/store-ca/guardians/type';
import { VerifyStatus } from '@portkey/types/verifier';
import CommonTooltip from '../CommonTooltip/index.component';
import GuardianItems from './components/GuardianItems';
import { OnErrorFunc } from '../../types/error';
import './index.less';

export interface GuardianListProps {
  className?: string;
  guardianList?: UserGuardianStatus[];
  expiredTime?: number;
  serviceUrl: string;
  isErrorTip?: boolean;
  onError?: OnErrorFunc;
  onConfirm?: () => void;
  onSend?: (item: UserGuardianStatus, index: number) => void;
  onVerifying?: (item: UserGuardianStatus, index: number) => void;
}

export default function GuardianList({
  className,
  serviceUrl,
  guardianList = [],
  expiredTime,
  isErrorTip,
  onError,
  onConfirm,
  onSend,
  onVerifying,
}: GuardianListProps) {
  const { t } = useTranslation();

  const [isExpired, setIsExpired] = useState<boolean>(false);

  const approvalLength = useMemo(() => {
    return getApprovalCount(guardianList.length);
  }, [guardianList.length]);

  const alreadyApprovalLength = useMemo(
    () => guardianList.filter((item) => item?.status === VerifyStatus.Verified).length,
    [guardianList],
  );

  useEffect(() => {
    if (!expiredTime) return setIsExpired(false);
    const timeGap = (expiredTime ?? 0) - Date.now();
    if (timeGap <= 0) return setIsExpired(true);

    const timer = setInterval(() => {
      const timeGap = (expiredTime ?? 0) - Date.now();
      if (timeGap <= 0) return setIsExpired(true);
      setIsExpired(false);
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [expiredTime]);

  return (
    <div className={clsx('guardian-list-wrapper', className)}>
      <div className="guardian-list-content">
        <div className="guardian-list-title">{t('Guardian Approval')}</div>
        <p className="guardian-list-description">{isExpired ? t('Expired') : t('Expire after 1 hour')}</p>
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
        <ul className="verifier-content">
          {guardianList?.map((item, index) => (
            <GuardianItems
              key={item.key}
              serviceUrl={serviceUrl}
              disabled={alreadyApprovalLength >= approvalLength && item.status !== VerifyStatus.Verified}
              isExpired={isExpired}
              item={item}
              isErrorTip={isErrorTip}
              onError={onError}
              onSend={(res) => onSend?.(res, index)}
              onVerifying={(res) => onVerifying?.(res, index)}
            />
          ))}
          {!isExpired && (
            <div className="btn-wrap">
              <Button
                type="primary"
                className="recovery-wallet-btn"
                disabled={alreadyApprovalLength <= 0 || alreadyApprovalLength !== approvalLength}
                onClick={onConfirm}>
                {t('Recover Wallet')}
              </Button>
            </div>
          )}
        </ul>
      </div>
    </div>
  );
}
