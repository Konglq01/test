import { resetGuardiansState } from '@portkey-wallet/store/store-ca/guardians/actions';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { handleErrorMessage } from '@portkey-wallet/utils';
import { message } from 'antd';
import CustomSvg from 'components/CustomSvg';
import useGuardianList from 'hooks/useGuardianList';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useAppDispatch, useLoading } from 'store/Provider/hooks';
import { setLoginAccountAction } from 'store/reducers/loginCache/actions';
import InputInfo from '../InputInfo';
import './index.less';

interface LoginInfo {
  loginType: LoginType;
  value: string;
}

export default function InputLogin({ onBack }: { onBack?: () => void }) {
  const { t } = useTranslation();
  const { setLoading } = useLoading();
  const dispatch = useAppDispatch();
  const fetchUserVerifier = useGuardianList();
  const navigate = useNavigate();

  const loginHandler = useCallback(
    (loginInfo: LoginInfo) => {
      dispatch(
        setLoginAccountAction({
          guardianAccount: loginInfo.value,
          loginType: loginInfo.loginType,
          createType: 'login',
        }),
      );
    },
    [dispatch],
  );
  const onFinish = useCallback(
    async (loginInfo: LoginInfo) => {
      try {
        setLoading(true);
        loginHandler(loginInfo);
        dispatch(resetGuardiansState());
        await fetchUserVerifier({ guardianIdentifier: loginInfo.value });
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
    [dispatch, fetchUserVerifier, loginHandler, navigate, setLoading],
  );
  return (
    <div>
      <h1 className="title">
        <CustomSvg type="BackLeft" onClick={onBack} />
        <span>{t('Login')}</span>
      </h1>
      <InputInfo type="login" onFinish={onFinish} />
    </div>
  );
}
