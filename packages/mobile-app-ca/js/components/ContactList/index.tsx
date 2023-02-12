import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import CommonInput from 'components/CommonInput';
import navigationService from 'utils/navigationService';
import Svg from 'components/Svg';
import { styles as contactListStyles } from './style';
import CommonButton from 'components/CommonButton';
import { pTd } from 'utils/unit';
import useEffectOnce from 'hooks/useEffectOnce';
import { useLanguage } from 'i18n/hooks';
import { fetchContractListAsync } from '@portkey/store/store-ca/contact/actions';
import { ContactIndexType, ContactItemType } from '@portkey/types/types-ca/contact';
import ContactItem, { styles as contactItemStyles } from 'components/ContactItem';
import ContactFlashList from './ContactFlashList';
import { TextL } from 'components/CommonText';
import { defaultColors } from 'assets/theme';
import { BGStyles, FontStyles } from 'assets/theme/styles';
import GStyles from 'assets/theme/GStyles';
import { ViewStyleType } from 'types/styles';
import { getAelfAddress } from '@portkey/utils/aelf';
import { transContactsToIndexes } from '@portkey/store/store-ca/contact/utils';
import CommonToast from 'components/CommonToast';

interface ContactsListProps {
  isIndexBarShow?: boolean;
  isSearchShow?: boolean;
  isReadOnly?: boolean;
  renderContactItem?: (item: ContactItemType) => JSX.Element;
  itemHeight?: number;
  style?: ViewStyleType;
  ListFooterComponent?: JSX.Element;
}
type FlashItemType = ContactIndexType | ContactItemType;

const ContactsList: React.FC<ContactsListProps> = ({
  isIndexBarShow = true,
  isSearchShow = true,
  isReadOnly = false,
  renderContactItem,
  itemHeight,
  style,
  ListFooterComponent,
}) => {
  const appDispatch = useAppDispatch();
  const { t } = useLanguage();
  useEffectOnce(() => {
    appDispatch(fetchContractListAsync(true));
  });
  const { contactIndexList, contactMap } = useAppSelector(state => state.contact);

  const [list, setList] = useState<ContactIndexType[]>([]);

  const flashListData = useMemo<FlashItemType[]>(() => {
    let _flashListData: FlashItemType[] = [];
    list.forEach(contactIndex => {
      _flashListData.push({
        ...contactIndex,
      });
      _flashListData = _flashListData.concat(contactIndex.contacts);
    });
    return _flashListData;
  }, [list]);

  const [keyWord, setKeyWord] = useState<string>('');

  useEffect(() => {
    setList(contactIndexList);
    setKeyWord('');
  }, [contactIndexList]);

  // keyword filter;
  const onChangeKeywords = useCallback(
    (value: string) => {
      console.log(value, 'search contact===');
      setKeyWord(value);
      let _value = value.trim();
      if (_value === '') {
        setList(contactIndexList);
        return;
      }

      let filterList: ContactIndexType[] = [];
      if (_value.length <= 16) {
        // Name Search
        filterList = contactIndexList.map(({ index, contacts }) => ({
          index,
          contacts: contacts.filter(contact => contact.name.toLocaleUpperCase() === _value.toLocaleUpperCase()),
        }));
      } else {
        // Address Search
        _value = getAelfAddress(_value);
        const result = contactMap[_value];
        if (result === undefined) filterList = [];
        else filterList = transContactsToIndexes(result);
      }

      filterList = filterList.filter(({ contacts }) => contacts.length !== 0);
      setList(filterList);
    },
    [contactIndexList, contactMap],
  );

  const _renderSection = (contactIndex: ContactIndexType) => {
    return (
      <TouchableOpacity>
        <TextL style={contactListStyles.sectionIndex}>{contactIndex.index}</TextL>
      </TouchableOpacity>
    );
  };

  const _renderItem = (item: ContactItemType) => {
    if (renderContactItem) return renderContactItem(item);
    return (
      <ContactItem
        key={item.id}
        contact={item}
        onPress={() => {
          navigationService.navigate('ContactDetail', { contact: JSON.stringify(item) });
        }}
      />
    );
  };

  const isExistContact = useMemo<boolean>(() => list.reduce((pv, cv) => pv + cv.contacts.length, 0) > 0, [list]);

  return (
    <View style={[contactListStyles.listWrap, style]}>
      {isSearchShow && (
        <View style={[BGStyles.bg5, GStyles.paddingArg(0, 20, 16)]}>
          <CommonInput
            value={keyWord}
            placeholder={t('Name or address')}
            onChangeText={value => {
              onChangeKeywords(value);
            }}
          />
        </View>
      )}

      {isExistContact && (
        <ContactFlashList
          dataArray={flashListData}
          contactIndexList={contactIndexList}
          sectionHeight={contactListStyles.sectionIndex.height}
          itemHeight={itemHeight || contactItemStyles.itemWrap.height}
          renderContactIndex={_renderSection}
          renderContactItem={_renderItem}
          isIndexBarShow={isIndexBarShow && !keyWord}
          ListFooterComponent={ListFooterComponent}
        />
      )}

      {!isExistContact && !!keyWord && (
        <TextL style={[contactListStyles.noResult, FontStyles.font7]}>{t('No results found')}</TextL>
      )}

      {!isExistContact && !keyWord && !isReadOnly && (
        <CommonButton
          type="solid"
          containerStyle={contactListStyles.addButtonWrap}
          buttonStyle={[contactListStyles.addButton]}
          onPress={() => navigationService.navigate('ContactEdit')}>
          <Svg icon="add1" size={pTd(16)} color={defaultColors.icon2} />
          <Text style={contactListStyles.addText}>{t('Add New Contacts')}</Text>
        </CommonButton>
      )}
    </View>
  );
};
export default ContactsList;
