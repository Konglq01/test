import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';
import { pageStyles } from './style';
import PageContainer from 'components/PageContainer';
import { useLanguage } from 'i18n/hooks';
import { AddressItem, ContactItemType, EditContactItemApiType } from '@portkey/types/types-ca/contact';
import Input from 'components/CommonInput';
import CommonButton from 'components/CommonButton';
import { TextM } from 'components/CommonText';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import navigationService from 'utils/navigationService';
import { useAppSelector } from 'store/hooks';
import { ErrorType } from 'types/common';
import { FontStyles } from 'assets/theme/styles';
import Touchable from 'components/Touchable';
import GStyles from 'assets/theme/GStyles';
import { INIT_HAS_ERROR, INIT_NONE_ERROR } from 'constants/common';
import { ADDRESS_NUM_LIMIT } from '@portkey/constants/constants-ca/contact';
import ContactAddress from './components/ContactAddress';
import { isValidCAWalletName } from '@portkey/utils/reg';
import ChainOverlay from './components/ChainOverlay';
import { getAelfAddress, isAelfAddress } from '@portkey/utils/aelf';
import { ChainItemType } from '@portkey/store/store-ca/wallet/type';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CommonToast from 'components/CommonToast';
import ActionSheet from 'components/ActionSheet';
import { useCurrentWallet } from '@portkey/hooks/hooks-ca/wallet';
import { useAddContact, useDeleteContact, useEditContact } from 'hooks/contact';

interface ContactEditProps {
  route?: any;
}

export type EditAddressType = AddressItem & { error: ErrorType };

interface EditContactType extends EditContactItemApiType {
  error: ErrorType;
  addresses: EditAddressType[];
}

const initEditContact: EditContactType = {
  id: '',
  index: '',
  name: '',
  error: { ...INIT_HAS_ERROR },
  addresses: [],
};

