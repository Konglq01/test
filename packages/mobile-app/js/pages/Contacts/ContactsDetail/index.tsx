import React, { useState, useEffect, useCallback } from 'react';
import { View, TouchableOpacity } from 'react-native';
import CommonButton from 'components/CommonButton';
import Input from 'components/CommonInput';
import AddressInput from 'components/AddressInput';
import { useAppDispatch } from 'store/hooks';
import navigationService from 'utils/navigationService';
import Svg from 'components/Svg';
import { AddressBookItem } from '@portkey/types/addressBook';
import { useAppSelector } from 'store/hooks';
import { addressBookUpdate } from '@portkey/store/addressBook/actions';
import { AddressBookError } from '@portkey/store/addressBook/types';
import { UpdateType } from '@portkey/types';
import { pageStyles } from './style';
import CommonToast from 'components/CommonToast';
import PageContainer from 'components/PageContainer';
import { TextM } from 'components/CommonText';
import { defaultColors } from 'assets/theme';
import ActionSheet from 'components/ActionSheet';
import useQrScanPermission from 'hooks/useQrScanPermission';
import { useLanguage } from 'i18n/hooks';

interface ContactsHomeProps {
  netWork?: string;
  route?: any;
}

const initContactsData: AddressBookItem = {
  name: '',
  address: '',
};
let timer: any;

