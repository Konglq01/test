import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import CreateWalletForm, { OnCreateCallback } from '../CreateWalletForm';
import './index.less';

export default function CreateWalletPage({
  className,
  loading,
  onCreate,
}: {
  className?: string;
  loading?: boolean;
  onCreate?: OnCreateCallback;
}) {
  const { t } = useTranslation();

  return (
    <div className={clsx('create-wallet-content', className)}>
      <h2>{t('Create a Name and Password')}</h2>
      <p>{t('This password is used to unlock your wallet only on this device')}</p>
      <CreateWalletForm onCreate={onCreate} loading={loading} />
    </div>
  );
}
