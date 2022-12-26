import React, { useEffect, useState, useCallback } from 'react';
import { FlatList, Text, View, TouchableOpacity } from 'react-native';
// import { addressBookUpdate } from '@portkey/store/addressBook/actions';
// import { addressFormat, isAddress } from '@portkey/utils';
// import { NetworkType } from '@portkey/types';
import { useAppSelector } from 'store/hooks';
import CommonInput from 'components/CommonInput';
import navigationService from 'utils/navigationService';
import Svg from 'components/Svg';
import { pageStyles } from './style';
import { AddressBookItem } from '@portkey/types/addressBook';
import PageContainer from 'components/PageContainer';
import { defaultColors } from 'assets/theme';
import CommonButton from 'components/CommonButton';
import { pTd } from 'utils/unit';
import ContactListItem from 'components/ContactListItem';
import { useGetELFRateQuery } from '@portkey/store/rate/api';
import useEffectOnce from 'hooks/useEffectOnce';
import { useLanguage } from 'i18n/hooks';
interface ContactsHomeProps {
  netWork?: string;
}

const ContactsHome: React.FC<ContactsHomeProps> = () => {
  const { t } = useLanguage();
  const { data, refetch } = useGetELFRateQuery({});

  useEffectOnce(() => {
    refetch();
  });

  console.log(data?.USDT, '====================================');

  const { addressBook } = useAppSelector(state => state.addressBook);
  const { currentChain } = useAppSelector(state => state.chain);

  const [list, setList] = useState<AddressBookItem[]>([]);
  const [listShow, setListShow] = useState<AddressBookItem[]>([]);

  const [keyWord, setKeyWord] = useState<string>('');

  // init
  const initData = useCallback(async () => {
    setList(addressBook[`${currentChain.rpcUrl}&${currentChain.networkName}`] || []);
    setListShow(addressBook[`${currentChain.rpcUrl}&${currentChain.networkName}`] || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addressBook]);

  useEffect(() => {
    initData();
  }, [initData]);

  // keyword filter;
  const onChangeKeywords = (value: string) => {
    const filterList = list.filter(contact => {
      return (
        contact.name.toLowerCase().includes(value.trim().toLowerCase()) ||
        contact.address.toLowerCase().includes(value.trim().toLowerCase())
      );
    });
    setKeyWord(value);
    setListShow(filterList);
  };

  const renderItem = useCallback(({ item = { name: '', address: '' } }) => {
    return (
      <ContactListItem
        key={item.name}
        title={item.name}
        address={item.address}
        onPress={() => {
          navigationService.navigate('ContactsDetail', { item: JSON.stringify(item) });
        }}
      />
    );
  }, []);

  // return <View style={pageStyles.pageWrap} />;

  return (
    <PageContainer
      titleDom={t('Contacts')}
      safeAreaColor={['blue', 'white']}
      rightDom={
        <TouchableOpacity
          onPress={() => {
            navigationService.navigate('ContactsDetail');
          }}>
          <Svg icon="add1" size={pTd(17.5)} color={defaultColors.font2} />
        </TouchableOpacity>
      }
      containerStyles={pageStyles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <View style={pageStyles.inputWrap}>
        <CommonInput
          value={keyWord}
          placeholder={t('Name or Address')}
          onChangeText={value => {
            onChangeKeywords(value);
          }}
        />
      </View>
      {!listShow.length && !!keyWord && <Text style={pageStyles.noResult}>{t('There is no search result.')}</Text>}
      {!!list.length && (
        <FlatList
          style={pageStyles.listWrapper}
          data={listShow || []}
          renderItem={renderItem}
          keyExtractor={(item: AddressBookItem) => item?.key ?? ''}
        />
      )}
      {(!list.length || !listShow.length) && (
        <CommonButton
          containerStyle={pageStyles.addButtonWrap}
          buttonStyle={[pageStyles.addButton]}
          // style={pageStyles.addButton}
          // titleStyle={pageStyles.addButtonTitleStyle}
          // color="primary"
          onPress={() => navigationService.navigate('ContactsDetail')}>
          <Svg icon="add1" size={pTd(16)} color="#ffffff" />
          <Text style={pageStyles.addText}>{t('Add New Contact')}</Text>
        </CommonButton>
      )}
    </PageContainer>
  );
};

export default ContactsHome;
