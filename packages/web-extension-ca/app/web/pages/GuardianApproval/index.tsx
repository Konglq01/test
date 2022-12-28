import { Button, message } from 'antd';
import useAccountVerifierList from 'hooks/useGuardianList';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useLoginInfo, useGuardiansInfo, useCommonState } from 'store/Provider/hooks';
import { VerificationType, VerifyStatus } from '@portkey/types/verifier';
import { useNavigate, useLocation } from 'react-router';
import { setUserGuardianItemStatus, setCurrentGuardianAction } from '@portkey/store/store-ca/guardians/actions';
import { UserGuardianItem } from '@portkey/store/store-ca/guardians/type';
import { ZERO } from '@portkey/constants/misc';
import BigNumber from 'bignumber.js';
import './index.less';
import PortKeyTitle from 'pages/components/PortKeyTitle';
import VerifierPair from 'components/VerifierPair';
import clsx from 'clsx';
import CommonTooltip from 'components/CommonTooltip';
import { sendVerificationCode } from '@portkey/api/apiUtils/verification';
import SettingHeader from 'pages/components/SettingHeader';

const APPROVAL_COUNT = ZERO.plus(3).div(5);

export default function GuardianApproval() {
  const { userGuardianStatus, guardianExpiredTime } = useGuardiansInfo();
  const { loginAccount } = useLoginInfo();
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const navigate = useNavigate();
  const { state } = useLocation();
  const dispatch = useAppDispatch();
  const { isPrompt } = useCommonState();
  useAccountVerifierList();

  const userVerifiedList = useMemo(() => Object.values(userGuardianStatus ?? {}), [userGuardianStatus]);
  const approvalLength = useMemo(() => {
    if (userVerifiedList.length <= 3) return userVerifiedList.length;
    return APPROVAL_COUNT.times(userVerifiedList.length).dp(0, BigNumber.ROUND_DOWN).toNumber();
  }, [userVerifiedList.length]);

  const alreadyApprovalLength = useMemo(
    () => userVerifiedList.filter((item) => item?.status === VerifyStatus.Verified).length,
    [userVerifiedList],
  );

  const SendCode = useCallback(
    async (item: UserGuardianItem) => {
      if (
        !loginAccount ||
        (!loginAccount.accountLoginType && loginAccount.accountLoginType !== 0) ||
        !loginAccount.loginGuardianType
      )
        return message.error('User registration information is invalid, please fill in the registration method again');

      const result = await sendVerificationCode({
        loginGuardianType: loginAccount?.loginGuardianType,
        guardiansType: loginAccount?.accountLoginType,
        verificationType: VerificationType.communityRecovery,
        baseUrl: item?.verifier?.url || '',
        // TODO
        managerUniqueId: 'managerUniqueId',
      });
      if (result) {
        dispatch(setCurrentGuardianAction(item));
        dispatch(
          setUserGuardianItemStatus({
            key: item.key,
            status: VerifyStatus.Verifying,
          }),
        );
        state && state.indexOf('guardians') !== -1
          ? navigate('/setting/guardians/verifier-account', { state: state })
          : navigate('/login/verifier-account', { state: 'login' });
      }
    },
    [loginAccount, dispatch, navigate, state],
  );

  const recoveryWallet = useCallback(() => {
    // TODO
    state && state.indexOf('guardians') !== -1
      ? navigate('/setting/guardians')
      : navigate('/register/set-pin', { state: 'login' });
  }, [navigate, state]);

  const verifyingHandler = useCallback(
    async (item: UserGuardianItem) => {
      dispatch(setCurrentGuardianAction(item));
      state && state.indexOf('guardians') !== -1
        ? navigate('/setting/guardians/verifier-account', { state: state })
        : navigate('/login/verifier-account', { state: 'login' });
    },
    [dispatch, navigate, state],
  );

  useEffect(() => {
    const timeGap = guardianExpiredTime ?? 0 - Date.now();
    if (timeGap <= 0) return setIsExpired(false);

    const timeout = setTimeout(() => {
      setIsExpired(true);
    }, timeGap);
    return () => {
      clearTimeout(timeout);
    };
  }, [guardianExpiredTime]);

  return (
    <div className={clsx('guardian-approval-wrapper', isPrompt ? 'common-page' : 'popup-page')}>
      {isPrompt ? (
        <PortKeyTitle
          leftElement
          leftCallBack={() =>
            state && state.indexOf('guardians') !== -1
              ? navigate(`/setting/${state}`, { state: { back: 'back' } })
              : navigate('/register/start')
          }
        />
      ) : (
        <SettingHeader
          leftCallBack={() =>
            state && state.indexOf('guardians') !== -1
              ? navigate(`/setting/${state}`, { state: { back: 'back' } })
              : navigate('/register/start')
          }
        />
      )}
      <div className="common-content1 guardian-approval-content">
        <div className="title">Guardian approval</div>
        <p className="description">Expire after 1 hour</p>
        <div className="flex-between-center approve-count">
          <span className="flex-row-center">
            Guardian approvals
            <CommonTooltip
              placement="top"
              title={
                'You will need a certain amount of guardians to confirm your action.The numbers differ depending on the number of guardians you add. Quantity is less than or equal to 3, all need to agree；Quantity is greater than 3, at least 60% consent is required.'
              }
            />
          </span>
          <div>
            <span className="already-approval">{alreadyApprovalLength}</span>
            <span className="all-approval">{`/${approvalLength}`}</span>
          </div>
        </div>
        <ul className="verifier-content">
          {userVerifiedList?.map((item) => (
            <li
              className={clsx(
                'flex-between-center verifier-item',
                alreadyApprovalLength >= approvalLength &&
                  item.status !== VerifyStatus.Verified &&
                  'verifier-item-disabled',
              )}
              key={item.verifier?.name}>
              {item.isLoginAccount && <div className="login-icon">Login Account</div>}
              <div className="flex-between-center">
                <VerifierPair guardiansType={item.guardiansType} verifierSrc={item.verifier?.imageUrl} />
                <span className="account-text">{item.loginGuardianType}</span>
              </div>
              {isExpired && item.status !== VerifyStatus.Verified ? (
                <Button className="expired" type="text" disabled>
                  expired
                </Button>
              ) : (
                <>
                  {(!item.status || item.status === VerifyStatus.NotVerified) && (
                    <Button className="not-verified" type="primary" onClick={() => SendCode(item)}>
                      Send
                    </Button>
                  )}
                  {item.status === VerifyStatus.Verifying && (
                    <Button type="primary" className="verifying" onClick={() => verifyingHandler(item)}>
                      Verify
                    </Button>
                  )}
                  {item.status === VerifyStatus.Verified && (
                    <Button className="verified" type="text" disabled>
                      confirmed
                    </Button>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
        {!isExpired && (
          <div className={clsx(!isPrompt && 'btn-wrap')}>
            <Button
              type="primary"
              className="recovery-wallet-btn"
              disabled={alreadyApprovalLength <= 0 || alreadyApprovalLength !== approvalLength}
              onClick={recoveryWallet}>
              {state === 'guardians' ? 'Request to Pass' : 'Recovery Wallet'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
