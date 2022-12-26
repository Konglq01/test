import React, { useCallback, useRef } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';

import { styles as contactListStyles } from './style';
import { ContactIndexType, ContactItemType } from '@portkey/types/types-ca/contact';
import { FlashList } from '@shopify/flash-list';
import { FontStyles } from 'assets/theme/styles';
import fonts from 'assets/theme/fonts';

type contactFlatItemType = ContactIndexType | ContactItemType;
interface ContactsListProps {
  dataArray: contactFlatItemType[];
  contactIndexList: ContactIndexType[];
  isIndexBarShow?: boolean;
  sectionHeight?: number;
  itemHeight?: number;
  ListFooterComponent?: JSX.Element;
  renderContactItem: (item: ContactItemType) => JSX.Element;
  renderContactIndex: (contactIndex: ContactIndexType) => JSX.Element;
}

const ContactsList: React.FC<ContactsListProps> = ({
  dataArray,
  contactIndexList,
  sectionHeight = 28,
  itemHeight = 85,
  isIndexBarShow = true,
  ListFooterComponent = null,
  renderContactItem,
  renderContactIndex,
}) => {
  const flashListRef = useRef<FlashList<contactFlatItemType>>(null);

  const onSectionSelect = useCallback(
    (index: number) => {
      flashListRef.current?.scrollToIndex({
        index: contactIndexList.reduce((pv, cv, idx) => pv + (idx < index ? cv.contacts.length : 0), 0) + index,
      });
    },
    [contactIndexList],
  );

  return (
    <View style={[contactListStyles.sectionListWrap, !isIndexBarShow && contactListStyles.sectionListWrapFull]}>
      <FlashList
        ref={flashListRef}
        data={dataArray}
        estimatedItemSize={contactListStyles.sectionIndex.height}
        overrideItemLayout={(layout, item) => {
          layout.size = (item as ContactItemType).id === undefined ? sectionHeight : itemHeight;
        }}
        renderItem={({ item }) => {
          if ((item as ContactItemType).id === undefined) {
            return renderContactIndex(item as ContactIndexType);
          }
          return renderContactItem(item as ContactItemType);
        }}
        keyExtractor={item => ((item as ContactItemType).id === undefined ? item.index : (item as ContactItemType).id)}
        ListFooterComponent={ListFooterComponent}
      />

      {isIndexBarShow && (
        <View style={contactListStyles.indexBarWrap}>
          {contactIndexList.map((item, index) => (
            <TouchableOpacity
              key={item.index}
              onPress={() => onSectionSelect(index)}
              style={contactListStyles.indexItemWrap}>
              <Text style={[contactListStyles.indexItem, FontStyles.font3, fonts.mediumFont]}>{item.index}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};
export default ContactsList;
