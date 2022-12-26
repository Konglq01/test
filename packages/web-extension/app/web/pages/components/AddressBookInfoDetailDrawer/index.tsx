import { useMemo } from 'react';
import CustomSvg from 'components/CustomSvg';
import { EditType } from 'types';
import { AddressBookInfoProps } from '../AddressBookInfo';
import BaseDrawer from '../BaseDrawer';
import SettingHeader from '../SettingHeader';
import './index.less';
import AddressBookContent from './AddressBookContent';

interface AddressBookInfoDetailDrawerProps extends Omit<AddressBookInfoProps, 'currentChain'> {
  open?: boolean;
  type: EditType;
  onEdit?: () => void;
  onClose?: () => void;
}

export default function AddressBookInfoDetailDrawer({
  open,
  onEdit,
  onClose,
  initialValues,
}: AddressBookInfoDetailDrawerProps) {
  const rightElement = useMemo(
    () => <CustomSvg type="Close2" onClick={onClose} style={{ width: 18, height: 18 }} />,
    [onClose],
  );
  return (
    <BaseDrawer
      className="contact-detail-drawer"
      title={<SettingHeader title="Details" leftCallBack={onClose} rightElement={rightElement} />}
      destroyOnClose
      placement="right"
      open={open}
      onClose={onClose}>
      <AddressBookContent initialValues={initialValues} onEdit={onEdit} />
    </BaseDrawer>
  );
}
