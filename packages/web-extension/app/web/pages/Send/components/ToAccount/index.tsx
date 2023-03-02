import { AddressBookItem } from '@portkey-wallet/types/addressBook';
import { Input } from 'antd';
import CustomSvg from 'components/CustomSvg';
import { FocusEventHandler } from 'react';

interface ToAccountProps {
  value?: AddressBookItem;
  onChange?: (value: AddressBookItem) => void;
  onOpenContactList?: () => void;
  onBlur?: FocusEventHandler<HTMLInputElement> | undefined;
}

export default function ToAccount({ value, onOpenContactList, onChange, onBlur }: ToAccountProps) {
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const address = e.target.value;
    onChange?.({
      name: '',
      address,
    });
  };
  return (
    <div className="to-account">
      <Input
        className={value?.name && 'with-name'}
        value={value?.address}
        placeholder="Account 2"
        onChange={onInputChange}
        onBlur={onBlur}
        suffix={<CustomSvg type="AddressBook2" onClick={onOpenContactList} />}
      />
      <p className="account-name">{value?.name && value?.address && <span>{value?.name}</span>}</p>
    </div>
  );
}
