import { Button, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import CommonModal from 'components/CommonModal';
import CustomSvg from 'components/CustomSvg';
import SettingHeader from 'pages/components/SettingHeader';
import { useCallback, useMemo, useState } from 'react';
import { useAppDispatch, useGuardiansInfo, useLoading } from 'store/Provider/hooks';
import './index.less';
import CustomSelect from 'pages/components/CustomSelect';
import { useCurrentWallet } from '@portkey/hooks/hooks-ca/wallet';
import {
  resetUserGuardianStatus,
  setCurrentGuardianAction,
  setOpGuardianAction,
  setPreGuardianAction,
} from '@portkey/store/store-ca/guardians/actions';
import useGuardianList from 'hooks/useGuardianList';
import { LoginType } from '@portkey/types/types-ca/wallet';
import { setLoginAccountAction } from 'store/reducers/loginCache/actions';
import { VerifierItem } from '@portkey/types/verifier';
import BaseVerifierIcon from 'components/BaseVerifierIcon';

export default function GuardiansEdit() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentGuardian, userGuardiansList } = useGuardiansInfo();
  const { verifierMap } = useGuardiansInfo();
  const [removeOpen, setRemoveOpen] = useState<boolean>();
  const [removeClose, setRemoveClose] = useState<boolean>(false);
  const [selectVal, setSelectVal] = useState<string>(currentGuardian?.verifier?.name as string);
  const [exist, setExist] = useState<boolean>(false);
  const { walletInfo } = useCurrentWallet();
  const userGuardianList = useGuardianList();
  const dispatch = useAppDispatch();
  const { setLoading } = useLoading();

  const selectOptions = useMemo(
    () =>
      Object.values(verifierMap ?? {})?.map((item: VerifierItem) => ({
        value: item.name,
        children: (
          <div className="flex verifier-option">
            <BaseVerifierIcon width={32} height={32} src={item.imageUrl} />
            <span className="title">{item.name}</span>
          </div>
        ),
      })),
    [verifierMap],
  );
  const disabled = useMemo(
    () => exist || selectVal === currentGuardian?.verifier?.name,
    [exist, selectVal, currentGuardian],
  );

  const targetVerifier = () =>
    Object.values(verifierMap ?? {})?.filter((item: VerifierItem) => item.name === selectVal);

  const handleChange = useCallback((value: string) => {
    setExist(false);
    setSelectVal(value);
  }, []);

  const guardiansChangeHandler = async () => {
    const flag: boolean =
      Object.values(userGuardiansList ?? {})?.some((item) => {
        return item.loginGuardianType === currentGuardian?.loginGuardianType && item.verifier?.name === selectVal;
      }) ?? false;
    setExist(flag);
    if (!flag) {
      try {
        dispatch(
          setLoginAccountAction({
            loginGuardianType: currentGuardian?.loginGuardianType as string,
            accountLoginType: LoginType.email,
          }),
        );
        setLoading(true);
        dispatch(resetUserGuardianStatus());
        await userGuardianList({ caHash: walletInfo.caHash });
        dispatch(
          setPreGuardianAction({
            isLoginAccount: currentGuardian?.isLoginAccount,
            verifier: currentGuardian?.verifier,
            loginGuardianType: currentGuardian?.loginGuardianType as string,
            guardiansType: currentGuardian?.guardiansType as LoginType,
            key: currentGuardian?.key as string,
          }),
        );
        dispatch(
          setOpGuardianAction({
            isLoginAccount: currentGuardian?.isLoginAccount,
            verifier: targetVerifier()?.[0],
            loginGuardianType: currentGuardian?.loginGuardianType as string,
            guardiansType: currentGuardian?.guardiansType as LoginType,
            key: `${currentGuardian?.loginGuardianType}&${selectVal}`,
          }),
        );
        dispatch(
          setCurrentGuardianAction({
            isLoginAccount: currentGuardian?.isLoginAccount,
            verifier: targetVerifier()?.[0],
            loginGuardianType: currentGuardian?.loginGuardianType as string,
            guardiansType: currentGuardian?.guardiansType as LoginType,
            key: `${currentGuardian?.loginGuardianType}&${selectVal}`,
            isInitStatus: true,
          }),
        );
        setLoading(false);
        navigate('/setting/guardians/guardian-approval', { state: 'guardians/edit' }); // status
      } catch (error: any) {
        setLoading(false);
        console.log('---edit-guardian-error', error);
        message.error(error?.Error?.Message || error.message?.Message || error?.message);
      }
    }
  };

  const checkRemove = () => {
    if (currentGuardian?.isLoginAccount) {
      setRemoveClose(true);
    } else {
      setRemoveOpen(true);
    }
  };

  const removeHandler = async () => {
    dispatch(
      setLoginAccountAction({
        loginGuardianType: currentGuardian?.loginGuardianType as string,
        accountLoginType: LoginType.email,
      }),
    );
    dispatch(resetUserGuardianStatus());
    await userGuardianList({ caHash: walletInfo.caHash });
    dispatch(
      setOpGuardianAction({
        isLoginAccount: currentGuardian?.isLoginAccount,
        verifier: currentGuardian?.verifier,
        loginGuardianType: currentGuardian?.loginGuardianType as string,
        guardiansType: currentGuardian?.guardiansType as LoginType,
        key: currentGuardian?.key as string,
      }),
    );
    navigate('/setting/guardians/guardian-approval', { state: 'guardians/del' }); // status
  };

  return (
    <div className="edit-guardians-page">
      <div className="edit-guardians-title">
        <SettingHeader
          title="Edit Guardians"
          leftCallBack={() => {
            navigate('/setting/guardians/view');
          }}
          rightElement={<CustomSvg type="Close2" onClick={() => navigate('/setting/guardians')} />}
        />
      </div>
      <div className="input-item">
        <p className="label">Guardian Type</p>
        <p className="control">{currentGuardian?.loginGuardianType}</p>
      </div>
      <div className="input-item">
        <p className="label">Verifier</p>
        <CustomSelect
          className="select"
          value={selectVal}
          style={{ width: '100%' }}
          onChange={handleChange}
          items={selectOptions}
        />
        {exist && <div className="error">{t('This guardian already exists')}</div>}
      </div>
      <div className="btn-wrap">
        <Button className="warning" onClick={checkRemove}>
          {t('Remove')}
        </Button>
        <Button onClick={guardiansChangeHandler} disabled={disabled} type="primary">
          {t('Send Request')}
        </Button>
      </div>
      <CommonModal
        open={removeClose}
        closable={false}
        width={320}
        className={'remove-modal'}
        onCancel={() => setRemoveOpen(false)}>
        <p className="modal-content">{t('This guardian is login account and cannot be remove')}</p>
        <div style={{ padding: '15px 16px 17px 16px' }}>
          <Button type="primary" style={{ borderRadius: 24 }} onClick={() => setRemoveClose(false)}>
            {t('OK')}
          </Button>
        </div>
      </CommonModal>
      <CommonModal
        open={removeOpen}
        closable={false}
        width={320}
        className={'remove-modal'}
        onCancel={() => setRemoveOpen(false)}
        title={t('Are you sure you want to remove this guardian?')}>
        <div className="description">{t("Removing a guardian requires guardians' approval")}</div>
        <div className="btn-wrap">
          <Button onClick={() => setRemoveOpen(false)}>{t('Close')}</Button>
          <Button type="primary" onClick={removeHandler}>
            {t('Send Request')}
          </Button>
        </div>
      </CommonModal>
    </div>
  );
}
