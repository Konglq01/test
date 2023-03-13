import React, { useMemo, useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import CommonTopTab from 'components/CommonTopTab';
import GStyles from 'assets/theme/GStyles';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import { useLanguage } from 'i18n/hooks';
import { FlashList } from '@shopify/flash-list';
import RecentContactItem from 'pages/Send/components/RecentContactItem';
import { ContactItemType, RecentContactItemType } from '@portkey-wallet/types/types-ca/contact';

// import RecentList from '../components/RecentList';
import ContactsList from 'components/ContactList';
import NoData from 'components/NoData';
import { TextS } from 'components/CommonText';
import { useAppCommonDispatch } from '@portkey-wallet/hooks';
import useEffectOnce from 'hooks/useEffectOnce';
import { fetchContactListAsync } from '@portkey-wallet/store/store-ca/contact/actions';
import { request } from '@portkey-wallet/api/api-did';
import { useContact } from '@portkey-wallet/hooks/hooks-ca/contact';
import { ChainId } from '@portkey-wallet/types';
import { useCurrentWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useRecent } from '@portkey-wallet/hooks/hooks-ca/useRecent';
import { fetchRecentListAsync } from '@portkey-wallet/store/store-ca/recent/slice';

interface ApiRecentAddressItemType {
  caAddress: string;
  chainId: string;
  name: string;
  transactionTime: string;
  address: string;
  addressChainId: string;
}

interface SelectContactProps {
  chainId: ChainId;
  onPress?: (contact: any) => void;
}

const MAX_RESULT_ACCOUNT = 10;

export default function SelectContact(props: SelectContactProps) {
  const { chainId, onPress } = props;

  const { t } = useLanguage();
  const dispatch = useAppCommonDispatch();
  const { contactMap, contactIndexList } = useContact();
  const { walletInfo } = useCurrentWallet();

  const { recentContactList } = useRecent(walletInfo?.[chainId]?.caAddress || '');

  console.log('recentContactListrecentContactList', recentContactList);

  const [loading, setLoading] = useState<boolean>(false);
  const [skipCount, setSkipCount] = useState(0);
  const [recentTotalNumber, setRecentTotalNumber] = useState(0);
  const [recentList, setRecentList] = useState<RecentContactItemType[]>([]);

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
        caAddresses: [walletInfo?.[chainId]?.caAddress] || [],
        skipCount,
        maxResultCount: MAX_RESULT_ACCOUNT,
      },
    });
  }, [chainId, skipCount, walletInfo]);

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
    dispatch(fetchRecentListAsync({ caAddress: walletInfo?.[chainId]?.caAddress || '', isFirstTime: true }));
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

  const isExistContact = useMemo<boolean>(
    () => contactIndexList.reduce((pv, cv) => pv + cv.contacts.length, 0) > 0,
    [contactIndexList],
  );

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

                  fetchMoreRecent();
                }}
              />
            </View>
          ),
      },
      {
        name: t('Contacts'),
        tabItemDom: !isExistContact ? (
          <NoData noPic message={t('There is no contacts.')} />
        ) : (
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
  }, [fetchMoreRecent, isExistContact, loading, onPress, recentList, recentTotalNumber, renderItem, t]);

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
    marginBottom: pTd(100),
  },
});
