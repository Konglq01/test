import { setCurrentGuardianAction } from '@portkey/store/store-ca/guardians/actions';
import { Input, Button, message } from 'antd';
import { useNavigate, useLocation } from 'react-router';
import CustomSvg from 'components/CustomSvg';
import SettingHeader from 'pages/components/SettingHeader';
import { useCallback, useEffect, useMemo, useState } from 'react';
import CommonModal from 'components/CommonModal';
import { useAppDispatch, useGuardiansInfo, useLoginInfo } from 'store/Provider/hooks';
// import { useAppDispatch, useGuardiansInfo, useLoginInfo, useWalletInfo } from 'store/Provider/hooks';
import { EmailReg } from '@portkey/utils/reg';
import './index.less';
// import { sendVerificationCode } from '@portkey/api/apiUtils/verification';
import { LoginType } from '@portkey/types/verifier';
// import { LoginType, VerificationType } from '@portkey/types/verifier';
import CustomSelect from 'pages/components/CustomSelect';

const guardianList = [{ label: 'email', value: LoginType.email }];

enum EmailError {
  noEmail = 'Please enter Email address',
  invalidEmail = 'Invalid email address',
}

export default function AddGuardian() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { verifierMap, userGuardiansList, currentGuardian } = useGuardiansInfo();
  const [guardianType, setGuardianType] = useState<LoginType>();
  const [verifierVal, setVerifierVal] = useState<string>('Portkey');
  const [emailVal, setEmailVal] = useState<string>();
  const [inputErr, setInputErr] = useState<string>();
  const [visible, setVisible] = useState<boolean>(false);
  const [exist, setExist] = useState<boolean>(false);
  const { loginAccount } = useLoginInfo();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (state?.back === 'back' && currentGuardian) {
      setGuardianType(currentGuardian.guardiansType);
      setEmailVal(currentGuardian.loginGuardianType);
      setVerifierVal(currentGuardian.verifier?.name || verifierVal);
    }
  }, [state, currentGuardian]);

  const disabled = useMemo(() => !emailVal || exist || !!inputErr, [emailVal, exist, inputErr]);

  const selectItem = useMemo(() => verifierMap?.[verifierVal], [verifierMap, verifierVal]);
  const verifierOptions = useMemo(
    () =>
      Object.values(verifierMap ?? {})?.map((item) => ({
        value: item.name,
        children: (
          <div className="flex select-option">
            <CustomSvg type={item.imageUrl as any} />
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

  const guardianTypeChange = useCallback((value: LoginType) => {
    console.log(value, 'value===');
    console.log(`selected ${value}`);
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

  const handleConfirm = () => {
    if (guardianType === undefined) return;
    if (!emailVal) return;
    if (!EmailReg.test(emailVal)) {
      setInputErr(EmailError.invalidEmail);
      return;
    }
    const flag: boolean =
      Object.values(userGuardiansList ?? {})?.some((item) => {
        return item.loginGuardianType === emailVal && item.verifier?.name === verifierVal;
      }) ?? false;
    setExist(flag);
    if (!flag) {
      if (!selectItem) return message.error('Can not get');
      dispatch(
        setCurrentGuardianAction({
          isLoginAccount: true,
          verifier: selectItem,
          loginGuardianType: emailVal,
          guardiansType: guardianType,
          key: `${emailVal}&${selectItem.name}`,
        }),
      );
      // TODO
      setVisible(true);
    }
  };

  const handleVerify = useCallback(async () => {
    try {
      // if (!loginAccount || !loginAccount.accountLoginType || !loginAccount.loginGuardianType)
      //   return message.error('User registration information is invalid, please fill in the registration method again');
      // const result = await sendVerificationCode({
      //   loginGuardianType: loginAccount?.loginGuardianType,
      //   guardiansType: loginAccount?.accountLoginType,
      //   verificationType: VerificationType.addGuardian,
      //   baseUrl: selectItem?.url || '',
      // });
      // if (result) {
      //   // TODO
      //   navigate('/setting/guardians/verifier-account', { state: 'guardians' });
      // }
      navigate('/setting/guardians/verifier-account', { state: 'guardians/add' });
    } catch (error) {
      console.log(error, 'verifyHandler');
    }
  }, []);

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
        <p className="label">Verifier</p>
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
        <p className="label">Guardian Type</p>
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
        <Button type="primary" onClick={handleConfirm} disabled={disabled}>
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
