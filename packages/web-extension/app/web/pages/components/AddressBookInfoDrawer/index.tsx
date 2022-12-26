import { useMemo } from 'react';
import CustomSvg from 'components/CustomSvg';
import { useAddressBook, useNetwork } from 'store/Provider/hooks';
import { EditType } from 'types';
import AddressBookInfo, { AddressBookInfoProps, validatorAddress, validatorName } from '../AddressBookInfo';
import BaseDrawer from '../BaseDrawer';
import SettingHeader from '../SettingHeader';
import './index.less';
import { useTranslation } from 'react-i18next';

interface AddressBookInfoDrawerProps extends Omit<AddressBookInfoProps, 'currentChain'> {
  open?: boolean;
  type: EditType;
  onClose?: () => void;
}

export default function AddressBookInfoDrawer({
  open,
  type,
  onClose,
  initialValues,
  ...props
}: AddressBookInfoDrawerProps) {
  const { t } = useTranslation();
  const { currentChain } = useNetwork();
  const { addressBook } = useAddressBook();

  const rightElement = useMemo(
    () => <CustomSvg type="Close2" onClick={onClose} style={{ width: 18, height: 18 }} />,
    [onClose],
  );

  return (
    <BaseDrawer
      className="add-new-contact-drawer"
      title={
        <SettingHeader
          title={t(type === 'edit' ? 'New Contact' : 'Details')}
          leftCallBack={onClose}
          rightElement={rightElement}
        />
      }
      destroyOnClose
      placement="right"
      open={open}
      onClose={onClose}>
      <AddressBookInfo
        currentChain={currentChain}
        type={type}
        initialValues={initialValues}
        validatorName={validatorName(addressBook, currentChain, t, initialValues)}
        validatorAddress={validatorAddress(currentChain, t)}
        {...props}
      />
    </BaseDrawer>
  );
}
