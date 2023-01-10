import React, { useMemo, useCallback } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import CommonTopTab from 'components/CommonTopTab';
import GStyles from 'assets/theme/GStyles';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import { useLanguage } from 'i18n/hooks';
import { FlashList } from '@shopify/flash-list';
import RecentContactItem from 'pages/Send/components/RecentContactItem';
import RecentList from '../components/RecentList';
import ContactsList from 'components/ContactList';
import NoData from 'components/NoData';
import { Text } from 'react-native-svg';
import { TextS } from 'components/CommonText';
import { useAppCASelector, useAppCommonDispatch } from '@portkey/hooks';
import useEffectOnce from 'hooks/useEffectOnce';
import { fetchContractListAsync } from '@portkey/store/store-ca/contact/actions';

const mockList = [
  {
    id: '100',
    name: '',
    address: '',
    addresses: [{ address: 'ELF_mfzJTsv5UGQGoZw4gdrivTihVoZgtdm2f8ppnY7W2t6nGYfS1_AELF' }],
  },
  {
    id: '200',
    index: 1000,
    name: 'Sally',
    addresses: [
      {
        id: 1,
        index: 1,
        chainType: 'MAIN',
        chainId: 'AELF',
        address: 'ELF_SADASsdasdasdasdasD_AELF',
      },
      {
        id: 2,
        index: 2,
        chainType: 'MAIN',
        chainId: 'AELF',
        address: 'ELF_SADASsdaaasdasdasdasD_AELF',
      },
    ],
  },
  {
    id: '200',
    index: 1000,
    name: 'Sally',
    addresses: [
      {
        id: 1,
        index: 1,
        chainType: 'MAIN',
        chainId: 'AELF',
        address: 'ELF_SADASsdasdasdasdasD_AELF',
      },
      {
        id: 2,
        index: 2,
        chainType: 'MAIN',
        chainId: 'AELF',
        address: 'ELF_SADASsdaaasdasdasdasD_AELF',
      },
    ],
  },
  {
    id: '200',
    index: 1000,
    name: 'Sally',
    addresses: [
      {
        id: 1,
        index: 1,
        chainType: 'MAIN',
        chainId: 'AELF',
        address: 'ELF_SADASsdasdasdasdasD_AELF',
      },
      {
        id: 2,
        index: 2,
        chainType: 'MAIN',
        chainId: 'AELF',
        address: 'ELF_SADASsdaaasdasdasdasD_AELF',
      },
    ],
  },
  {
    id: '200',
    index: 1000,
    name: 'Sally',
    addresses: [
      {
        id: 1,
        index: 1,
        chainType: 'MAIN',
        chainId: 'AELF',
        address: 'ELF_SADASsdasdasdasdasD_AELF',
      },
      {
        id: 2,
        index: 2,
        chainType: 'MAIN',
        chainId: 'AELF',
        address: 'ELF_SADASsdaaasdasdasdasD_AELF',
      },
    ],
  },
  {
    id: '200',
    index: 1000,
    name: 'Sally',
    addresses: [
      {
        id: 1,
        index: 1,
        chainType: 'MAIN',
        chainId: 'AELF',
        address: 'ELF_SADASsdasdasdasdasD_AELF',
      },
      {
        id: 2,
        index: 2,
        chainType: 'MAIN',
        chainId: 'AELF',
        address: 'ELF_SADASsdaaasdasdasdasD_AELF',
      },
    ],
  },
  {
    id: '200',
    index: 1000,
    name: 'Sally',
    addresses: [
      {
        id: 1,
        index: 1,
        chainType: 'MAIN',
        chainId: 'AELF',
        address: 'ELF_SADASsdasdasdasdasD_AELF',
      },
      {
        id: 2,
        index: 2,
        chainType: 'MAIN',
        chainId: 'AELF',
        address: 'ELF_SADASsdaaasdasdasdasD_AELF',
      },
    ],
  },
];

interface SelectContactProps {
  currentNetType?: string;
  onPress?: (contact: any) => void;
}

export default function SelectContact(props: SelectContactProps) {
  const { onPress } = props;
  const { t } = useLanguage();
  const dispatch = useAppCommonDispatch();

  // const [keyword, setKeyword] = useState('');
  // const debouncedKeyword = useDebounce(keyword, 500);

  useEffectOnce(() => {
    dispatch(fetchContractListAsync());
  });

  const renderItem = useCallback(
    ({ item }: { item: any }) => {
      return <RecentContactItem contact={item} onPress={onPress} />;
    },
    [onPress],
  );

  const tabList = useMemo(() => {
    return [
      {
        name: t('Recents'),
        tabItemDom:
          mockList.length === 0 ? (
            <NoData noPic message={t('There is no recents.')} />
          ) : (
            <View style={styles.recentListWrap}>
              <FlashList
                data={mockList}
                renderItem={renderItem}
                ListFooterComponent={<TextS style={styles.footer}>{t('No Data')}</TextS>}
              />
            </View>
          ),
      },
      {
        name: t('Contacts'),
        tabItemDom:
          mockList.length === 0 ? (
            <NoData noPic message={t('There is no contacts.')} />
          ) : (
            <ContactsList
              style={styles.contactWrap}
              isIndexBarShow={false}
              isSearchShow={false}
              renderContactItem={item => <RecentContactItem contact={item} />}
              ListFooterComponent={<View style={styles.footer} />}
            />
          ),
      },
    ];
  }, [renderItem, t]);

  return <CommonTopTab tabList={tabList} />;
}

const styles = StyleSheet.create({
  inputWrap: {
    backgroundColor: defaultColors.bg5,
    ...GStyles.paddingArg(0, 16, 16),
  },
  flatList: {
    backgroundColor: defaultColors.bg1,
  },
  noResult: {
    backgroundColor: defaultColors.bg1,
    color: defaultColors.font7,
    flex: 1,
    textAlign: 'center',
    fontSize: pTd(14),
    paddingTop: pTd(41),
  },
  recentListWrap: {
    flex: 1,
    backgroundColor: defaultColors.bg1,
  },
  item: {
    height: 20,
  },
  contactWrap: {
    backgroundColor: defaultColors.bg1,
  },
  footer: {
    marginTop: pTd(22),
    width: '100%',
    textAlign: 'center',
    color: defaultColors.font7,
    marginBottom: pTd(50),
  },
});
