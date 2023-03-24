import {
  resetUserGuardianStatus,
  setCurrentGuardianAction,
  setOpGuardianAction,
} from '@portkey-wallet/store/store-ca/guardians/actions';
import { Input, Button, message } from 'antd';
import { useNavigate, useLocation } from 'react-router';
import CustomSvg from 'components/CustomSvg';
import SettingHeader from 'pages/components/SettingHeader';
import { useCallback, useEffect, useMemo, useState } from 'react';
import CommonModal from 'components/CommonModal';
import { useAppDispatch, useGuardiansInfo, useLoading } from 'store/Provider/hooks';
import { EmailReg } from '@portkey-wallet/utils/reg';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import CustomSelect from 'pages/components/CustomSelect';
import { verifyErrorHandler } from 'utils/tryErrorHandler';
import useGuardianList from 'hooks/useGuardianList';
import { setLoginAccountAction } from 'store/reducers/loginCache/actions';
import { useCurrentWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import BaseVerifierIcon from 'components/BaseVerifierIcon';
import { UserGuardianItem } from '@portkey-wallet/store/store-ca/guardians/type';
import { useTranslation } from 'react-i18next';
import { DefaultChainId } from '@portkey-wallet/constants/constants-ca/network';
import { verification } from 'utils/api';
import PhoneInput from '../components/PhoneInput';
import { EmailError } from '@portkey-wallet/utils/check';
import { guardianTypeList, phoneInit, socialInit } from 'constants/guardians';
import { IPhoneInput, ISocialInput } from 'types/guardians';
import './index.less';

export default function AddGuardian() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { state } = useLocation();
  const { verifierMap, userGuardiansList, opGuardian } = useGuardiansInfo();
  const [guardianType, setGuardianType] = useState<LoginType>();
  const [verifierVal, setVerifierVal] = useState<string>();
  const [verifierName, setVerifierName] = useState<string>();
  const [emailVal, setEmailVal] = useState<string>();
  const [phoneValue, setPhoneValue] = useState<IPhoneInput>();
  const [socialValue, setSocialVale] = useState<ISocialInput>();
  const [emailErr, setEmailErr] = useState<string>();
  const [visible, setVisible] = useState<boolean>(false);
  const [exist, setExist] = useState<boolean>(false);
  const [curKey, setCurKey] = useState<string>('');
  const [accountShow, setAccountShow] = useState<string>('');
  const dispatch = useAppDispatch();
  const { setLoading } = useLoading();
  const { walletInfo } = useCurrentWallet();
  const userGuardianList = useGuardianList();

  const disabled = useMemo(() => {
    let check = true;
    if (verifierVal) {
      switch (guardianType) {
        case LoginType.Email: {
          check = !emailVal;
          break;
        }
        case LoginType.Phone: {
          check = !phoneValue?.phoneNumber;
          break;
        }
        case LoginType.Apple:
        case LoginType.Google: {
          check = !socialValue?.value;
          break;
        }
        default:
          check = true;
      }
    }
    return check || exist || !!emailErr;
  }, [guardianType, verifierVal, exist, emailErr, emailVal, phoneValue?.phoneNumber, socialValue?.value]);

  const selectVerifierItem = useMemo(() => verifierMap?.[verifierVal || ''], [verifierMap, verifierVal]);

  const verifierOptions = useMemo(
    () =>
      Object.values(verifierMap ?? {})?.map((item) => ({
        value: item.id,
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
        children: (
          <div className="flex select-option">
            <CustomSvg type={item.icon} />
            <span className="title">{item.label}</span>
          </div>
        ),
      })),
    [],
  );

  const isPhoneType = useMemo(() => guardianType === LoginType.Phone, [guardianType]);

  useEffect(() => {
    let key = '',
      tempAccount = '';
    switch (guardianType) {
      case LoginType.Email: {
        key = `${emailVal}&${verifierVal}`;
        tempAccount = `${emailVal}`;
        break;
      }
      case LoginType.Phone: {
        key = `${phoneValue?.code}${phoneValue?.phoneNumber}&${verifierVal}`;
        tempAccount = `+${phoneValue?.code} ${phoneValue?.phoneNumber}`;
        break;
      }
      case LoginType.Apple:
      case LoginType.Google: {
        key = `${socialValue?.value}&${verifierVal}`;
        tempAccount = `${socialValue?.value}`;
        break;
      }
    }
    setAccountShow(tempAccount);
    setCurKey(key);
  }, [emailVal, guardianType, phoneValue, socialValue, verifierVal]);

  useEffect(() => {
    if (state === 'back' && opGuardian) {
      setGuardianType(opGuardian.guardianType);
      setEmailVal(opGuardian.guardianAccount);
      setVerifierVal(opGuardian.verifier?.id);
      setVerifierName(opGuardian.verifier?.name);
    }
  }, [state, opGuardian]);

  const guardianTypeChange = useCallback((value: LoginType) => {
    setExist(false);
    setGuardianType(value);
    setEmailVal('');
    setPhoneValue(phoneInit);
    setSocialVale(socialInit);
    setEmailErr('');
  }, []);

  const verifierChange = useCallback(
    (value: string) => {
      setVerifierVal(value);
      setVerifierName(verifierMap?.[value]?.name);
      setExist(false);
    },
    [verifierMap],
  );

  const handleEmailInputChange = useCallback((v: string) => {
    setEmailErr('');
    setExist(false);
    setEmailVal(v);
  }, []);

  const handlePhoneInputChange = useCallback(({ code, phoneNumber }: IPhoneInput) => {
    setPhoneValue({ code, phoneNumber });
  }, []);

  const handleSocialVerify = useCallback(() => {
    // TODO: store opGuardian
  }, []);

  const renderGuardianAccount = useMemo(
    () => ({
      [LoginType.Email]: {
        element: (
          <Input
            className="login-input"
            value={emailVal}
            placeholder={t('Enter email')}
            onChange={(e) => {
              handleEmailInputChange(e.target.value);
            }}
          />
        ),
        label: t('Guardian Email'),
      },
      [LoginType.Phone]: {
        element: <PhoneInput onChange={handlePhoneInputChange} />,
        label: t('Guardian Phone'),
      },
      [LoginType.Google]: {
        element: (
          <div className="social">
            {socialValue?.value ? (
              <div className="flex-column social-input detail">
                <span className="name">{socialValue.name}</span>
                <span className="email">{socialValue.value}</span>
              </div>
            ) : (
              <div className="flex social-input click" onClick={handleSocialVerify}>
                <span className="click-text">Click Add Google Account</span>
              </div>
            )}
          </div>
        ),
        label: t('Guardian Google'),
      },
      [LoginType.Apple]: {
        element: (
          <div className="social">
            {socialValue?.value ? (
              <div className="flex-column social-input detail">
                <span className="name">{socialValue.name}</span>
                <span className="email">{socialValue.value}</span>
              </div>
            ) : (
              <div className="flex social-input click" onClick={handleSocialVerify}>
                <span className="click-text">Click Add Apple Account</span>
              </div>
            )}
          </div>
        ),
        label: t('Guardian Apple'),
      },
    }),
    [emailVal, handleEmailInputChange, handlePhoneInputChange, handleSocialVerify, socialValue, t],
  );

  const handleCheck = useCallback(() => {
    if (guardianType === LoginType.Email) {
      if (!EmailReg.test(emailVal as string)) {
        setEmailErr(EmailError.invalidEmail);
        return;
      }
    }
    if (!selectVerifierItem) return message.error('Can not get the current verifier message');
    const isExist: boolean =
      Object.values(userGuardiansList ?? {})?.some((item) => {
        return item.key === curKey;
      }) ?? false;
    setExist(isExist);
    !isExist && setVisible(true);
  }, [emailVal, guardianType, selectVerifierItem, userGuardiansList, curKey]);

  const handleCommonVerify = useCallback(
    async (guardianAccount: string) => {
      try {
        dispatch(
          setLoginAccountAction({
            guardianAccount,
            loginType: guardianType as LoginType,
          }),
        );
        setLoading(true);
        dispatch(resetUserGuardianStatus());
        await userGuardianList({ caHash: walletInfo.caHash });
        const result = await verification.sendVerificationCode({
          params: {
            guardianIdentifier: guardianAccount,
            type: LoginType[guardianType as LoginType],
            verifierId: selectVerifierItem?.id || '',
            chainId: DefaultChainId,
          },
        });
        setLoading(false);
        if (result.verifierSessionId) {
          const newGuardian: UserGuardianItem = {
            isLoginAccount: false,
            verifier: selectVerifierItem,
            guardianAccount,
            guardianType: guardianType as LoginType,
            verifierInfo: {
              sessionId: result.verifierSessionId,
              endPoint: result.endPoint,
            },
            key: curKey,
            isInitStatus: true,
            identifierHash: '',
            salt: '',
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
    },
    [dispatch, curKey, guardianType, navigate, selectVerifierItem, setLoading, userGuardianList, walletInfo.caHash],
  );

  const handleVerify = useCallback(async () => {
    if (guardianType === LoginType.Email) {
      handleCommonVerify(emailVal || '');
    } else if (guardianType === LoginType.Phone) {
      handleCommonVerify(`${phoneValue?.code}${phoneValue?.phoneNumber}`);
    } else {
      navigate('/setting/guardian/guardian-approval', { state: 'guardians/add' });
    }
  }, [emailVal, guardianType, handleCommonVerify, navigate, phoneValue?.code, phoneValue?.phoneNumber]);

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
      {guardianType !== undefined && (
        <div className="input-item">
          <p className="label">{renderGuardianAccount[guardianType].label}</p>
          {renderGuardianAccount[guardianType].element}
          {emailErr && <span className="err-text">{emailErr}</span>}
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
        <p className="modal-content">
          {`${verifierName} will send a verification code to `}
          <span className="bold">{accountShow}</span>
          {` to verify your ${isPhoneType ? 'phone number' : 'email address'}.`}
        </p>
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
