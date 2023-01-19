import { useEffect, useMemo } from 'react';
import CustomSvg from 'components/CustomSvg';
import { useTranslation } from 'react-i18next';
import useGuardianList from 'hooks/useGuardianList';
import SettingHeader from 'pages/components/SettingHeader';
import { useNavigate } from 'react-router';
import { useAppDispatch, useGuardiansInfo } from 'store/Provider/hooks';
import { useCurrentWallet } from '@portkey/hooks/hooks-ca/wallet';
import { setCurrentGuardianAction, setOpGuardianAction } from '@portkey/store/store-ca/guardians/actions';
import VerifierPair from 'components/VerifierPair';
import './index.less';
import { Button } from 'antd';

export default function Guardians() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { userGuardiansList } = useGuardiansInfo();
  const { walletInfo } = useCurrentWallet();
  const getGuardianList = useGuardianList();

  const formatGuardianList = useMemo(() => {
    const temp = [...(userGuardiansList || [])];
    temp.reverse();
    return temp;
  }, [userGuardiansList]);

  useEffect(() => {
    getGuardianList({ caHash: walletInfo.caHash });
  }, [getGuardianList, walletInfo]);

  return (
    <div className="my-guardians-frame">
      <div className="guardians-title">
        <SettingHeader
          title={'Guardians'}
          leftCallBack={() => {
            navigate('/setting');
          }}
          rightElement={
            <div>
              <Button onClick={() => navigate('/setting/guardians/add')}>Add Guardians</Button>
              <CustomSvg type="Close2" onClick={() => navigate('/setting')} />
            </div>
          }
        />
      </div>
      <div className="guardians-content">
        <ul>
          {formatGuardianList.map((item, key) => (
            <li
              key={key}
              onClick={() => {
                dispatch(setCurrentGuardianAction({ ...item, isLoginAccount: !!item.isLoginAccount }));
                dispatch(setOpGuardianAction({ ...item, isLoginAccount: !!item.isLoginAccount }));
                navigate('/setting/guardians/view');
              }}>
              <div className="flex-between-center guardian">
                <div>
                  {item.isLoginAccount && <div className="login-icon">{t('Login Account')}</div>}
                  <div className="flex-between-center">
                    <VerifierPair guardianType={item.guardianType} verifierSrc={item.verifier?.imageUrl} />
                    <span className="account-text">{item.guardianAccount}</span>
                  </div>
                </div>
                <div>
                  <CustomSvg type="Right" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
