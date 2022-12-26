import { AddressBookError } from '@portkey/store/addressBook/types';
import { AddressBookItem, AddressBookType } from '@portkey/types/addressBook';
import { ChainItemType } from '@portkey/types/chain';
import { addressFormat, isAddress } from '@portkey/utils';
import { Button, Form, Input, message, Modal } from 'antd';
import { InfoCircleFilled } from '@ant-design/icons';
import { ValidatorRule } from 'rc-field-form/lib/interface';
import { useState } from 'react';
import clsx from 'clsx';
import { useCallback } from 'react';
import type { EditType } from 'types';
import { formatToAddress } from 'utils';
import './index.less';
import { useTranslation } from 'react-i18next';

const { Item: FormItem } = Form;

export const validatorName: (
  addressBook: AddressBookType,
  currentChain: ChainItemType,
  t: (text: string) => string,
  initialValues?: AddressBookItem,
) => ValidatorRule['validator'] = (addressBook, currentChain, t, initialValues) => (_, name) => {
  if (!name) return Promise.reject(t(AddressBookError.noName));
  const isExists = (addressBook[`${currentChain.rpcUrl}&${currentChain.networkName}`] ?? []).some(
    (item) => item.name === name.trim() && item.key !== initialValues?.key,
  );
  if (isExists) return Promise.reject(t(AddressBookError.alreadyExists));
  return Promise.resolve('');
};

export const validatorAddress: (
  currentChain: ChainItemType,
  t: (text: string) => string,
) => ValidatorRule['validator'] = (currentChain, t) => (_, _address: string) => {
  if (!_address) return Promise.reject(t(AddressBookError.invalidAddress));
  const address = addressFormat(_address, currentChain.chainId, currentChain.chainType);
  if (!isAddress(address ?? '', currentChain.chainType)) return Promise.reject(t(AddressBookError.invalidAddress));
  return Promise.resolve('');
};

export interface AddressBookInfoProps {
  type?: EditType;
  initialValues?: AddressBookItem;
  currentChain: ChainItemType;
  onSave?: (v: AddressBookItem) => void;
  onRemove?: (v?: AddressBookItem) => void;
  validatorName?: ValidatorRule['validator'];
  validatorAddress?: ValidatorRule['validator'];
}

export default function AddressBookInfo({
  type = 'edit',
  initialValues,
  currentChain,
  onSave,
  onRemove,
  validatorName,
  validatorAddress,
}: AddressBookInfoProps) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const onFinish = useCallback(
    async (values: AddressBookItem) => {
      try {
        await form.validateFields();
        onSave?.({ ...(initialValues ?? {}), ...values });
      } catch (e: any) {
        console.log((e.errorMessage || {}).message || e.message || 'Please input the required form field', 'onFinish');
        message.error(t((e.errorMessage || {}).message || e.message || 'Please input the required form field'));
      }
    },
    [form, initialValues, onSave],
  );

  const [name, setName] = useState<string>(initialValues?.name ?? '');
  const [address, setAddress] = useState<string>(initialValues?.address ?? '');

  return (
    <Form
      autoComplete="off"
      className="flex-column address-book-info-form"
      form={form}
      initialValues={
        initialValues
          ? {
              ...initialValues,
              address: formatToAddress(initialValues.address),
            }
          : undefined
      }
      requiredMark={false}
      validateTrigger={false}
      layout="vertical"
      onValuesChange={(v) => {
        if ('name' in v) setName(v.name);
        if ('address' in v) setAddress(v.address);
      }}
      onFinish={onFinish}>
      <div className="form-content">
        <FormItem
          name="name"
          label={t('Name')}
          rules={[
            {
              required: true,
              validator: validatorName,
            },
          ]}>
          <Input placeholder={t('Enter Address Name')} maxLength={30} />
        </FormItem>
        <FormItem
          name="address"
          required
          label={t('Address')}
          rules={[
            {
              required: true,
              validator: validatorAddress,
            },
          ]}>
          <Input
            placeholder={t("Enter Contact's Address")}
            {...(currentChain?.chainType === 'ethereum'
              ? {}
              : { addonBefore: 'ELF', addonAfter: currentChain?.chainId ?? 'AELF' })}
          />
        </FormItem>
        {currentChain?.chainType !== 'ethereum' && (
          <p className="address-tips">
            <InfoCircleFilled />
            {t('Please confirm the network you are in by checking the suffix.')}
          </p>
        )}
      </div>
      <div className={clsx(['action-wrapper', type === 'view' && 'edit'])}>
        {type === 'view' && (
          <Button
            type="text"
            danger
            onClick={() => {
              Modal.confirm({
                wrapClassName: 'delete-contact',
                width: 320,
                content: t('Delete Contact?'),
                className: 'delete-modal',
                icon: null,
                centered: true,
                okText: t('Yes'),
                cancelText: t('No'),
                onOk: () => onRemove?.(initialValues),
              });
            }}>
            {t('Delete')}
          </Button>
        )}
        <Button disabled={!(name && address)} type="primary" htmlType="submit">
          {t('Save')}
        </Button>
      </div>
    </Form>
  );
}
