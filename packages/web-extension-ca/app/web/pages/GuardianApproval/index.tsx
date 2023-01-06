import { Button, message } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useLoginInfo, useGuardiansInfo, useCommonState, useLoading } from 'store/Provider/hooks';
import { VerificationType, VerifyStatus } from '@portkey/types/verifier';
import { useNavigate, useLocation } from 'react-router';
import { setUserGuardianItemStatus, setCurrentGuardianAction } from '@portkey/store/store-ca/guardians/actions';
import { UserGuardianItem, UserGuardianStatus } from '@portkey/store/store-ca/guardians/type';
import { ZERO } from '@portkey/constants/misc';
import BigNumber from 'bignumber.js';
import './index.less';
import PortKeyTitle from 'pages/components/PortKeyTitle';
import VerifierPair from 'components/VerifierPair';
import clsx from 'clsx';
import CommonTooltip from 'components/CommonTooltip';
import { sendVerificationCode } from '@portkey/api/apiUtils/verification';
import SettingHeader from 'pages/components/SettingHeader';
import getPrivateKeyAndMnemonic from 'utils/Wallet/getPrivateKeyAndMnemonic';
import { handleGuardian } from 'utils/sandboxUtil/handleGuardian';
import { GuardianMth } from 'types/guardians';
import { useCurrentWallet } from '@portkey/hooks/hooks-ca/wallet';
import { useCurrentChain } from '@portkey/hooks/hooks-ca/chainList';
import { useCurrentNetworkInfo } from '@portkey/hooks/hooks-ca/network';
import { LoginType } from '@portkey/types/types-ca/wallet';
import { resetLoginInfoAction } from 'store/reducers/loginCache/actions';

const APPROVAL_COUNT = ZERO.plus(3).div(5);

interface IGuardianItem {
  guardianType: {
    type: LoginType;
    guardianType: string;
  };
  verifier: {
    name: string;
    signature: string;
    verificationDoc: string;
  };
}
interface IAddGuardian {
  caHash: string;
  guardianToAdd: IGuardianItem;
  guardiansApproved: IGuardianItem[];
}

export default function GuardianApproval() {
  const { userGuardianStatus, guardianExpiredTime } = useGuardiansInfo();
  const { loginAccount } = useLoginInfo();
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const navigate = useNavigate();
  const { state } = useLocation();
  const dispatch = useAppDispatch();
  const { isPrompt } = useCommonState();
  const { setLoading } = useLoading();
  const { walletInfo } = useCurrentWallet();
  const currentNetwork = useCurrentNetworkInfo();
  const currentChain = useCurrentChain();
  console.log('-----------curWalletInfo--------------', walletInfo);

  const userVerifiedList = useMemo(() => {
    let tempVerifiedList = Object.values(userGuardianStatus ?? {});
    if (state && state.indexOf('guardians') !== -1) {
      tempVerifiedList = tempVerifiedList.filter((item) => item.loginGuardianType !== loginAccount?.loginGuardianType);
    }
    return tempVerifiedList;
  }, [loginAccount?.loginGuardianType, state, userGuardianStatus]);
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
      try {
        if (
          !loginAccount ||
          (!loginAccount.accountLoginType && loginAccount.accountLoginType !== 0) ||
          !loginAccount.loginGuardianType
        )
          return message.error(
            'User registration information is invalid, please fill in the registration method again',
          );
        setLoading(true);
        const result = await sendVerificationCode({
          loginGuardianType: loginAccount?.loginGuardianType,
          guardiansType: loginAccount?.accountLoginType,
          verificationType: VerificationType.communityRecovery,
          baseUrl: item?.verifier?.url || '',
          managerUniqueId: loginAccount.managerUniqueId,
        });
        setLoading(false);
        if (result.verifierSessionId) {
          dispatch(setCurrentGuardianAction({ ...item, sessionId: result.verifierSessionId }));
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
      } catch (error: any) {
        console.log(error, 'error===');
        setLoading(false);
        message.error(error?.error?.message ?? 'Something error');
      }
    },
    [loginAccount, setLoading, dispatch, state, navigate],
  );

  const formatGuardiansValue = () => {
    let guardianToAdd: IGuardianItem = {} as IGuardianItem;
    const guardiansApproved: IGuardianItem[] = [];
    Object.values(userGuardianStatus ?? {})?.forEach((item: UserGuardianStatus) => {
      if (item.loginGuardianType === loginAccount?.loginGuardianType) {
        guardianToAdd = {
          guardianType: {
            type: item.guardiansType,
            guardianType: item.loginGuardianType,
          },
          verifier: {
            name: item.verifier?.name as string,
            signature: item.signature as string,
            verificationDoc: item.verificationDoc as string,
          },
        };
      } else {
        guardiansApproved.push({
          guardianType: {
            type: item.guardiansType,
            guardianType: item.loginGuardianType,
          },
          verifier: {
            name: item.verifier?.name as string,
            signature: item.signature as string,
            verificationDoc: item.verificationDoc as string,
          },
        });
      }
    });
    return { guardianToAdd, guardiansApproved };
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleGuardianRecovery = async () => {
    if (state && state.indexOf('guardians') !== -1) {
      const res = await getPrivateKeyAndMnemonic(
        {
          AESEncryptPrivateKey: walletInfo.AESEncryptPrivateKey,
        },
        '11111111',
      );
      if (!currentChain?.endPoint || !res?.privateKey) return message.error('error');
      const { guardianToAdd, guardiansApproved } = formatGuardiansValue();
      const seed = await handleGuardian({
        rpcUrl: currentChain.endPoint,
        chainType: currentNetwork.walletType,
        address: currentChain.caContractAddress,
        privateKey: res.privateKey,
        paramsOption: {
          method: GuardianMth.addGuardian,
          params: [
            {
              caHash: walletInfo?.AELF?.caHash,
              guardianToAdd,
              guardiansApproved,
            },
          ],
        },
      });
      console.log('------------seed------------', seed);
      dispatch(resetLoginInfoAction());
      navigate('/setting/guardians');
    }
  };

  const recoveryWallet = useCallback(() => {
    if (state && state.indexOf('guardians') !== -1) {
      handleGuardianRecovery();
    } else {
      navigate('/register/set-pin', { state: 'login' });
    }
  }, [handleGuardianRecovery, navigate, state]);

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
    const timeGap = (guardianExpiredTime ?? 0) - Date.now();
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
              ? navigate(`/setting/${state}`, { state: 'back' })
              : navigate('/register/start')
          }
        />
      ) : (
        <SettingHeader
          leftCallBack={() =>
            state && state.indexOf('guardians') !== -1
              ? navigate(`/setting/${state}`, { state: 'back' })
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
              {state && state.indexOf('guardians') !== -1 ? 'Request to Pass' : 'Recovery Wallet'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
