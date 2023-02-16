import { UserGuardianItem, UserGuardianStatus } from '@portkey/store/store-ca/guardians/type';
import { VerifyStatus } from '@portkey/types/verifier';
import { Button } from 'antd';
import VerifierPair from '../../../VerifierPair';
import { useCallback, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { setLoading } from '../../../../utils/loading';
import clsx from 'clsx';
import { LoginStrType } from '@portkey/constants/constants-ca/guardian';
import { DefaultChainId } from '@portkey/constants/constants-ca/network';
import { OnErrorFunc } from '../../../../types/error';
import { errorTip } from '../../../../utils/errorHandler';
import { verification } from '../../../config-provider/api';

interface GuardianItemProps {
  disabled?: boolean;
  isExpired?: boolean;
  serviceUrl: string;
  item: UserGuardianStatus;
  isErrorTip?: boolean;
  onError?: OnErrorFunc;
  onSend?: (item: UserGuardianItem) => void;
  onVerifying?: (item: UserGuardianItem) => void;
}

function GuardianItems({
  disabled,
  item,
  isExpired,
  serviceUrl,
  isErrorTip,
  onError,
  onSend,
  onVerifying,
}: GuardianItemProps) {
  const { t } = useTranslation();

  const SendCode = useCallback(
    async (item: UserGuardianItem) => {
      try {
        setLoading(true);
        const result = await verification.sendVerificationCode({
          baseURL: serviceUrl,
          params: {
            guardianAccount: item.guardianAccount,
            type: LoginStrType[item.guardianType],
            verifierId: item.verifier?.id || '',
            chainId: DefaultChainId,
          },
        });
        setLoading(false);
        if (result.verifierSessionId) {
          onSend?.({
            ...item,
            verifierInfo: {
              sessionId: result.verifierSessionId,
              endPoint: result.endPoint,
            },
          });
        }
      } catch (error: any) {
        console.error(error, 'SendCode error:');
        setLoading(false);
        return errorTip(
          {
            errorFields: 'GuardianItems',
            error: error?.error?.message ?? error ?? 'Something error',
          },
          isErrorTip,
          onError,
        );
      }
    },
    [serviceUrl, onSend, isErrorTip, onError],
  );

  const verifyingHandler = useCallback(
    async (item: UserGuardianItem) => {
      onVerifying?.(item);
    },
    [onVerifying],
  );

  return (
    <li className={clsx('flex-between-center verifier-item', disabled && 'verifier-item-disabled')}>
      {item.isLoginAccount && <div className="login-icon">{t('Login Account')}</div>}
      <div className="flex-between-center">
        <VerifierPair guardianType={item.guardianType} verifierSrc={item.verifier?.imageUrl} />
        <span className="account-text">{item.guardianAccount}</span>
      </div>
      {isExpired && item.status !== VerifyStatus.Verified ? (
        <Button className="expired" type="text" disabled>
          {t('Expired')}
        </Button>
      ) : (
        <>
          {(!item.status || item.status === VerifyStatus.NotVerified) && (
            <Button className="not-verified" type="primary" onClick={() => SendCode(item)}>
              {t('Send')}
            </Button>
          )}
          {item.status === VerifyStatus.Verifying && (
            <Button type="primary" className="verifying" onClick={() => verifyingHandler(item)}>
              {t('Verify')}
            </Button>
          )}
          {item.status === VerifyStatus.Verified && (
            <Button className="verified" type="text" disabled>
              {t('Confirmed')}
            </Button>
          )}
        </>
      )}
    </li>
  );
}

export default memo(GuardianItems);
