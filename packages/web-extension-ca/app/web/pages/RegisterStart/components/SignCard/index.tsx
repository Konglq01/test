import { setLoginAccountAction } from 'store/reducers/loginCache/actions';
import { resetGuardiansState } from '@portkey-wallet/store/store-ca/guardians/actions';
import CustomSvg from 'components/CustomSvg';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useAppDispatch } from 'store/Provider/hooks';
import EmailTab from '../EmailTab';
import { useTranslation } from 'react-i18next';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { useCurrentChain } from '@portkey-wallet/hooks/hooks-ca/chainList';
import './index.less';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';

export default function SignCard() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const currentNetwork = useCurrentNetworkInfo();
  const currentChain = useCurrentChain();
  const onEmailTabSuccess = useCallback(
    (email: string) => {
      console.log('onEmailTabSuccess');
      dispatch(
        setLoginAccountAction({
          guardianAccount: email,
          loginType: LoginType.email,
          createType: 'register',
        }),
      );
      dispatch(resetGuardiansState());
      navigate('/register/select-verifier');
    },
    [dispatch, navigate],
  );
  return (
    <div className="login-card sign-card">
      <h2 className="title">
        <CustomSvg type="BackLeft" onClick={() => navigate('/register/start')} />
        <span>{t('Sign Up')}</span>
      </h2>
      <div className="login-content sign-content">
        <EmailTab currentChain={currentChain} currentNetwork={currentNetwork} onSuccess={onEmailTabSuccess} />
      </div>
    </div>
  );
}
