import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import CommonModal from 'components/CommonModal';
import CustomSvg from 'components/CustomSvg';
import SettingHeader from 'pages/components/SettingHeader';
import { useCallback, useMemo, useState } from 'react';
import { useAppDispatch, useGuardiansInfo } from 'store/Provider/hooks';
import './index.less';
import CustomSelect from 'pages/components/CustomSelect';
import { useCurrentWallet } from '@portkey/hooks/hooks-ca/wallet';
import { resetUserGuardianStatus } from '@portkey/store/store-ca/guardians/actions';
import useGuardianList from 'hooks/useGuardianList';
import { LoginType } from '@portkey/types/types-ca/wallet';
import { setLoginAccountAction } from 'store/reducers/loginCache/actions';

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

  const selectOptions = useMemo(
    () =>
      Object.values(verifierMap ?? {})?.map((item: any) => ({
        value: item.name,
        children: (
          <div className="flex verifier-option">
            <img src={item.imageUrl} alt="icon" />
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

  const handleChange = useCallback((value: string) => {
    setExist(false);
    setSelectVal(value);
  }, []);
  console.log(currentGuardian, 'currentGuardian===');

  const guardiansChangeHandler = () => {
    const flag: boolean =
      Object.values(userGuardiansList ?? {})?.some((item) => {
        return item.loginGuardianType === currentGuardian?.loginGuardianType && item.verifier?.name === selectVal;
      }) ?? false;
    setExist(flag);
    if (!flag) {
      navigate('/setting/guardians/guardian-approval', { state: 'guardians/edit' }); // status
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
    await userGuardianList(walletInfo.managerInfo?.loginGuardianType as string);
    navigate('/setting/guardians/guardian-approval', { state: 'guardians/edit' }); // status
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
        {exist && <div className="error">{t('This guardians is already exists')}</div>}
      </div>
      <div className="btn-wrap">
        <Button className="warning" onClick={checkRemove}>
          {t('Remove')}
        </Button>
        <Button onClick={guardiansChangeHandler} disabled={disabled} type="primary">
          {t('Guardians Approval')}
        </Button>
      </div>
      <CommonModal
        open={removeClose}
        closable={false}
        width={320}
        className={'remove-modal'}
        onCancel={() => setRemoveOpen(false)}
        title={t('The guardian is login account and cannot be remove')}
        footer={
          <Button type="primary" onClick={() => setRemoveClose(false)}>
            {t('OK')}
          </Button>
        }
      />
      <CommonModal
        open={removeOpen}
        closable={false}
        width={320}
        className={'remove-modal'}
        onCancel={() => setRemoveOpen(false)}
        title={t('Are you sure you want to remove this guardian?')}>
        <div className="description">
          {t('After returning, you will need to re-select the operator and re-do the code verification.')}
        </div>
        <div className="btn-wrap">
          <Button onClick={() => setRemoveOpen(false)}>{t('Cancel')}</Button>
          <Button type="primary" onClick={removeHandler}>
            {t('Guardians Approval')}
          </Button>
        </div>
      </CommonModal>
    </div>
  );
}
