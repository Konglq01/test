import { AddressBookItem } from '@portkey/types/addressBook';
import { Button } from 'antd';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import './index.less';

export default function AddressBookContent({
  initialValues,
  onEdit,
  className,
}: {
  initialValues?: AddressBookItem;
  className?: string;
  onEdit?: () => void;
}) {
  const { t } = useTranslation();
  return (
    <div className={clsx('contact-info-content', className)}>
      <div className="contact-name">{initialValues?.name}</div>
      <div className="action-btn">
        <Button type="default" onClick={onEdit}>
          {t('Edit')}
        </Button>
      </div>
      <div className="contact-address">
        <p>{t('Address')}</p>
        <p>{initialValues?.address}</p>
      </div>
    </div>
  );
}
