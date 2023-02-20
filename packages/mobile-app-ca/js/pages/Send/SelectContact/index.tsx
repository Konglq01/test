import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import CommonTopTab from 'components/CommonTopTab';
import GStyles from 'assets/theme/GStyles';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import { useLanguage } from 'i18n/hooks';
import { FlashList } from '@shopify/flash-list';
import RecentContactItem from 'pages/Send/components/RecentContactItem';
import { ContactItemType, RecentContactItemType } from '@portkey/types/types-ca/contact';

// import RecentList from '../components/RecentList';
import ContactsList from 'components/ContactList';
import NoData from 'components/NoData';
import { Text } from 'react-native-svg';
import { TextS } from 'components/CommonText';
import { useAppCASelector, useAppCommonDispatch, useAppCommonSelector } from '@portkey/hooks';
import useEffectOnce from 'hooks/useEffectOnce';
import { fetchContactListAsync } from '@portkey/store/store-ca/contact/actions';
import { request } from '@portkey/api/api-did';
import { useContact } from '@portkey/hooks/hooks-ca/contact';
import { isLoading } from 'expo-font';
import { useCaAddresses } from '@portkey/hooks/hooks-ca/wallet';

interface ApiRecentAddressItemType {
  caAddress: string;
  chainId: string;
  name: string;
  transactionTime: string;
  address: string;
  addressChainId: string;
}

interface SelectContactProps {
  currentNetType?: string;
  onPress?: (contact: any) => void;
}

const MAX_RESULT_ACCOUNT = 10;

export default function SelectContact(props: SelectContactProps) {
  const { onPress } = props;
  const { t } = useLanguage();
  const dispatch = useAppCommonDispatch();
  const { contactMap } = useContact();

  const caAddresses = useCaAddresses();

  const [loading, setLoading] = useState<boolean>(false);
  const [skipCount, setSkipCount] = useState(0);
  const [recentTotalNumber, setRecentTotalNumber] = useState(0);
  const [recentList, setRecentList] = useState<RecentContactItemType[]>([]);

  // const debouncedKeyword = useDebounce(keyword, 500);

  useEffectOnce(() => {
    dispatch(fetchContactListAsync());
  });

  const renderItem = useCallback(
    ({ item }: { item: RecentContactItemType }) => {
      return <RecentContactItem contact={item} onPress={onPress} />;
    },
    [onPress],
  );

  const fetchRecents = useCallback(() => {
    setLoading(true);
    return request.recent.fetchRecentTransactionUsers({
      params: {
        caAddresses: caAddresses,
        skipCount,
        maxResultCount: MAX_RESULT_ACCOUNT,
      },
    });
  }, [caAddresses, skipCount]);

  const transFormData = useCallback(
    (data: ApiRecentAddressItemType[]): any[] =>
      data.map((ele: ApiRecentAddressItemType) => {
        if (contactMap?.[ele.address]) {
          return { ...contactMap?.[ele.address]?.[0], transactionTime: ele.transactionTime };
        }
        return { ...ele, addresses: [{ address: ele.address, chainId: ele.addressChainId }] };
      }),
    [contactMap],
  );

  // init Recent
  useEffectOnce(() => {
    fetchRecents().then(res => {
      const { data, totalRecordCount } = res;

      setSkipCount(MAX_RESULT_ACCOUNT);
      setLoading(false);
      setRecentList(transFormData(data as ApiRecentAddressItemType[]));
      setRecentTotalNumber(totalRecordCount);
    });
  });

  // fetchMoreRecent
  const fetchMoreRecent = useCallback(() => {
    fetchRecents().then(res => {
      const { data, totalRecordCount } = res;

      setSkipCount(skipCount + MAX_RESULT_ACCOUNT);
      setLoading(false);
      setRecentList([...recentList, ...transFormData(data as ApiRecentAddressItemType[])]);
      setRecentTotalNumber(totalRecordCount);
    });
  }, [skipCount, fetchRecents, recentList, transFormData]);

  const tabList = useMemo(() => {
    return [
      {
        name: t('Recents'),
        tabItemDom:
          recentList.length === 0 ? (
            <NoData noPic message={t('There is no recents.')} />
          ) : (
            <View style={styles.recentListWrap}>
              <FlashList
                data={recentList || []}
                renderItem={renderItem}
                ListFooterComponent={<TextS style={styles.footer}>{t('No More Data')}</TextS>}
                onEndReached={() => {
                  if (recentTotalNumber <= recentList.length) return;
                  if (loading) return;

                  console.log('recentTotalNumberrecentTotalNumberrecentTotalNumber', recentTotalNumber, loading);

                  fetchMoreRecent();
                }}
              />
            </View>
          ),
      },
      {
        name: t('Contacts'),
        tabItemDom: (
          <ContactsList
            style={styles.contactWrap}
            isReadOnly
            isIndexBarShow={false}
            isSearchShow={false}
            renderContactItem={(item: ContactItemType) => (
              <RecentContactItem contact={item as RecentContactItemType} onPress={onPress} />
            )}
            ListFooterComponent={<View style={styles.footer} />}
          />
        ),
      },
    ];
  }, [fetchMoreRecent, loading, onPress, recentList, recentTotalNumber, renderItem, t]);

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