const ContactsHome: React.FC<ContactsHomeProps> = ({ route }) => {
  const { t } = useLanguage();
  const { params } = route;
  const fromSendPage = !!params?.fromSendPage;

  const dispatch = useAppDispatch();
  const { currentChain } = useAppSelector(state => state.chain);
  const [, requirePermission] = useQrScanPermission();

  const [isNewContact, setIsNewContact] = useState(true);
  const [isEditingExistedMember, setIsEditingExistedMember] = useState(false);
  const [isNameLegal, setIsNameLegal] = useState(true);
  const [isAddressLegal, setIsAddressLegal] = useState(true);

  const [isButtonDisable, setIsButtonDisable] = useState(true);

  const [, setItemInfo] = useState<AddressBookItem>(initContactsData);
  const [tmpItemInfo, setTmpItemInfo] = useState<AddressBookItem>(initContactsData);

  useEffect(() => {
    if (params?.item) {
      let tmpContact;
      const contact = JSON.parse(params.item);
      if (contact.address.match(/^ELF_/g)) {
        tmpContact = {
          ...contact,
          address: contact.address.replace('ELF_', '').replace(`_${currentChain.chainId}`, ''),
        };
      }
      setIsNewContact(false);
      setItemInfo(contact);
      setTmpItemInfo(tmpContact);
    }
  }, [currentChain?.chainId, params?.item]);

  useEffect(() => {
    if (params?.address) {
      setTmpItemInfo({ ...tmpItemInfo, address: params?.address });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  // button disable
  useEffect(() => {
    if (!!tmpItemInfo?.address && !!tmpItemInfo?.name) {
      setIsButtonDisable(false);
    } else {
      setIsButtonDisable(true);
    }
  }, [tmpItemInfo?.address, tmpItemInfo?.name]);

  const saveExistedMemberInfo = async () => {
    updateStorageList('update');
  };

  const addNewContact = () => {
    updateStorageList('add');
  };

  const updateStorageList = useCallback(
    async (type: UpdateType) => {
      let isError = false;
      console.log(tmpItemInfo, currentChain);
      try {
        dispatch(
          addressBookUpdate({
            type: type,
            addressBook: tmpItemInfo,
            currentChain: currentChain,
          }),
        );
      } catch (error: any) {
        setIsAddressLegal(true);
        setIsNameLegal(true);
        const errorArray = JSON.parse(error.message);
        if (errorArray.length) isError = true;
        if (errorArray.includes(AddressBookError.invalidAddress)) setIsAddressLegal(false);
        if (errorArray.includes(AddressBookError.alreadyExists)) setIsNameLegal(false);
      }

      if (isError) return false;

      // success
      CommonToast.success(t('Operation Successful'));
      clearTimeout(timer);

      setIsAddressLegal(true);
      setIsNameLegal(true);

      // from send token page
      if (fromSendPage) {
        navigationService.navigate('SendHome', { address: tmpItemInfo.address, name: tmpItemInfo.name });
      } else {
        navigationService.navigate('ContactsHome');
      }
    },
    [currentChain, dispatch, fromSendPage, t, tmpItemInfo],
  );

  const startEdit = () => {
    setIsEditingExistedMember(true);
  };

  // warning dialog

  const showDialog = useCallback(
    (type: 'delete' | 'no-authority' | 'clearAddress') => {
      switch (type) {
        case 'delete':
          ActionSheet.alert({
            title: t('Delete contact?'),
            buttons: [
              { title: t('No'), type: 'outline' },
              {
                title: t('Yes'),
                type: 'solid',
                onPress: () => {
                  updateStorageList('remove');
                },
              },
            ],
          });
          break;

        case 'no-authority':
          ActionSheet.alert({
            title: t('Enable Camera Access'),
            message: t('Cannot connect to the camera. Please make sure it is turned on'),
            buttons: [
              {
                title: t('Close'),
                type: 'solid',
              },
            ],
          });
          break;

        case 'clearAddress':
          ActionSheet.alert({
            title: t('Clear Address First'),
            message: t('Only after clearing the contact address can the new address be scanned'),
            buttons: [
              {
                title: t('Close'),
                type: 'solid',
              },
            ],
          });
          break;

        default:
          break;
      }
    },
    [t, updateStorageList],
  );

  return (
    <PageContainer
      safeAreaColor={['blue', 'gray']}
      titleDom={isNewContact ? t('New Contact') : t('Details')}
      containerStyles={pageStyles.pageWrap}
      scrollViewProps={{ disabled: false }}>
      <View style={pageStyles.viewWrap}>
        <View style={pageStyles.inputsWrap}>
          <Input
            key={1}
            type="general"
            theme="white-bg"
            maxLength={30}
            label={t('Name')}
            placeholder={t('Enter Address Name')}
            inputStyle={pageStyles.nameInputStyle}
            value={tmpItemInfo?.name || ''}
            disabled={!isNewContact && !isEditingExistedMember}
            // onBlur={() => setState({ pwdRule: isValidPassword(password) })}
            onBlur={() => {
              const info = { ...tmpItemInfo, name: tmpItemInfo.name.trim() };
              setTmpItemInfo(info);
            }}
            onChangeText={value => {
              const info = { ...tmpItemInfo, name: value };
              setTmpItemInfo(info);
            }}
            errorMessage={isNameLegal ? undefined : t('This Name Already Exists')}
          />
          {currentChain.chainType === 'aelf' ? (
            <AddressInput
              placeholder={t("Enter Contact's Address")}
              value={tmpItemInfo?.address || ''}
              affix={['ELF', String(currentChain?.chainId) || 'AELF']}
              disabled={!isNewContact && !isEditingExistedMember}
              onChangeText={value => setTmpItemInfo({ ...tmpItemInfo, address: value.replace(' ', '') })}
              errorMessage={isAddressLegal ? undefined : t('Invalid Address')}
              rightIcon={
                !isNewContact && !isEditingExistedMember ? (
                  <View style={pageStyles.whiteSpaceView} />
                ) : (
                  <TouchableOpacity
                    style={pageStyles.scanIconWrap}
                    onPress={async () => {
                      if (!isNewContact && !isEditingExistedMember) return;

                      if (tmpItemInfo.address) return showDialog('clearAddress');

                      const result = await requirePermission();
                      if (result) {
                        navigationService.navigate('QrScanner');
                      } else {
                        showDialog('no-authority');
                      }
                    }}>
                    <Svg icon="scan" color={defaultColors.icon1} size={16} />
                  </TouchableOpacity>
                )
              }
            />
          ) : (
            <Input
              key={2}
              type="general"
              theme="white-bg"
              label={t('Address')}
              placeholder={t("Enter Contact's Address")}
              rightIcon={
                !isNewContact && !isEditingExistedMember ? (
                  <View style={pageStyles.whiteSpaceView} />
                ) : (
                  <TouchableOpacity
                    style={pageStyles.scanIconWrap}
                    onPress={() => {
                      if (!isNewContact && !isEditingExistedMember) return;
                      navigationService.navigate('QrScanner');
                    }}>
                    <Svg icon="scan" size={16} color={defaultColors.icon1} />
                  </TouchableOpacity>
                )
              }
              inputStyle={pageStyles.nameInputStyle}
              disabled={!isNewContact && !isEditingExistedMember}
              onChangeText={value => setTmpItemInfo({ ...tmpItemInfo, address: value.replace(' ', '') })}
              errorMessage={isAddressLegal ? undefined : t('Invalid Address')}
            />
          )}

          {currentChain?.chainType !== 'ethereum' && (isNewContact || isEditingExistedMember) && (
            <View style={pageStyles.tips}>
              <TextM style={pageStyles.tipsItem}>
                {t('Please confirm the network you are in by checking the suffix')}
              </TextM>
            </View>
          )}
        </View>
        <View style={[pageStyles.buttonWrap]}>
          {isNewContact ? (
            <CommonButton disabled={isButtonDisable} type="solid" title={t('Save')} onPress={() => addNewContact()} />
          ) : (
            <CommonButton
              color="primary"
              type="solid"
              disabled={isEditingExistedMember && isButtonDisable}
              title={isEditingExistedMember ? t('Save') : t('Edit')}
              // disabled={isEditingExistedMember && !isInfoLegal}
              onPress={isEditingExistedMember ? saveExistedMemberInfo : startEdit}
            />
          )}
          {!isNewContact && isEditingExistedMember && (
            <CommonButton
              style={pageStyles.deleteButton}
              titleStyle={pageStyles.deleteTitle}
              type="clear"
              onPress={() => {
                showDialog('delete');
              }}>
              {t('Delete')}
            </CommonButton>
          )}
        </View>
      </View>
    </PageContainer>
  );
};

export default ContactsHome;
