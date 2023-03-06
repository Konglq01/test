import { Button, Input } from 'antd';
import CommonModal, { CommonModalProps } from 'components/CommonModal';
import { forwardRef, useCallback, useImperativeHandle, useMemo, useState } from 'react';
import { AESEncryptWalletParam } from 'types/wallet';
import QRCode from 'qrcode.react';
import Copy from 'components/Copy';
import CommonLink from 'components/CommonLink';
import { addressFormat, getExploreLink } from '@portkey-wallet/utils';
import ExportPrivateKey from '../ExportPrivateKey';
import RemoveAccount from '../RemoveAccount';
import { AccountType } from '@portkey-wallet/types/wallet';
import './index.less';
import CustomSvg from 'components/CustomSvg';
import clsx from 'clsx';
import { ChainItemType } from '@portkey-wallet/types/chain';
import { useTranslation } from 'react-i18next';

interface AccountCardProps extends CommonModalProps {
  accountInfo: AccountType;
  currentChain: ChainItemType;
  onClose?: () => void;
  onSaveAccountName?: () => void;
  onRemoveAccount?: () => void;
  onExportPrivateKeyClick?: () => void;
}

enum AccountCardStep {
  ViewDetail,
  ExportPrivateKey,
  RemoveAccount,
}

const AccountCard = forwardRef(
  (
    {
      accountInfo,
      currentChain,
      onClose,
      onSaveAccountName,
      onRemoveAccount,
      onExportPrivateKeyClick,
      className,
      ...props
    }: AccountCardProps & AESEncryptWalletParam,
    ref,
  ) => {
    const { t } = useTranslation();
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [name, setName] = useState<string>(accountInfo.accountName);
    const [step, setStep] = useState<AccountCardStep>(AccountCardStep.ViewDetail);
    const [removeOpen, setRemoveOpen] = useState<boolean>(false);
    const getAccountName = useCallback(() => name, [name]);

    useImperativeHandle(ref, () => ({
      getAccountName,
      setRemoveOpen: (removeOpen = false) => setRemoveOpen(removeOpen),
      setEdit: (isEdit = false) => setIsEdit(isEdit),
    }));

    const onCancel = useCallback(() => {
      setStep(AccountCardStep.ViewDetail);
      setIsEdit(false);
      setName(accountInfo.accountName);
      onClose?.();
    }, [accountInfo.accountName, onClose]);

    const handleClose = useCallback(() => {
      if ([AccountCardStep.ExportPrivateKey, AccountCardStep.RemoveAccount].includes(step)) {
        return setStep(AccountCardStep.ViewDetail);
      }

      return onCancel();
    }, [onCancel, step]);

    const title = useMemo(() => {
      if (step === AccountCardStep.ExportPrivateKey) {
        return (
          <div className="account-edit-header" onClick={handleClose}>
            <CustomSvg type="BackLeft" style={{ width: 24, height: 24 }} />
            <span className="back">{t('Show Private Key')}</span>
          </div>
        );
      }

      return '';
    }, [handleClose, step]);

    return (
      <CommonModal
        className={clsx([step === AccountCardStep.ExportPrivateKey && 'edit-status', className])}
        title={title}
        {...props}
        onCancel={handleClose}>
        {step === AccountCardStep.ViewDetail && (
          <>
            <div className="account-information">
              <div className={clsx(['account-name', isEdit && 'edit'])}>
                {isEdit ? (
                  <>
                    <Input className="edit-ipt" maxLength={30} value={name} onChange={(e) => setName(e.target.value)} />
                    <CustomSvg onClick={onSaveAccountName} type="Tick" style={{ width: 16, height: 16 }} />
                  </>
                ) : (
                  <>
                    <span className="name">{accountInfo.accountName}</span>
                    <CustomSvg onClick={() => setIsEdit(true)} type="Edit" style={{ width: 16, height: 16 }} />
                  </>
                )}
              </div>
              <QRCode className="qrc" value={accountInfo.address} style={{ width: 140, height: 140 }} />
              <div className="address-wrapper">
                <div className="address">
                  {addressFormat(accountInfo.address, currentChain.chainId, currentChain.chainType)}
                </div>
                <Copy
                  className="copy"
                  toCopy={addressFormat(accountInfo.address, currentChain.chainId, currentChain.chainType)}
                />
              </div>
            </div>
            <div className="account-actions-wrapper">
              <div className="account-actions">
                {currentChain?.blockExplorerURL && (
                  <CommonLink
                    className="btn-base"
                    href={getExploreLink(currentChain.blockExplorerURL, accountInfo.address)}>
                    {t('View on Explorer')}
                  </CommonLink>
                )}
                <Button
                  className="btn-base"
                  onClick={() => {
                    onExportPrivateKeyClick ? onExportPrivateKeyClick() : setStep(AccountCardStep.ExportPrivateKey);
                  }}>
                  {t('Show Private Key')}
                </Button>
                {accountInfo.accountType === 'Import' && (
                  <Button className="btn-base remove" onClick={() => setRemoveOpen(true)}>
                    {t('Remove Account')}
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
        {step === AccountCardStep.ExportPrivateKey && (
          <ExportPrivateKey
            accountInfo={accountInfo}
            AESEncryptPrivateKey={accountInfo.AESEncryptPrivateKey}
            onClose={onCancel}
            onBack={() => setStep(AccountCardStep.ViewDetail)}
          />
        )}
        <CommonModal
          className="remove-account-modal"
          open={removeOpen}
          closable={false}
          width={320}
          title={
            <div className="remove-account-title">
              <div className="txt">{t('Remove Account?')}</div>
              <CustomSvg onClick={() => setRemoveOpen(false)} type="Close2" style={{ width: 18, height: 18 }} />
            </div>
          }>
          <RemoveAccount accountInfo={accountInfo} onBack={() => setRemoveOpen(false)} onRemove={onRemoveAccount} />
        </CommonModal>
      </CommonModal>
    );
  },
);

export default AccountCard;

export interface AccountCardInstance {
  getAccountName: () => string | undefined;
  setEdit: (v?: boolean) => void;
  setRemoveOpen: (v?: boolean) => void;
}
