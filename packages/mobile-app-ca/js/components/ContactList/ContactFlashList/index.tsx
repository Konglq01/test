import React, { useCallback, useMemo, useRef } from 'react';
import { Text, View, GestureResponderEvent } from 'react-native';

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

interface PageLocationType {
  height: number;
  pageX: number;
  pageY: number;
  indexHeight: number;
}
interface IndexInfoType extends PageLocationType {
  currentIndex: number;
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

  const indexRef = useRef<View>(null);
  const indexInfoRef = useRef<IndexInfoType>();

  const setCurrentIndex = useCallback(
    (nativePageY: number) => {
      if (!indexInfoRef.current) return;
      const { pageY, height, currentIndex, indexHeight } = indexInfoRef.current;
      const nativeClientY = nativePageY - pageY;
      if (nativeClientY < 0 || nativeClientY > height) return;
      const nowIndex = Math.floor(nativeClientY / indexHeight);
      if (currentIndex !== nowIndex) {
        indexInfoRef.current.currentIndex = nowIndex;
        onSectionSelect(nowIndex);
      }
    },
    [onSectionSelect],
  );
  const panResponder = useMemo(
    () => ({
      onStartShouldSetResponder: () => true,
      onMoveShouldSetResponder: () => true,
      onResponderStart: async (evt: GestureResponderEvent) => {
        if (indexInfoRef.current) {
          indexInfoRef.current.currentIndex = 0;
        } else {
          const { height, pageX, pageY, indexHeight } = await new Promise<PageLocationType>((resolve, reject) => {
            if (indexRef.current === null) {
              reject('no indexRef');
              return;
            }
            indexRef.current.measure((_x, _y, _width, _height, _pageX, _pageY) => {
              resolve({
                height: _height,
                pageX: _pageX,
                pageY: _pageY,
                indexHeight: _height / 27,
              });
            });
          });
          indexInfoRef.current = {
            height,
            pageX,
            pageY,
            indexHeight,
            currentIndex: 0,
          };
        }
        setCurrentIndex(evt.nativeEvent.pageY);
      },
      onResponderMove: (evt: GestureResponderEvent) => {
        setCurrentIndex(evt.nativeEvent.pageY);
      },
    }),
    [setCurrentIndex],
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
        <View ref={indexRef} style={contactListStyles.indexBarWrap} {...panResponder}>
          {contactIndexList.map(item => (
            // <TouchableOpacity
            //   key={item.index}
            //   onPressIn={() => onSectionSelect(index)}
            //   style={contactListStyles.indexItemWrap}>
            //   <Text style={[contactListStyles.indexItem, FontStyles.font3, fonts.mediumFont]}>{item.index}</Text>
            // </TouchableOpacity>
            <View key={item.index} style={contactListStyles.indexItemWrap}>
              <Text style={[contactListStyles.indexItem, FontStyles.font3, fonts.mediumFont]}>{item.index}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};
export default ContactsList;
