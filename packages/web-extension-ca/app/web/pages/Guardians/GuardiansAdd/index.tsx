import {
  resetUserGuardianStatus,
  setCurrentGuardianAction,
  setOpGuardianAction,
} from '@portkey/store/store-ca/guardians/actions';
import { Input, Button, message } from 'antd';
import { useNavigate, useLocation } from 'react-router';
import CustomSvg from 'components/CustomSvg';
import SettingHeader from 'pages/components/SettingHeader';
import { useCallback, useEffect, useMemo, useState } from 'react';
import CommonModal from 'components/CommonModal';
import { useAppDispatch, useGuardiansInfo, useLoading } from 'store/Provider/hooks';
import { EmailReg } from '@portkey/utils/reg';
import { sendVerificationCode } from '@portkey/api/apiUtils/verification';
import { VerificationType } from '@portkey/types/verifier';
import { LoginType } from '@portkey/types/types-ca/wallet';
import CustomSelect from 'pages/components/CustomSelect';
import { verifyErrorHandler } from 'utils/tryErrorHandler';
import './index.less';
import useGuardianList from 'hooks/useGuardianList';
import { setLoginAccountAction } from 'store/reducers/loginCache/actions';
import { useCurrentWallet } from '@portkey/hooks/hooks-ca/wallet';
import BaseVerifierIcon from 'components/BaseVerifierIcon';
import { UserGuardianItem } from '@portkey/store/store-ca/guardians/type';
import { useTranslation } from 'react-i18next';

const guardianTypeList = [{ label: 'Email', value: LoginType.email }];

enum EmailError {
  noEmail = 'Please enter Email address',
  invalidEmail = 'Invalid email address',
}

