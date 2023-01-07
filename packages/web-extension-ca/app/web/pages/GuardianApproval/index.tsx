import { Button, message } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  useAppDispatch,
  useLoginInfo,
  useGuardiansInfo,
  useCommonState,
  useLoading,
  useUserInfo,
} from 'store/Provider/hooks';
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
import { resetLoginInfoAction, setLoginAccountAction } from 'store/reducers/loginCache/actions';
import { GuardianItem } from 'types/guardians';
import { sleep } from '@portkey/utils';
import { getAelfInstance } from '@portkey/utils/aelf';
import { getTxResult } from 'utils/aelfUtils';

const APPROVAL_COUNT = ZERO.plus(3).div(5);

enum MethodType {
  'guardians/add' = GuardianMth.addGuardian,
  'guardians/edit' = GuardianMth.UpdateGuardian,
  'guardians/del' = GuardianMth.RemoveGuardian,
}

export default function GuardianApproval() {
  const { userGuardianStatus, guardianExpiredTime, currentGuardian, opGuardian, preGuardian } = useGuardiansInfo();
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
  const { passwordSeed } = useUserInfo();

  const userVerifiedList = useMemo(() => {
    const tempVerifiedList = Object.values(userGuardianStatus ?? {});
    let filterVerifiedList: UserGuardianStatus[] = tempVerifiedList;
    if (state === 'guardians/edit') {
      filterVerifiedList = tempVerifiedList.filter((item) => ![opGuardian?.key, preGuardian?.key].includes(item.key));
    } else if (state === 'guardians/del') {
      filterVerifiedList = tempVerifiedList.filter((item) => item.key !== opGuardian?.key);
    } else if (state === 'guardians/add') {
      filterVerifiedList = tempVerifiedList.filter((item) => item.key !== opGuardian?.key);
    }
    return filterVerifiedList;
  }, [opGuardian, preGuardian, state, userGuardianStatus]);
  const approvalLength = useMemo(() => {
    if (userVerifiedList.length <= 3) return userVerifiedList.length;
    return APPROVAL_COUNT.times(userVerifiedList.length).dp(0, BigNumber.ROUND_DOWN).toNumber();
  }, [userVerifiedList.length]);

  const alreadyApprovalLength = useMemo(
    () => userVerifiedList.filter((item) => item?.status === VerifyStatus.Verified).length,
    [userVerifiedList],
  );

  const guardianSendCode = useCallback(
    async (item: UserGuardianItem) => {
      try {
        setLoading(true);
        dispatch(
          setLoginAccountAction({
            loginGuardianType: item.loginGuardianType,
            accountLoginType: LoginType.email,
          }),
        );
        const result = await sendVerificationCode({
          loginGuardianType: item?.loginGuardianType,
          guardiansType: item.guardiansType,
          verificationType: VerificationType.addGuardian,
          baseUrl: item?.verifier?.url || '',
          managerUniqueId: walletInfo.managerInfo?.managerUniqueId as string,
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
          navigate('/setting/guardians/verifier-account', { state: state });
        }
      } catch (error: any) {
        console.log(error, 'error===');
        setLoading(false);
        message.error(error?.error?.message ?? 'Something error');
      }
    },
    [dispatch, navigate, setLoading, state, walletInfo],
  );

  const SendCode = useCallback(
    async (item: UserGuardianItem) => {
      try {
        if (state && state.indexOf('guardians') !== -1) {
          guardianSendCode(item);
          return;
        }
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
          navigate('/login/verifier-account', { state: 'login' });
        }
      } catch (error: any) {
        console.log(error, 'error===');
        setLoading(false);
        message.error(error?.error?.message ?? 'Something error');
      }
    },
    [state, loginAccount, setLoading, guardianSendCode, dispatch, navigate],
  );

  const formatAddGuardianValue = () => {
    let guardianToAdd: GuardianItem = {} as GuardianItem;
    const guardiansApproved: GuardianItem[] = [];
    Object.values(userGuardianStatus ?? {})?.forEach((item: UserGuardianStatus) => {
      if (item.key === opGuardian?.key) {
        guardianToAdd = {
          guardianType: {
            type: item.guardiansType,
            guardianType: item.loginGuardianType,
          },
          verifier: {
            name: item.verifier?.name as string,
            signature: Object.values(Buffer.from(item.signature as any, 'hex')),
            verificationDoc: item.verificationDoc || '',
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
            signature: Object.values(Buffer.from(item.signature as any, 'hex')),
            verificationDoc: item.verificationDoc as string,
          },
        });
      }
    });
    return { guardianToAdd, guardiansApproved };
  };

  const formatEditGuardianValue = () => {
    let guardianToUpdatePre: GuardianItem = {} as GuardianItem;
    let guardianToUpdateNew: GuardianItem = {} as GuardianItem;
    const guardiansApproved: GuardianItem[] = [];
    Object.values(userGuardianStatus ?? {})?.forEach((item: UserGuardianStatus) => {
      if (item.key === opGuardian?.key) {
        guardianToUpdateNew = {
          guardianType: {
            type: item.guardiansType,
            guardianType: item.loginGuardianType,
          },
          verifier: {
            name: item.verifier?.name as string,
          },
        };
      } else if (item.key === preGuardian?.key) {
        guardianToUpdatePre = {
          guardianType: {
            type: item.guardiansType,
            guardianType: item.loginGuardianType,
          },
          verifier: {
            name: item.verifier?.name as string,
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
            signature: Object.values(Buffer.from(item.signature as any, 'hex')),
            verificationDoc: item.verificationDoc as string,
          },
        });
      }
    });
    return { guardianToUpdatePre, guardianToUpdateNew, guardiansApproved };
  };

  const formatDelGuardianValue = () => {
    let guardianToRemove: GuardianItem = {} as GuardianItem;
    const guardiansApproved: GuardianItem[] = [];
    Object.values(userGuardianStatus ?? {})?.forEach((item: UserGuardianStatus) => {
      if (item.key === opGuardian?.key) {
        guardianToRemove = {
          guardianType: {
            type: item.guardiansType,
            guardianType: item.loginGuardianType,
          },
          verifier: {
            name: item.verifier?.name as string,
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
            signature: Object.values(Buffer.from(item.signature as any, 'hex')),
            verificationDoc: item.verificationDoc as string,
          },
        });
      }
    });
    return { guardianToRemove, guardiansApproved };
  };

  const handleGuardianRecovery = async () => {
    try {
      setLoading(true);
      const res = await getPrivateKeyAndMnemonic(
        {
          AESEncryptPrivateKey: walletInfo.AESEncryptPrivateKey,
        },
        // '11111111',
        passwordSeed,
      );
      if (!currentChain?.endPoint || !res?.privateKey) return message.error('error');
      let value;
      if (state === 'guardians/add') {
        value = formatAddGuardianValue();
      } else if (state === 'guardians/edit') {
        value = formatEditGuardianValue();
      } else if (state === 'guardians/del') {
        value = formatDelGuardianValue();
      } else {
        value = {};
      }
      const result = await handleGuardian({
        rpcUrl: currentChain.endPoint,
        chainType: currentNetwork.walletType,
        address: currentChain.caContractAddress,
        privateKey: res.privateKey,
        paramsOption: {
          method: MethodType[state],
          params: [
            {
              caHash: walletInfo?.AELF?.caHash,
              ...value,
            },
          ],
        },
      });
      const { TransactionId } = result.result.message || result;
      await sleep(1000);
      const aelfInstance = getAelfInstance(currentChain.endPoint);
      const validTxId = await getTxResult(aelfInstance, TransactionId);
      dispatch(resetLoginInfoAction());
      setLoading(false);
      state === 'guardians/add' && message.success('Guardians Added');
      navigate('/setting/guardians');
    } catch (error: any) {
      setLoading(false);
      message.error(error);
    }
  };

  const recoveryWallet = useCallback(() => {
    if (state && state.indexOf('guardians') !== -1) {
      handleGuardianRecovery();
    } else {
      navigate('/register/set-pin', { state: 'login' });
    }
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
    const timeGap = (guardianExpiredTime ?? 0) - Date.now();
    if (timeGap <= 0) return setIsExpired(false);

    const timeout = setTimeout(() => {
      setIsExpired(true);
    }, timeGap);
    return () => {
      clearTimeout(timeout);
    };
  }, [guardianExpiredTime]);

  const handleBack = useCallback(() => {
    if (state && state.indexOf('guardians') !== -1) {
      if (['guardians/del', 'guardians/edit'].includes(state)) {
        dispatch(setCurrentGuardianAction(opGuardian as UserGuardianItem));
        navigate(`/setting/guardians/edit`);
      } else {
        navigate(`/setting/${state}`, { state: 'back' });
      }
    } else {
      navigate('/register/start');
    }
  }, [dispatch, navigate, opGuardian, state]);

  return (
    <div className={clsx('guardian-approval-wrapper', isPrompt ? 'common-page' : 'popup-page')}>
      {isPrompt ? <PortKeyTitle leftElement leftCallBack={handleBack} /> : <SettingHeader leftCallBack={handleBack} />}
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
