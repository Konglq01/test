import { resetUserGuardianStatus, setCurrentGuardianAction } from '@portkey/store/store-ca/guardians/actions';
import { Input, Button, message } from 'antd';
import { useNavigate, useLocation } from 'react-router';
import CustomSvg from 'components/CustomSvg';
import SettingHeader from 'pages/components/SettingHeader';
import { useCallback, useEffect, useMemo, useState } from 'react';
import CommonModal from 'components/CommonModal';
import { useAppDispatch, useGuardiansInfo, useLoginInfo, useLoading } from 'store/Provider/hooks';
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

const guardianList = [{ label: 'Email', value: LoginType.email }];

enum EmailError {
  noEmail = 'Please enter Email address',
  invalidEmail = 'Invalid email address',
}

export default function AddGuardian() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { verifierMap, userGuardiansList, currentGuardian } = useGuardiansInfo();
  const [guardianType, setGuardianType] = useState<LoginType>();
  const [verifierVal, setVerifierVal] = useState<string>();
  const [emailVal, setEmailVal] = useState<string>();
  const [inputErr, setInputErr] = useState<string>();
  const [visible, setVisible] = useState<boolean>(false);
  const [exist, setExist] = useState<boolean>(false);
  const { loginAccount } = useLoginInfo();
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
            <img src={item.imageUrl || item.url} alt="icon" />
            <span className="title">{item.name}</span>
          </div>
        ),
      })),
    [verifierMap],
  );

  const guardianTypeOptions = useMemo(
    () =>
      guardianList?.map((item) => ({
        value: item.value,
        children: item.label,
      })),
    [],
  );

  useEffect(() => {
    if (state === 'back' && currentGuardian) {
      setGuardianType(currentGuardian.guardiansType);
      setEmailVal(currentGuardian.loginGuardianType);
      setVerifierVal(currentGuardian.verifier?.name);
    }
  }, [state, currentGuardian]);

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

  const handleCheck = () => {
    if (!EmailReg.test(emailVal as string)) {
      setInputErr(EmailError.invalidEmail);
      return;
    }
    if (!selectVerifierItem) return message.error('Can not get the current verifier message');
    const isExist: boolean =
      Object.values(userGuardiansList ?? {})?.some((item) => {
        return item.loginGuardianType === emailVal && item.verifier?.name === verifierVal;
      }) ?? false;
    setExist(isExist);
    !isExist && setVisible(true);
  };

  const handleVerify = async () => {
    try {
      dispatch(
        setLoginAccountAction({
          loginGuardianType: emailVal as string,
          accountLoginType: LoginType.email,
        }),
      );
      setLoading(true);
      dispatch(resetUserGuardianStatus());
      await userGuardianList(walletInfo.managerInfo?.loginGuardianType as string);
      const result = await sendVerificationCode({
        loginGuardianType: emailVal as string,
        guardiansType: guardianType as LoginType,
        verificationType: VerificationType.addGuardian,
        baseUrl: selectVerifierItem?.url || '',
        managerUniqueId: loginAccount?.managerUniqueId as string,
      });
      setLoading(false);
      if (result.verifierSessionId) {
        const _key = `${emailVal}&${selectVerifierItem?.name}`;
        dispatch(
          setCurrentGuardianAction({
            isLoginAccount: true,
            verifier: selectVerifierItem,
            loginGuardianType: emailVal as string,
            guardiansType: guardianType as LoginType,
            sessionId: result.verifierSessionId,
            key: _key,
          }),
        );
        navigate('/setting/guardians/verifier-account', { state: 'guardians/add' });
      }
    } catch (error) {
      console.log(error, 'verifyHandler');
      const _error = verifyErrorHandler(error);
      message.error(_error);
    }
  };

  return (
    <div className="add-guardians-page">
      <div className="add-guardians-title">
        <SettingHeader
          title={'Add Guardians'}
          leftCallBack={() => {
            navigate('/setting/guardians');
          }}
          rightElement={<CustomSvg type="Close2" onClick={() => navigate('/setting/guardians')} />}
        />
      </div>
      <div className="input-item">
        <p className="label">Guardian Type</p>
        <CustomSelect
          className="select"
          value={guardianType}
          placeholder={'Select Guardians Type'}
          style={{ width: '100%' }}
          onChange={guardianTypeChange}
          items={guardianTypeOptions}
        />
      </div>
      {guardianType === LoginType.email && (
        <div className="input-item">
          <p className="label">Guardian email</p>
          <Input
            className="login-input"
            value={emailVal}
            placeholder="Enter Email"
            onChange={(e) => {
              handleInputChange(e.target.value);
            }}
          />
          {inputErr && <span style={{ color: 'red' }}>{inputErr}</span>}
        </div>
      )}
      <div className="input-item">
        <p className="label">Verifier</p>
        <CustomSelect
          className="select"
          value={verifierVal}
          placeholder={'Select Guardians Verifier'}
          style={{ width: '100%' }}
          onChange={verifierChange}
          items={verifierOptions}
        />
        {exist && <div className="error">This guardian is already exist</div>}
      </div>
      <div className="btn-wrap">
        <Button type="primary" onClick={handleCheck} disabled={disabled}>
          {'Confirm'}
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
            {'Confirm'}
          </Button>
        </div>
      </CommonModal>
    </div>
  );
}
