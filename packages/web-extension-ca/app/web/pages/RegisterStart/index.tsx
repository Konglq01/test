import CustomSvg from 'components/CustomSvg';
import RegisterHeader from 'pages/components/RegisterHeader';
import { useNavigate, useParams } from 'react-router';
import LoginCard from './components/LoginCard';
import ScanCard from './components/ScanCard';
import SignCard from './components/SignCard';
import { useCurrentNetworkInfo, useNetworkList } from '@portkey-wallet/hooks/hooks-ca/network';
import { useCallback, useMemo, useRef } from 'react';
import { useAppDispatch, useLoading } from 'store/Provider/hooks';
import { changeNetworkType } from '@portkey-wallet/store/store-ca/wallet/actions';
import { NetworkType } from '@portkey-wallet/types';
import CommonSelect from 'components/CommonSelect1';
import { useChangeNetwork } from 'hooks/useChangeNetwork';
import i18n from 'i18n';
import { LoginInfo } from 'store/reducers/loginCache/type';
import { setLoginAccountAction } from 'store/reducers/loginCache/actions';
import { resetGuardiansState } from '@portkey-wallet/store/store-ca/guardians/actions';
import useGuardianList from 'hooks/useGuardianList';
import { handleErrorCode, handleErrorMessage } from '@portkey-wallet/utils';
import { message } from 'antd';
import { getHolderInfo } from 'utils/sandboxUtil/getHolderInfo';
import './index.less';
import { SocialLoginFinishHandler } from 'types/wallet';
import { getGoogleUserInfo } from '@portkey-wallet/utils/authentication';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';

export default function RegisterStart() {
  const { type } = useParams();
  const currentNetwork = useCurrentNetworkInfo();
  const dispatch = useAppDispatch();
  const changeNetwork = useChangeNetwork();
  const navigate = useNavigate();
  const { setLoading } = useLoading();
  const fetchUserVerifier = useGuardianList();

  const networkList = useNetworkList();

  const selectItems = useMemo(
    () =>
      networkList?.map((item) => ({
        value: item.networkType,
        icon: 'Aelf',
        label: item.name,
        disabled: !item.isActive,
      })),
    [networkList],
  );

  const networkChange = useCallback(
    (value: NetworkType) => {
      dispatch(changeNetworkType(value));
      const network = networkList.find((item) => item.networkType === value);
      network && changeNetwork(network);
    },
    [changeNetwork, dispatch, networkList],
  );

  const isHasAccount = useRef<boolean>();

  const validateIdentifier = useCallback(async (identifier?: string) => {
    let isLoginAccount = false;
    try {
      const checkResult = await getHolderInfo({
        paramsOption: {
          guardianIdentifier: identifier as string,
        },
      });
      if (checkResult.guardianList?.guardians?.length > 0) {
        isLoginAccount = true;
      }
    } catch (error: any) {
      const code = handleErrorCode(error);
      if (code?.toString() === '3002') {
        isLoginAccount = false;
      } else {
        throw handleErrorMessage(error || 'GetHolderInfo error');
      }
    }
    isHasAccount.current = isLoginAccount;
  }, []);

  const saveState = useCallback(
    (data: LoginInfo) => {
      dispatch(setLoginAccountAction(data));
    },
    [dispatch],
  );

  const onSignFinish = useCallback(
    (data: LoginInfo) => {
      saveState(data);
      dispatch(resetGuardiansState());
      navigate('/register/select-verifier');
    },
    [dispatch, navigate, saveState],
  );

  const onLoginFinish = useCallback(
    async (loginInfo: LoginInfo) => {
      try {
        setLoading(true);
        saveState({ ...loginInfo, createType: 'login' });
        dispatch(resetGuardiansState());
        await fetchUserVerifier({ guardianIdentifier: loginInfo.guardianAccount });
        setLoading(false);
        navigate('/login/guardian-approval');
      } catch (error) {
        console.log(error, '====');
        const errMsg = handleErrorMessage(error, 'login error');
        message.error(errMsg);
      } finally {
        setLoading(false);
      }
    },
    [dispatch, fetchUserVerifier, navigate, saveState, setLoading],
  );

  const onInputFinish = useCallback(
    (loginInfo: LoginInfo) => {
      if (isHasAccount?.current) return onLoginFinish(loginInfo);
      return onSignFinish(loginInfo);
    },
    [isHasAccount, onLoginFinish, onSignFinish],
  );

  const onSocialFinish: SocialLoginFinishHandler = useCallback(
    async ({ type, data }) => {
      try {
        if (!data) throw 'Action error';
        if (type === 'Google') {
          const userInfo = await getGoogleUserInfo(data?.access_token);
          if (!userInfo?.id) throw userInfo;
          await validateIdentifier(userInfo.id);
          onInputFinish?.({
            guardianAccount: userInfo.id, // account
            loginType: LoginType[type],
            authenticationInfo: { [userInfo.id]: data?.access_token },
            createType: isHasAccount.current ? 'login' : 'register',
          });
        } else if (type === 'Apple') {
          // const userInfo = await getGoogleUserInfo(data?.accessToken);
          // await validateIdentifier(userInfo.id);
          // onInputFinish?.({
          //   guardianAccount: userInfo.id, // account
          //   loginType: LoginType[type],
          //   createType: isHasAccount.current ? 'login' : 'register',
          // });
        } else {
          message.error(`LoginType:${type} is not support`);
        }
      } catch (error) {
        console.log(error, 'error===onSocialSignFinish');
        const msg = handleErrorMessage(error);
        message.error(msg);
      }
    },
    [onInputFinish, validateIdentifier],
  );

  return (
    <div>
      <RegisterHeader />
      <div className="flex-between register-start-content">
        <div className="text-content">
          <CustomSvg type="PortKey" />
          <h1>{i18n.t('Welcome to Portkey') as string}</h1>
        </div>
        <div>
          {type === 'create' && (
            <SignCard validateEmail={validateIdentifier} onFinish={onInputFinish} onSocialSignFinish={onSocialFinish} />
          )}
          {type === 'scan' && <ScanCard />}
          {(!type || type === 'login') && (
            <LoginCard
              validateEmail={validateIdentifier}
              onFinish={onInputFinish}
              onSocialLoginFinish={onSocialFinish}
            />
          )}
          <div className="network-list-wrapper">
            <CommonSelect
              className="network-list-select"
              value={currentNetwork.networkType}
              items={selectItems}
              onChange={networkChange}
              showArrow={false}
              getPopupContainer={(triggerNode) => triggerNode.parentElement}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