const ContactEdit: React.FC<ContactEditProps> = ({ route }) => {
  const { t } = useLanguage();
  const addContactApi = useAddContact();
  const editContactApi = useEditContact();
  const deleteContactApi = useDeleteContact();

  const { contactIndexList } = useAppSelector(state => state.contact);
  const [editContact, setEditContact] = useState<EditContactType>(initEditContact);

  const { params } = route;
  useEffect(() => {
    if (!params?.contact) return;
    const contact: ContactItemType = JSON.parse(params.contact);
    setEditContact({
      ...contact,
      error: { ...INIT_NONE_ERROR },
      addresses: contact.addresses.map(item => ({
        ...item,
        error: { ...INIT_NONE_ERROR },
      })),
    });
  }, [params]);

  const isEdit = useMemo(() => params?.contact !== undefined, [params?.contact]);

  const { chainList = [], currentNetwork } = useCurrentWallet();
  const chainMap = useMemo(() => {
    const _chainMap: { [k: string]: ChainItemType } = {};
    chainList.forEach(item => {
      _chainMap[item.chainId] = item;
    });
    return _chainMap;
  }, [chainList]);

  useEffect(() => {
    if (isEdit || chainList.length === 0) return;
    setEditContact(preEditContact => {
      const _editContact = { ...preEditContact };
      _editContact.addresses = [
        {
          id: '',
          chainType: currentNetwork,
          chainId: chainList[0].chainId,
          address: '',
          error: { ...INIT_HAS_ERROR },
        },
      ];
      return _editContact;
    });
  }, [chainList, currentNetwork, isEdit]);

  // TODO: should check that Why init error as INIT_HAS_ERROR
  const onNameChange = useCallback((value: string) => {
    setEditContact(preEditContact => ({
      ...preEditContact,
      name: value,
      error: { ...INIT_HAS_ERROR },
    }));
  }, []);

  const addAddress = useCallback(() => {
    if (editContact.addresses.length >= ADDRESS_NUM_LIMIT) return;
    if (chainList.length < 1) return;
    setEditContact(preEditContact => ({
      ...preEditContact,
      addresses: [
        ...preEditContact.addresses,
        {
          id: '',
          chainType: currentNetwork,
          chainId: chainList[0].chainId,
          address: '',
          error: { ...INIT_HAS_ERROR },
        },
      ],
    }));
  }, [chainList, currentNetwork, editContact.addresses.length]);

  const deleteAddress = useCallback((deleteIdx: number) => {
    setEditContact(preEditContact => ({
      ...preEditContact,
      addresses: preEditContact.addresses.filter((_, itemIdx) => itemIdx !== deleteIdx),
    }));
  }, []);

  const onAddressChange = useCallback((value: string, idx: number) => {
    value = getAelfAddress(value.trim());
    setEditContact(preEditContact => {
      const _editContact = { ...preEditContact };
      const curAddress = _editContact.addresses[idx];
      curAddress.address = value;
      curAddress.error = {
        ...INIT_NONE_ERROR,
      };
      return _editContact;
    });
  }, []);

  const isSaveDisable = useMemo(() => {
    if (editContact.name === '') return true;
    const addresses = editContact.addresses;
    if (addresses.length === 0) return true;
    for (let i = 0; i < addresses.length; i++) {
      if (addresses[i].address === '') return true;
    }
    return false;
  }, [editContact]);

  const checkError = useCallback(() => {
    const _nameValue = editContact.name.trim();

    let isErrorExist = false;
    const _editContact = { ...editContact };

    if (_nameValue === '') {
      isErrorExist = true;
      _editContact.name = _nameValue;
      _editContact.error = {
        ...INIT_HAS_ERROR,
        errorMsg: t('Please enter contact name'),
      };
    } else if (!isValidCAWalletName(_nameValue)) {
      isErrorExist = true;
      _editContact.error = {
        ...INIT_HAS_ERROR,
        errorMsg: t('Only a-z, A-Z, 0-9 and "_"  allowed'),
      };
    } else {
      let isContactNameExist = false;
      for (let i = 0; i < contactIndexList.length; i++) {
        if (isContactNameExist) break;
        const contacts = contactIndexList[i].contacts;
        for (let j = 0; j < contacts.length; j++) {
          if (contacts[j].name === _editContact.name && contacts[j].id !== _editContact.id) {
            isContactNameExist = true;
            break;
          }
        }
      }
      if (isContactNameExist) {
        isErrorExist = true;
        _editContact.error = {
          ...INIT_HAS_ERROR,
          errorMsg: t('This name already exists.'),
        };
      }
    }

    _editContact.addresses.forEach(addressItem => {
      if (!isAelfAddress(addressItem.address)) {
        isErrorExist = true;
        addressItem.error = {
          ...INIT_HAS_ERROR,
          errorMsg: t('Invalid address'),
        };
      }
    });
    if (isErrorExist) setEditContact(_editContact);
    return isErrorExist;
  }, [contactIndexList, editContact, t]);

  const onFinish = useCallback(async () => {
    const isErrorExist = checkError();
    if (isErrorExist) return;
    try {
      if (isEdit) {
        await editContactApi(editContact);
        CommonToast.success(t('Saved Successful'), undefined, 'bottom');
      } else {
        await addContactApi(editContact);
        CommonToast.success(t('Contact Added'), undefined, 'bottom');
      }
      navigationService.navigate('ContactsHome');
    } catch (err) {
      console.log(err);
    }
  }, [addContactApi, checkError, editContact, editContactApi, isEdit, t]);

  const onDelete = useCallback(() => {
    ActionSheet.alert({
      title: t('Delete Contact?'),
      message: t('After the contact is deleted, all relevant information will also be removed.'),
      buttons: [
        {
          title: t('No'),
          type: 'outline',
        },
        {
          title: t('Yes'),
          onPress: async () => {
            try {
              await deleteContactApi(editContact);
              CommonToast.success(t('Contact Deleted'), undefined, 'bottom');
              navigationService.navigate('ContactsHome');
            } catch (error) {
              console.log('onDelete:error', error);
            }
          },
        },
      ],
    });
  }, [deleteContactApi, editContact, t]);

  const onChainChange = useCallback(
    (addressIdx: number, chainItem: ChainItemType) => {
      onAddressChange('', addressIdx);
      setEditContact(preEditContact => {
        const _editContact = { ...preEditContact };
        _editContact.addresses[addressIdx].chainId = chainItem.chainId;
        return _editContact;
      });
    },
    [onAddressChange],
  );

  return (
    <PageContainer
      safeAreaColor={['blue', 'gray']}
      titleDom={isEdit ? t('Edit Contact') : t('Add New Contacts')}
      containerStyles={pageStyles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <Input
        type="general"
        theme="white-bg"
        maxLength={16}
        label={t('Name')}
        placeholder={t('Enter name')}
        inputStyle={pageStyles.nameInputStyle}
        value={editContact.name}
        onChangeText={onNameChange}
        errorMessage={editContact.error.isError ? editContact.error.errorMsg : ''}
      />

      <KeyboardAwareScrollView keyboardOpeningTime={0} keyboardShouldPersistTaps="handled" alwaysBounceVertical={false}>
        <TouchableWithoutFeedback>
          <View>
            {editContact.addresses.map((addressItem, addressIdx) => (
              <ContactAddress
                key={addressItem.id || 'idx_' + addressIdx}
                editAddressItem={addressItem}
                editAddressIdx={addressIdx}
                onDelete={deleteAddress}
                chainName={chainMap[addressItem.chainId]?.name || ''}
                onChainPress={() =>
                  ChainOverlay.showList({
                    list: chainList,
                    value: addressItem.chainId,
                    labelAttrName: 'name',
                    callBack: item => {
                      onChainChange(addressIdx, item);
                    },
                  })
                }
                addressValue={addressItem.address}
                affix={['ELF', addressItem.chainId]}
                onAddressChange={onAddressChange}
              />
            ))}

            {editContact.addresses.length < 5 && (
              <View>
                <Touchable onPress={addAddress} style={pageStyles.addAddressBtn}>
                  <Svg icon="add-token" size={pTd(20)} />
                  <TextM style={[FontStyles.font4, GStyles.marginLeft(8)]}>{t('Add Address')}</TextM>
                </Touchable>
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>

      <CommonButton style={GStyles.marginTop(16)} onPress={onFinish} disabled={isSaveDisable} type="solid">
        {isEdit ? t('Save') : t('Add')}
      </CommonButton>
      {isEdit && (
        <CommonButton style={GStyles.marginTop(12)} onPress={onDelete} titleStyle={FontStyles.font12} type="clear">
          {t('Delete')}
        </CommonButton>
      )}
    </PageContainer>
  );
};

export default ContactEdit;