export default function AddGuardian() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { state } = useLocation();
  const { verifierMap, userGuardiansList, opGuardian } = useGuardiansInfo();
  const [guardianType, setGuardianType] = useState<LoginType>();
  const [verifierVal, setVerifierVal] = useState<string>();
  const [emailVal, setEmailVal] = useState<string>();
  const [inputErr, setInputErr] = useState<string>();
  const [visible, setVisible] = useState<boolean>(false);
  const [exist, setExist] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const { setLoading } = useLoading();
  const { walletInfo } = useCurrentWallet();
  const userGuardianList = useGuardianList();

  const disabled = useMemo(() => !emailVal || exist || !!inputErr, [emailVal, exist, inputErr]);

  const selectVerifierItem = useMemo(() => verifierMap?.[verifierVal || ''], [verifierMap, verifierVal]);

  const verifierOptions = useMemo(
    () =>
      Object.values(verifierMap ?? {})?.map((item) => ({
        value: item.name,
        children: (
          <div className="flex select-option">
            <BaseVerifierIcon width={32} height={32} src={item.imageUrl} />
            <span className="title">{item.name}</span>
          </div>
        ),
      })),
    [verifierMap],
  );

  const guardianTypeOptions = useMemo(
    () =>
      guardianTypeList?.map((item) => ({
        value: item.value,
        children: item.label,
      })),
    [],
  );

  useEffect(() => {
    if (state === 'back' && opGuardian) {
      setGuardianType(opGuardian.guardiansType);
      setEmailVal(opGuardian.loginGuardianType);
      setVerifierVal(opGuardian.verifier?.name);
    }
  }, [state, opGuardian]);

  const guardianTypeChange = useCallback((value: LoginType) => {
    setExist(false);
    setGuardianType(value);
  }, []);

  const verifierChange = useCallback((value: string) => {
    setVerifierVal(value);
    setExist(false);
  }, []);

  const handleInputChange = useCallback((v: string) => {
    setInputErr('');
    setExist(false);
    setEmailVal(v);
  }, []);

  const handleCheck = useCallback(() => {
    if (!EmailReg.test(emailVal as string)) {
      setInputErr(EmailError.invalidEmail);
      return;
    }
    if (!selectVerifierItem) return message.error('Can not get the current verifier message');
    const isExist: boolean =
      Object.values(userGuardiansList ?? {})?.some((item) => {
        return item.key === `${emailVal}&${verifierVal}`;
      }) ?? false;
    setExist(isExist);
    !isExist && setVisible(true);
  }, [emailVal, selectVerifierItem, userGuardiansList, verifierVal]);

  const handleVerify = useCallback(async () => {
    try {
      dispatch(
        setLoginAccountAction({
          loginGuardianType: emailVal as string,
          accountLoginType: guardianType as LoginType,
        }),
      );
      setLoading(true);
      dispatch(resetUserGuardianStatus());
      await userGuardianList({ caHash: walletInfo.caHash });
      const result = await sendVerificationCode({
        loginGuardianType: emailVal as string,
        guardiansType: guardianType as LoginType,
        verificationType: VerificationType.addGuardian,
        baseUrl: selectVerifierItem?.url || '',
        managerUniqueId: walletInfo.managerInfo?.managerUniqueId as string,
      });
      setLoading(false);
      if (result.verifierSessionId) {
        const newGuardian: UserGuardianItem = {
          isLoginAccount: false,
          verifier: selectVerifierItem,
          loginGuardianType: emailVal as string,
          guardiansType: guardianType as LoginType,
          sessionId: result.verifierSessionId,
          key: `${emailVal}&${selectVerifierItem?.name}`,
          isInitStatus: true,
        };
        dispatch(setCurrentGuardianAction(newGuardian));
        dispatch(setOpGuardianAction(newGuardian));
        navigate('/setting/guardians/verifier-account', { state: 'guardians/add' });
      }
    } catch (error) {
      setLoading(false);
      console.log('---add-guardian-send-code', error);
      const _error = verifyErrorHandler(error);
      message.error(_error);
    }
  }, [
    dispatch,
    emailVal,
    guardianType,
    navigate,
    selectVerifierItem,
    setLoading,
    userGuardianList,
    walletInfo.caHash,
    walletInfo.managerInfo?.managerUniqueId,
  ]);

  return (
    <div className="add-guardians-page">
      <div className="add-guardians-title">
        <SettingHeader
          title={t('Add Guardians')}
          leftCallBack={() => {
            navigate('/setting/guardians');
          }}
          rightElement={<CustomSvg type="Close2" onClick={() => navigate('/setting/guardians')} />}
        />
      </div>
      <div className="input-item">
        <p className="label">{t('Guardian Type')}</p>
        <CustomSelect
          className="select"
          value={guardianType}
          placeholder={t('Select guardian types')}
          onChange={guardianTypeChange}
          items={guardianTypeOptions}
        />
      </div>
      {guardianType === LoginType.email && (
        <div className="input-item">
          <p className="label">{t("Guardian's email")}</p>
          <Input
            className="login-input"
            value={emailVal}
            placeholder={t('Enter email')}
            onChange={(e) => {
              handleInputChange(e.target.value);
            }}
          />
          {inputErr && <span className="err-text">{inputErr}</span>}
        </div>
      )}
      <div className="input-item">
        <p className="label">{t('Verifier')}</p>
        <CustomSelect
          className="select"
          value={verifierVal}
          placeholder={t('Select guardian verifiers')}
          onChange={verifierChange}
          items={verifierOptions}
        />
        {exist && <div className="error">{t('This guardian already exists')}</div>}
      </div>
      <div className="btn-wrap">
        <Button type="primary" onClick={handleCheck} disabled={disabled}>
          {t('Confirm')}
        </Button>
      </div>
      <CommonModal
        width={320}
        className="verify-confirm-modal"
        closable={false}
        open={visible}
        onCancel={() => setVisible(false)}>
        <p className="modal-content">{`${verifierVal} will send a verification code to ${emailVal} to verify your email address.`}</p>
        <div className="btn-wrapper">
          <Button onClick={() => setVisible(false)}>{'Cancel'}</Button>
          <Button type="primary" onClick={handleVerify}>
            {t('Confirm')}
          </Button>
        </div>
      </CommonModal>
    </div>
  );
}
