import React, { useEffect, useState, useMemo } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { pTd } from 'utils/unit';
import useEffectOnce from 'hooks/useEffectOnce';
import { useLanguage } from 'i18n/hooks';
import { fetchContractListAsync } from '@portkey/store/store-ca/contact/actions';
import { ContactIndexType, ContactItemType } from '@portkey/types/types-ca/contact';
import { styles as contactItemStyles } from 'components/ContactItem';
import { isValidWalletName } from '@portkey/utils/reg';
// import List from 'components/ContactList/List';
import { StyleSheet } from 'react-native';
import GStyles from 'assets/theme/GStyles';
import { defaultColors } from 'assets/theme';
import gSTyles from 'assets/theme/GStyles';
import RecentContactItem from 'pages/Send/components/RecentContactItem';

const { font5, border6, font3, font7, font2, bg5 } = defaultColors;

interface ContactsListProps {
  isIndexBarShow?: boolean;
  isSearchShow?: boolean;
  isReadOnly?: boolean;
  renderContactItem?: (item: ContactItemType) => JSX.Element;
}

const mockData = new Array(3000).fill('').map(ele => {
  return {
    id: Math.random(),
    name: Math.random(),
    itemAvatar: 'xxx',
    addresses: [
      {
        id: Math.random(),
        chianType: 'MIAN',
        address: 'xxxasdasdads',
      },
      {
        id: Math.random(),
        chianType: 'MIAN',
        address: 'xxxasdasdads',
      },
      {
        id: Math.random(),
        chianType: 'MIAN',
        address: 'xxxasdasdads',
      },
      {
        id: Math.random(),
        chianType: 'MIAN',
        address: 'xxxasdasdads',
      },
      {
        id: Math.random(),
        chianType: 'MIAN',
        address: 'xxxasdasdads',
      },
    ],
  };
});

type ListItemType = Pick<ContactIndexType, 'index'> & { items: ContactItemType[] };

const RecentList: React.FC<ContactsListProps> = ({ isIndexBarShow = true, renderContactItem }) => {
  const appDispatch = useAppDispatch();
  const { t } = useLanguage();
  useEffectOnce(() => {
    // refetch();
    appDispatch(fetchContractListAsync());
  });
  const { contactIndexList } = useAppSelector(state => state.contact);
  const [list, setList] = useState<ListItemType[]>([]);

  const originList = useMemo<ListItemType[]>(
    () => contactIndexList.map(({ index, contacts }) => ({ index, items: contacts })),
    [contactIndexList],
  );

  useEffect(() => {
    setList(originList);
  }, [originList]);

  const _renderItem = ({ section, row }: { section: any; row: any }) => {
    const item = list[section].items[row];
    // if (renderContactItem) return renderContactItem(item);
    return (
      <RecentContactItem
        key={item.name}
        contact={item}
        onPress={() => {
          // navigationService.navigate('ContactsDetail', { item: JSON.stringify(item) });
        }}
      />
    );
  };

  const _renderSection = (index: any) => {
    const contactIndex = list[index];
    return (
      <TouchableOpacity>
        <Text style={contactListStyles.sectionIndex}>{contactIndex.index}</Text>
      </TouchableOpacity>
    );
  };

  // const isExistContact = useMemo<boolean>(() => list.reduce((pv, cv) => pv + cv.items.length, 0) > 0, [list]);

  return (
    <View style={contactListStyles.listWrap}>
      {/* <List
        dataArray={list}
        flatBoxStyle={{ top: 60 }}
        // Index_Height={contactItemStyles.itemWrap.height}
        renderItem={_renderItem}
        indexArray={contactIndexList.map(i => i.index)}
        // Section_Height={contactListStyles.sectionIndex.height}
        renderSection={_renderSection}
        isIndexBarShow={false}
      /> */}
    </View>
  );
};
export default RecentList;

export const contactListStyles = StyleSheet.create({
  listWrap: {
    flex: 1,
    backgroundColor: defaultColors.bg1,
  },
  inputWrap: {
    backgroundColor: bg5,
    ...GStyles.paddingArg(0, 16, 16),
  },
  listWrapper: {
    flex: 1,
  },
  itemWrap: {
    height: pTd(73),
    width: '100%',
    ...gSTyles.paddingArg(16, 16, 18),
    display: 'flex',
    justifyContent: 'space-between',
    borderBottomColor: border6,
    borderBottomWidth: pTd(0.5),
  },
  itemTitle: {
    color: font5,
    fontSize: pTd(14),
    lineHeight: pTd(20),
  },
  itemAddress: {
    color: font3,
    fontSize: pTd(10),
  },
  noResult: {
    fontSize: pTd(14),
    width: '100%',
    marginTop: pTd(40),
    textAlign: 'center',
    color: font7,
  },
  addButtonWrap: {
    width: '100%',
    height: pTd(40),
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  addButton: {
    marginBottom: pTd(81),
    borderRadius: pTd(4),
    color: font2,
    backgroundColor: bg5,
    height: pTd(40),
    fontSize: pTd(14),
  },
  addIconWrap: {
    paddingRight: pTd(8),
  },
  addText: {
    marginLeft: pTd(8),
    color: font2,
  },
  addButtonTitleStyle: {
    fontSize: pTd(14),
  },

  sectionListWrap: {
    flex: 1,
  },
  sectionIndex: {
    height: pTd(28),
    paddingLeft: pTd(20),
    lineHeight: pTd(28),
    fontSize: pTd(20),
  },
  indexBarWrap: {
    position: 'absolute',
    right: pTd(10),
    height: '100%',
    top: pTd(0),
  },
  indexItem: {
    width: pTd(20),
    height: pTd(20),
    textAlign: 'center',
    overflow: 'hidden',
    lineHeight: pTd(20),
    borderRadius: pTd(10),
  },
  indexItemSelect: {
    backgroundColor: '#3063FF',
    color: '#fff',
  },
});
