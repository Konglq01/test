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
import { useCurrentWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import {
  resetUserGuardianStatus,
  setCurrentGuardianAction,
  setOpGuardianAction,
} from '@portkey-wallet/store/store-ca/guardians/actions';
import useGuardianList from 'hooks/useGuardianList';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { setLoginAccountAction } from 'store/reducers/loginCache/actions';
import { VerifierItem } from '@portkey-wallet/types/verifier';
import BaseVerifierIcon from 'components/BaseVerifierIcon';
import { contractErrorHandler } from 'utils/tryErrorHandler';

export default function GuardiansEdit() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentGuardian, userGuardiansList, preGuardian, opGuardian } = useGuardiansInfo();
  const { verifierMap } = useGuardiansInfo();
  const [removeOpen, setRemoveOpen] = useState<boolean>();
  const [removeClose, setRemoveClose] = useState<boolean>(false);
  const [selectVal, setSelectVal] = useState<string>(opGuardian?.verifier?.id as string);
  const [selectName, setSelectName] = useState<string>(opGuardian?.verifier?.name as string);
  const [exist, setExist] = useState<boolean>(false);
  const { walletInfo } = useCurrentWallet();
  const userGuardianList = useGuardianList();
  const dispatch = useAppDispatch();
  const { setLoading } = useLoading();

  const selectOptions = useMemo(
    () =>
      Object.values(verifierMap ?? {})?.map((item: VerifierItem) => ({
        value: item.id,
        children: (
          <div className="flex verifier-option">
            <BaseVerifierIcon width={32} height={32} src={item.imageUrl} />
            <span className="title">{item.name}</span>
          </div>
        ),
      })),
    [verifierMap],
  );

  const disabled = useMemo(() => exist || selectVal === preGuardian?.verifier?.id, [exist, selectVal, preGuardian]);

  const targetVerifier = useCallback(
    () => Object.values(verifierMap ?? {})?.filter((item: VerifierItem) => item.id === selectVal),
    [selectVal, verifierMap],
  );

  const handleChange = useCallback(
    (value: string) => {
      setExist(false);
      setSelectVal(value);
      setSelectName(verifierMap?.[value]?.name || '');
    },
    [verifierMap],
  );

  const guardiansChangeHandler = useCallback(async () => {
    const flag: boolean =
      Object.values(userGuardiansList ?? {})?.some((item) => {
        return item.key === `${currentGuardian?.guardianAccount}&${selectName}`;
      }) ?? false;
    setExist(flag);
    if (flag) return;
    try {
      dispatch(
        setLoginAccountAction({
          guardianAccount: opGuardian?.guardianAccount as string,
          loginType: opGuardian?.guardianType as LoginType,
        }),
      );
      setLoading(true);
      dispatch(resetUserGuardianStatus());
      await userGuardianList({ caHash: walletInfo.caHash });
      dispatch(
        setOpGuardianAction({
          key: `${currentGuardian?.guardianAccount}&${selectName}`,
          verifier: targetVerifier()?.[0],
          isLoginAccount: opGuardian?.isLoginAccount,
          guardianAccount: opGuardian?.guardianAccount as string,
          guardianType: opGuardian?.guardianType as LoginType,
        }),
      );
      setLoading(false);
      navigate('/setting/guardians/guardian-approval', { state: 'guardians/edit' });
    } catch (error: any) {
      setLoading(false);
      console.log('---edit-guardian-error', error);
      message.error(contractErrorHandler(error));
    }
  }, [
    currentGuardian,
    dispatch,
    navigate,
    opGuardian,
    selectName,
    setLoading,
    targetVerifier,
    userGuardianList,
    userGuardiansList,
    walletInfo.caHash,
  ]);

  const checkRemove = useCallback(() => {
    if (opGuardian?.isLoginAccount) {
      setRemoveClose(true);
    } else {
      setRemoveOpen(true);
    }
  }, [opGuardian?.isLoginAccount]);

  const removeHandler = useCallback(async () => {
    dispatch(
      setLoginAccountAction({
        guardianAccount: opGuardian?.guardianAccount as string,
        loginType: opGuardian?.guardianType as LoginType,
      }),
    );
    dispatch(resetUserGuardianStatus());
    await userGuardianList({ caHash: walletInfo.caHash });
    dispatch(
      setCurrentGuardianAction({
        isLoginAccount: opGuardian?.isLoginAccount,
        verifier: opGuardian?.verifier,
        guardianAccount: opGuardian?.guardianAccount as string,
        guardianType: opGuardian?.guardianType as LoginType,
        key: opGuardian?.key as string,
      }),
    );
    navigate('/setting/guardians/guardian-approval', { state: 'guardians/del' }); // status
  }, [opGuardian, dispatch, navigate, userGuardianList, walletInfo.caHash]);

  return (
    <div className="edit-guardians-page">
      <div className="edit-guardians-title">
        <SettingHeader
          title={t('Edit Guardians')}
          leftCallBack={() => {
            navigate('/setting/guardians/view');
          }}
          rightElement={<CustomSvg type="Close2" onClick={() => navigate('/setting/guardians')} />}
        />
      </div>
      <div className="input-item">
        <p className="label">{t('Guardian Type')}</p>
        <p className="control">{currentGuardian?.guardianAccount}</p>
      </div>
      <div className="input-item">
        <p className="label">{t('Verifier')}</p>
        <CustomSelect className="select" value={selectVal} onChange={handleChange} items={selectOptions} />
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
        <div className="only-login-account">
          <Button type="primary" onClick={() => setRemoveClose(false)}>
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
