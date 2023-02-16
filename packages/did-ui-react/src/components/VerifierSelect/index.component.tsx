import { Button } from 'antd';
import CommonModal from '../CommonModal';
import { useCallback, useMemo, useState } from 'react';
import BaseVerifierIcon from '../BaseVerifierIcon';
import CommonSelect from '../CommonSelect';
import { useTranslation } from 'react-i18next';
import { errorTip, verifyErrorHandler } from '../../utils/errorHandler';
import { LoginType } from '@portkey/types/types-ca/wallet';
import { setLoading } from '../../utils/loading';
import clsx from 'clsx';
import { VerifierItem } from '@portkey/types/verifier';
import { LoginStrType } from '@portkey/constants/constants-ca/guardian';
import { DefaultChainId } from '@portkey/constants/constants-ca/network';
import { useUpdateEffect } from 'react-use';
import { OnErrorFunc } from '../../types/error';
import { verification } from '../config-provider/api';
import './index.less';

export interface VerifierSelectProps {
  serviceUrl: string;
  verifierList?: VerifierItem[];
  defaultVerifier?: string;
  guardianAccount: string;
  className?: string;
  loginType?: LoginType;
  isErrorTip?: boolean;
  onError?: OnErrorFunc;
  onConfirm?: (result: { verifier: VerifierItem; verifierSessionId: string; endPoint: string }) => void;
}

export default function VerifierSelect({
  className,
  serviceUrl,
  isErrorTip,
  verifierList,
  guardianAccount,
  loginType = LoginType.email,
  defaultVerifier,
  onError,
  onConfirm,
}: VerifierSelectProps) {
  const [open, setOpen] = useState<boolean>();
  const { t } = useTranslation();

  const selectItems = useMemo(
    () =>
      verifierList?.map((item) => ({
        value: item.id,
        iconUrl: item.imageUrl ?? '',
        label: item.name,
        url: item.endPoints[0],
        icon: <img src={item.imageUrl} />,
        id: item.id,
      })),
    [verifierList],
  );
  const _defaultVerifier = useMemo(() => defaultVerifier || selectItems?.[0]?.value, [defaultVerifier, selectItems]);

  const handleChange = useCallback((value: string) => {
    setSelectVal(value);
  }, []);

  const [selectVal, setSelectVal] = useState<string | undefined>(_defaultVerifier);

  useUpdateEffect(() => {
    setSelectVal((v) => {
      console.log(v);
      return v ? v : _defaultVerifier;
    });
  }, [_defaultVerifier]);

  const selectItem = useMemo(() => verifierList?.find((item) => item.id === selectVal), [selectVal, verifierList]);

  const verifyHandler = useCallback(async () => {
    try {
      if (!selectItem)
        return errorTip(
          {
            errorFields: 'VerifierSelect',
            error: 'Can not get verification',
          },
          isErrorTip,
          onError,
        );

      setLoading(true);

      const result = await verification.sendVerificationCode({
        baseURL: serviceUrl,
        params: {
          guardianAccount,
          type: LoginStrType[loginType],
          verifierId: selectItem.id,
          chainId: DefaultChainId,
        },
      });
      setLoading(false);
      setOpen(false);
      if (result.verifierSessionId) {
        onConfirm?.({ verifier: selectItem, ...result });
      }
    } catch (error: any) {
      setLoading(false);
      console.log(error, 'verifyHandler==error');
      const _error = verifyErrorHandler(error);

      errorTip(
        {
          errorFields: 'VerifierSelect',
          error: _error,
        },
        isErrorTip,
        onError,
      );
    }
  }, [guardianAccount, isErrorTip, loginType, onConfirm, onError, selectItem, serviceUrl]);

  return (
    <div className={clsx('portkey-ui-select-verifier-wrapper', className)}>
      <div className="select-verifier-content" id="select-verifier-content">
        <div className="select-verifier-inner">
          <div className="select-verifier-title">{t('Select verifier')}</div>
          <p className="select-verifier-description">
            {t('The recovery of decentralized accounts requires approval from your verifiers')}
          </p>
          <CommonSelect className="verifier-select" value={selectVal} onChange={handleChange} items={selectItems} />
          <p className="popular-title">{t('Popular')}</p>
          <ul className="popular-content">
            {selectItems?.slice(0, 3)?.map((item) => (
              <li key={item.value} className="popular-item" onClick={() => handleChange(item.value)}>
                <BaseVerifierIcon src={item.iconUrl} rootClassName="popular-item-image" />
                <p className="popular-item-name">{item.label}</p>
              </li>
            ))}
          </ul>
        </div>

        <Button
          className="confirm-btn"
          type="primary"
          onClick={() => {
            if (!guardianAccount)
              return errorTip(
                {
                  errorFields: 'VerifierSelect',
                  error: 'Missing parameter guardianAccount',
                },
                isErrorTip,
                onError,
              );

            setOpen(true);
          }}>
          {t('Confirm')}
        </Button>
      </div>
      <CommonModal
        getContainer={'#select-verifier-content'}
        className="verify-confirm-modal"
        closable={false}
        open={open}
        width={320}
        onCancel={() => setOpen(false)}>
        <p className="modal-content">
          {`${
            selectItem?.name ?? ''
          } will send a verification code to ${guardianAccount} to verify your email address.`}
        </p>
        <div className="btn-wrapper">
          <Button onClick={() => setOpen(false)}>{t('Cancel')}</Button>
          <Button type="primary" onClick={verifyHandler}>
            {t('Confirm')}
          </Button>
        </div>
      </CommonModal>
    </div>
  );
}
