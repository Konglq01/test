import React, { useMemo, useState, useCallback } from 'react';
import { TouchableOpacity, FlatList, StyleSheet, View } from 'react-native';
// import { RecentContactType } from '@portkey-wallet/types/trade';
// import trades from '@portkey-wallet/store/trade/slice';
import navigationService from 'utils/navigationService';
import PageContainer from 'components/PageContainer';
import CommonInput from 'components/CommonInput';
import CommonTopTab from 'components/CommonTopTab';
import Svg from 'components/Svg';
import { useCurrentNetwork } from '@portkey-wallet/hooks/network';
import { useAppSelector } from 'store/hooks';
import { useWallet } from 'hooks/store';
import useDebounce from 'hooks/useDebounce';
import { filterAddressList } from '@portkey-wallet/utils/contact';
import { useNavigation } from '@react-navigation/native';
import { TextM } from 'components/CommonText';
import GStyles from 'assets/theme/GStyles';
import { defaultColors } from 'assets/theme';
import ContactListItem, { ContactListItemType as ContactItemProps } from 'components/ContactListItem';
import { pTd } from 'utils/unit';
import { useLanguage } from 'i18n/hooks';
import { useAppEOASelector } from '@portkey-wallet/hooks/hooks-eoa';
// import type { AccountType } from '@portkey-wallet/types/wallet';

interface SelectContactProps {
  route?: any;
}

export default function SelectContact({ route }: SelectContactProps) {
  const { t } = useLanguage();

  const { params } = route;
  const { address, name } = params;

  const navigation = useNavigation();
  const { accountList } = useWallet();
  const currentChain = useCurrentNetwork();
  const { addressBook } = useAppSelector(state => state.addressBook);
  const { recentContact } = useAppEOASelector(state => state.trade);

  const [keyword, setKeyword] = useState('');
  const debouncedKeyword = useDebounce(keyword, 500);

  const recentlyContactList = useMemo(() => {
    return filterAddressList(recentContact?.[currentChain?.rpcUrl] ?? [], debouncedKeyword);
  }, [currentChain?.rpcUrl, recentContact, debouncedKeyword]);

  const contactList = useMemo(() => {
    return filterAddressList(
      addressBook?.[`${currentChain?.rpcUrl}&${currentChain?.networkName}`] ?? [],
      debouncedKeyword,
    );
  }, [addressBook, currentChain.networkName, currentChain.rpcUrl, debouncedKeyword]);

  const otherAccountList = useMemo(() => {
    if (!accountList) return [];

    return filterAddressList(
      accountList
        ?.filter(ele => ele.accountName !== name)
        .map(account => {
          return { ...account, name: account.accountName };
        }),
      debouncedKeyword,
    );
  }, [accountList, name, debouncedKeyword]);

  const navigateBack = useCallback(
    ({ address: toAddress, name: toName }: { address: string; name: string }) => {
      navigationService.navigate('SendHome', {
        ...params,
        address: toAddress,
        name: toName,
        timestamp: Date.now(),
      });
    },
    [params],
  );

  console.log('====', recentlyContactList, contactList, otherAccountList);

  const tabList = useMemo(() => {
    return [
      {
        name: t('Recents'),
        tabItemDom: recentlyContactList.length ? (
          <FlatList
            key="Recents"
            style={styles.flatList}
            data={recentlyContactList as ContactItemProps[]}
            renderItem={({ item: recentContactItem }) => (
              <ContactListItem
                title={recentContactItem.name}
                key={`${recentContactItem.address}=${recentContactItem.name}`}
                {...recentContactItem}
                onPress={() => navigateBack({ ...recentContactItem } as any)}
              />
            )}
            keyExtractor={item => `${item.address}=${item.name}`}
          />
        ) : (
          <TextM style={styles.noResult}>{t('There is no search result.')}</TextM>
        ),
      },
      {
        name: t('Contacts'),
        tabItemDom: contactList.length ? (
          <FlatList
            key="Contacts"
            style={styles.flatList}
            data={contactList as ContactItemProps[]}
            renderItem={({ item: contactItem }) => (
              <ContactListItem
                title={contactItem.name}
                key={`${contactItem.address}=${contactItem.name}`}
                {...contactItem}
                onPress={() => navigateBack({ ...contactItem } as any)}
              />
            )}
            keyExtractor={item => `${item.address}=${item.name}`}
          />
        ) : (
          <TextM style={styles.noResult}>{t('There is no search result.')}</TextM>
        ),
      },
      {
        name: t('My Accounts'),
        tabItemDom: otherAccountList.length ? (
          <FlatList
            key="My Accounts"
            data={otherAccountList as (ContactItemProps & { accountName: string })[]}
            style={styles.flatList}
            renderItem={({ item: accountItem }) => (
              <ContactListItem
                title={accountItem.name}
                key={`${accountItem.address}=${accountItem.name}`}
                {...accountItem}
                onPress={() => navigateBack({ ...accountItem, name: accountItem?.accountName } as any)}
              />
            )}
            keyExtractor={item => `${item.address}=${item.name}`}
          />
        ) : (
          <TextM style={styles.noResult}>{t('There is no search result.')}</TextM>
        ),
      },
    ];
  }, [contactList, navigateBack, otherAccountList, recentlyContactList, t]);

  return (
    <PageContainer
      safeAreaColor={['blue', 'white']}
      titleDom={t('Send to')}
      leftCallback={navigation.goBack}
      scrollViewProps={{ disabled: true }}
      containerStyles={styles.pageContainer}
      rightDom={
        <TouchableOpacity
          onPress={() => {
            navigationService.navigate('ContactsDetail', { fromSendPage: true });
          }}>
          <Svg icon="add2" size={pTd(17.5)} />
        </TouchableOpacity>
      }>
      <View style={styles.inputWrap}>
        <CommonInput
          placeholder={t('Name or Address')}
          value={keyword}
          onChangeText={v => {
            setKeyword(v.trim());
          }}
        />
      </View>
      <CommonTopTab tabList={tabList} />
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    paddingLeft: 0,
    paddingRight: 0,
  },
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
});
