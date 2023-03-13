import { useCallback, useEffect, useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import { useNavigate, useLocation, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import BackHeader from 'components/BackHeader';
import { ContactItemType, AddressItem } from '@portkey-wallet/types/types-ca/contact';
import { fetchContactListAsync } from '@portkey-wallet/store/store-ca/contact/actions';
import { useAppDispatch, useLoading } from 'store/Provider/hooks';
import CustomSvg from 'components/CustomSvg';
import NetworkDrawer from '../NetworkDrawer';
import DeleteContact from '../DeleteContact';
import { getAelfAddress, isAelfAddress } from '@portkey-wallet/utils/aelf';
import { isValidCAWalletName } from '@portkey-wallet/utils/reg';
import './index.less';
import {
  useAddContact,
  useDeleteContact,
  useEditContact,
  useCheckContactName,
} from '@portkey-wallet/hooks/hooks-ca/contact';
import { useSymbolImages } from '@portkey-wallet/hooks/hooks-ca/useToken';
import { transNetworkText } from '@portkey-wallet/utils/activity';
import { useIsTestnet } from 'hooks/useNetwork';

const { Item: FormItem } = Form;
export enum ContactInfoError {
  invalidAddress = 'Invalid address',
  recipientAddressIsInvalid = 'Recipient address is invalid',
  noName = 'Please enter contact name',
  alreadyExists = 'This name already exists.',
  inValidName = '3-16 characters, only a-z, A-Z, 0-9 and "_" allowed',
}

type ValidateStatus = Parameters<typeof Form.Item>[0]['validateStatus'];
type ValidData = {
  validateStatus: ValidateStatus;
  errorMsg: string;
};
interface CustomAddressItem extends AddressItem {
  networkName: string;
  validData: ValidData;
}
const initAddress: CustomAddressItem = {
  chainId: 'AELF',
  address: '',
  networkName: 'MainChain AELF Testnet',
  validData: { validateStatus: '', errorMsg: '' },
};
export default function EditContact() {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { type } = useParams();
  const appDispatch = useAppDispatch();
  const isEdit = type === 'edit';
  const [disable, setDisabled] = useState<boolean>(true);
  const [netOpen, setNetOpen] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(-1);
  const [delOpen, setDelOpen] = useState<boolean>(false);
  const [validName, setValidName] = useState<ValidData>({ validateStatus: '', errorMsg: '' });
  const [addressArr, setAddressArr] = useState<CustomAddressItem[]>(state?.addresses);
  const addContactApi = useAddContact();
  const editContactApi = useEditContact();
  const deleteContactApi = useDeleteContact();
  const checkExistNameApi = useCheckContactName();
  const { setLoading } = useLoading();
  const symbolImages = useSymbolImages();
  const isTestNet = useIsTestnet();

  useEffect(() => {
    const { addresses } = state;
    const cusAddresses = addresses.map((ads: AddressItem) => ({
      ...ads,
      networkName: transNetworkText(ads.chainId, isTestNet),
      validData: { validateStatus: '', errorMsg: '' },
    }));
    form.setFieldValue('addresses', cusAddresses);
    setAddressArr(cusAddresses);
    isEdit && setDisabled(false);
  }, [form, isEdit, isTestNet, state]);

  const handleSelectNetwork = useCallback((i: number) => {
    setNetOpen(true);
    setIndex(i);
  }, []);

  const handleNetworkChange = useCallback(
    (v: any) => {
      const prevAddresses = form.getFieldValue('addresses');
      prevAddresses.splice(index, 1, {
        address: '',
        networkName: v.networkName,
        chainId: v.chainId,
        validData: { validateStatus: '', errorMsg: '' },
      });
      form.setFieldValue('addresses', [...prevAddresses]);
      const newAddresses = Object.assign(addressArr);
      newAddresses.splice(index, 1, v);
      // addressArr.splice(index, 1, v);
      setAddressArr(newAddresses);
      setNetOpen(false);
      setDisabled(true);
    },
    [addressArr, form, index],
  );

  const handleRemoveAds = useCallback(
    (i: number) => {
      setAddressArr(addressArr.filter((_, j) => j !== i));
    },
    [addressArr],
  );

  const handleFormValueChange = useCallback(() => {
    const { name, addresses } = form.getFieldsValue();
    const flag = addresses.some((ads: Record<string, string>) => !ads?.address);
    const err = addressArr.some((ads) => ads.validData.validateStatus === 'error');
    setDisabled(!name || !addresses.length || flag || err);
  }, [addressArr, form]);

  const handleInputValueChange = useCallback(
    (v: string) => {
      setValidName({ validateStatus: '', errorMsg: '' });
      if (!v) {
        setDisabled(true);
      } else {
        handleFormValueChange();
      }
    },
    [handleFormValueChange],
  );

  const handleAddressChange = useCallback(
    (i: number, value: string) => {
      value = getAelfAddress(value.trim());
      const { addresses } = form.getFieldsValue();
      addresses[i].address = value;
      const newAddresses = Object.assign(addressArr);
      newAddresses[i].validData = { validateStatus: '', errorMsg: '' };
      setAddressArr(newAddresses);
      form.setFieldValue('addresses', [...addresses]);
      handleFormValueChange();
    },
    [addressArr, form, handleFormValueChange],
  );

  const checkExistName = useCallback(
    async (v: string) => {
      if (isEdit && state.name === v) {
        return false;
      }
      const { existed } = await checkExistNameApi(v);
      return existed;
    },
    [checkExistNameApi, isEdit, state.name],
  );

  const handleCheckName = useCallback(
    async (v: string) => {
      const existed = await checkExistName(v);
      if (!v) {
        form.setFieldValue('name', '');
        setValidName({ validateStatus: 'error', errorMsg: ContactInfoError.noName });
        setDisabled(true);
        return false;
      } else if (existed) {
        setDisabled(true);
        setValidName({ validateStatus: 'error', errorMsg: ContactInfoError.alreadyExists });
        return false;
      } else if (!isValidCAWalletName(v)) {
        setDisabled(true);
        setValidName({ validateStatus: 'error', errorMsg: ContactInfoError.inValidName });
        return false;
      }
      setDisabled(false);
      setValidName({ validateStatus: '', errorMsg: '' });
      return true;
    },
    [checkExistName, form],
  );

  const handleCheckAddress = useCallback(
    (addresses: AddressItem[]) => {
      let flag = 0;
      const newAddress = Object.assign(addressArr);
      addresses.forEach((ads, i) => {
        if (!isAelfAddress(ads.address)) {
          flag++;
          newAddress[i].validData = { validateStatus: 'error', errorMsg: ContactInfoError.invalidAddress };
        }
      });
      if (!flag) {
        setAddressArr(newAddress);
        setDisabled(true);
      }
      return !flag;
    },
    [addressArr],
  );

  const onFinish = useCallback(
    async (values: ContactItemType) => {
      const { name, addresses } = values;

      try {
        setLoading(true);
        const checkName = await handleCheckName(name.trim());
        const checkAddress = handleCheckAddress(addresses);
        if (checkName && checkAddress) {
          if (isEdit) {
            await editContactApi({ name: name.trim(), addresses, id: state.id, index: state.index });
          } else {
            await addContactApi({ name: name.trim(), addresses });
          }
          appDispatch(fetchContactListAsync());
          navigate('/setting/contacts');
          message.success(isEdit ? 'Edit Contact successful' : 'Add Contact successful');
        }
      } catch (e: any) {
        console.log('onFinish==contact error', e);
        message.error(t((e.error || {}).message || e.message || 'handle contact error'));
      } finally {
        setLoading(false);
      }
    },
    [
      addContactApi,
      appDispatch,
      editContactApi,
      handleCheckAddress,
      handleCheckName,
      isEdit,
      navigate,
      setLoading,
      state.id,
      state.index,
      t,
    ],
  );

  const handleGoBack = useCallback(() => {
    if (isEdit) {
      navigate('/setting/contacts/view', { state: state });
    } else {
      navigate('/setting/contacts');
    }
  }, [isEdit, navigate, state]);

  const handleDelConfirm = useCallback(async () => {
    await deleteContactApi(state);
    navigate('/setting/contacts');
    message.success('Contact deleted successfully');
  }, [deleteContactApi, navigate, state]);

  return (
    <div className="edit-contact-frame">
      <div className="edit-contact-title">
        <BackHeader
          title={isEdit ? t('Edit Contact') : t('Add New Contact')}
          leftCallBack={handleGoBack}
          rightElement={<CustomSvg type="Close2" onClick={handleGoBack} />}
        />
      </div>
      <Form
        form={form}
        autoComplete="off"
        layout="vertical"
        className="flex-column contact-info-form"
        initialValues={state}
        requiredMark={false}
        onFinish={onFinish}>
        <div className="form-content">
          <FormItem name="name" label={t('Name')} validateStatus={validName.validateStatus} help={validName.errorMsg}>
            <Input
              placeholder={t('Enter name')}
              onChange={(e) => handleInputValueChange(e.target.value)}
              maxLength={16}
            />
          </FormItem>
          <Form.List name="addresses">
            {(fields, { add, remove }) => (
              <div className="addresses">
                {fields.map(({ key, name, ...restField }, i) => (
                  <div className="address-item" key={key}>
                    <div className="flex-between address-item-title">
                      <span>{`Address${i + 1}`}</span>
                      <CustomSvg
                        type="Delete"
                        onClick={() => {
                          remove(name);
                          handleFormValueChange();
                          handleRemoveAds(i);
                        }}
                      />
                    </div>
                    <Input.Group compact className="flex-column address-item-body">
                      <FormItem {...restField} name={[name, 'networkName']} noStyle>
                        <Input
                          placeholder="Select Network"
                          prefix={<img className="select-svg" src={symbolImages['ELF']} />}
                          suffix={
                            <CustomSvg
                              type="Down"
                              onClick={() => {
                                handleSelectNetwork(i);
                              }}
                            />
                          }
                          onClick={() => {
                            handleSelectNetwork(i);
                          }}
                        />
                      </FormItem>
                      <FormItem
                        {...restField}
                        name={[name, 'address']}
                        validateStatus={addressArr?.[i]?.validData?.validateStatus}
                        help={addressArr?.[i]?.validData?.errorMsg}>
                        <Input
                          onChange={(e) => handleAddressChange(i, e.target.value)}
                          placeholder={t("Enter contact's address")}
                          addonBefore="ELF"
                          addonAfter={addressArr[i]?.chainId}
                        />
                      </FormItem>
                    </Input.Group>
                  </div>
                ))}
                {fields.length < 5 && (
                  <div
                    className="flex-center addresses-add-btn"
                    onClick={() => {
                      add(initAddress);
                      setDisabled(true);
                      setAddressArr([...addressArr, initAddress]);
                    }}>
                    <CustomSvg type="PlusFilled" className="plus-svg" />
                    <span>{t('Add Address')}</span>
                  </div>
                )}
              </div>
            )}
          </Form.List>
        </div>
        <div className="form-btn">
          {!isEdit && (
            <div className="form-btn-add">
              <FormItem>
                <Button className="add-btn" type="primary" htmlType="submit" disabled={disable}>
                  {t('Add')}
                </Button>
              </FormItem>
            </div>
          )}
          {isEdit && (
            <div className="flex-between form-btn-edit">
              <Button
                danger
                onClick={() => {
                  setDelOpen(true);
                }}>
                {t('Delete')}
              </Button>
              <Button htmlType="submit" type="primary" disabled={disable}>
                {t('Save')}
              </Button>
            </div>
          )}
        </div>
      </Form>
      <NetworkDrawer
        open={netOpen}
        height={528}
        maskClosable={true}
        placement="bottom"
        onChange={handleNetworkChange}
        onClose={() => {
          setNetOpen(false);
        }}
      />
      <DeleteContact
        open={delOpen}
        onCancel={() => {
          setDelOpen(false);
        }}
        onConfirm={handleDelConfirm}
      />
    </div>
  );
}
