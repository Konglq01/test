import { setCurrentGuardianAction } from '@portkey/store/store-ca/guardians/actions';
import { Button, message } from 'antd';
import CommonModal from 'components/CommonModal';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAppDispatch, useLoginInfo, useGuardiansInfo } from 'store/Provider/hooks';
import PortKeyTitle from 'pages/components/PortKeyTitle';
import BaseVerifierIcon from 'components/BaseVerifierIcon';
import './index.less';
import { sendVerificationCode } from '@portkey/api/apiUtils/verification';
import { VerificationType } from '@portkey/types/verifier';
import CommonSelect from 'components/CommonSelect1';
import { useTranslation } from 'react-i18next';

export default function SelectVerifier() {
  const { verifierMap } = useGuardiansInfo();
  const { loginAccount } = useLoginInfo();
  const [selectVal, setSelectVal] = useState<string>('Portkey');
  const [open, setOpen] = useState<boolean>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const handleChange = useCallback((value: string) => {
    setSelectVal(value);
  }, []);

  const selectItem = useMemo(() => verifierMap?.[selectVal], [selectVal, verifierMap]);

  const selectOptions = useMemo(
    () =>
      Object.values(verifierMap ?? {})?.map((item) => ({
        value: item.name,
        icon: item.imageUrl,
        label: item.name,
      })),
    [verifierMap],
  );

  const verifyHandler = useCallback(async () => {
    try {
      if (
        !loginAccount ||
        (!loginAccount.accountLoginType && loginAccount.accountLoginType !== 0) ||
        !loginAccount.loginGuardianType
      )
        return message.error('User registration information is invalid, please fill in the registration method again');
      if (!selectItem) return message.error('Can not get verification');
      dispatch(
        setCurrentGuardianAction({
          isLoginAccount: true,
          verifier: selectItem,
          loginGuardianType: loginAccount.loginGuardianType,
          guardiansType: loginAccount.accountLoginType,
          key: `${loginAccount.loginGuardianType}&${selectItem.name}`,
        }),
      );
      const result = await sendVerificationCode({
        loginGuardianType: loginAccount.loginGuardianType,
        guardiansType: loginAccount?.accountLoginType,
        verificationType: VerificationType.register,
        baseUrl: selectItem?.url || '',
      });
      if (result) {
        navigate('/register/verifier-account', { state: 'register' });
      }
    } catch (error) {
      console.log(error, 'verifyHandler');
    }
  }, [dispatch, loginAccount, navigate, selectItem]);

  return (
    <div className="common-page select-verifier-wrapper">
      <PortKeyTitle leftElement leftCallBack={() => navigate('/register/start/create')} />
      <div className="common-content1 select-verifier-content" id="select-verifier-content">
        <div className="title">{t('Select verifier')}</div>
        <p className="description">
          {t('The recovery of decentralized accounts requires approval from your verifiers')}
        </p>
        <CommonSelect className="verifier-select" value={selectVal} onChange={handleChange} items={selectOptions} />
        <p className="popular-title">{t('Popular')}</p>
        <ul className="popular-content">
          {Object.values(verifierMap ?? {})?.map((item) => (
            <li key={item.name} className="popular-item" onClick={() => handleChange(item.name)}>
              <BaseVerifierIcon src={item.imageUrl} rootClassName="popular-item-image" />
              <p className="popular-item-name">{item.name}</p>
            </li>
          ))}
        </ul>
        <Button className="confirm-btn" type="primary" onClick={() => setOpen(true)}>
          {t('Confirm')}
        </Button>
      </div>
      {loginAccount && (
        <CommonModal
          getContainer={'#select-verifier-content'}
          className="verify-confirm-modal"
          closable={false}
          open={open}
          width={320}
          onCancel={() => setOpen(false)}>
          <p className="modal-content">{`${t('Portkey will send a verification code to')} ${
            loginAccount.loginGuardianType
          } ${t('to verify your email address.')}`}</p>
          <div className="btn-wrapper">
            <Button onClick={() => setOpen(false)}>{t('Cancel')}</Button>
            <Button type="primary" onClick={verifyHandler}>
              {t('Confirm')}
            </Button>
          </div>
        </CommonModal>
      )}
    </div>
  );
}
