import PageContainer from 'components/PageContainer';
import { useIsFetchingTokenList, useToken } from '@portkey/hooks/hooks-ca/useToken';
import { TokenItemShowType } from '@portkey/types/types-ca/token';
import { filterTokenList } from '@portkey/utils/token';
import CommonInput from 'components/CommonInput';
import { useAppCASelector } from '@portkey/hooks/index';
import { Dialog } from '@rneui/themed';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import gStyles from 'assets/theme/GStyles';
import { defaultColors } from 'assets/theme';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import CommonToast from 'components/CommonToast';
import { TextL, TextM } from 'components/CommonText';
import { pTd } from 'utils/unit';
import Svg from 'components/Svg';
import CommonSwitch from 'components/CommonSwitch';
import CommonAvatar from 'components/CommonAvatar';
import { useLanguage } from 'i18n/hooks';
import NoData from 'components/NoData';

interface ManageTokenListProps {
  route?: any;
}

type ItemProps = {
  item: TokenItemShowType;
  onHandleToken: (item: TokenItemShowType, type: 'add' | 'delete') => void;
};
function areEqual(prevProps: ItemProps, nextProps: ItemProps) {
  return nextProps.item.isAdded === prevProps.item.isAdded;
}

const Item = memo(({ item, onHandleToken }: ItemProps) => {
  return (
    <TouchableOpacity style={itemStyle.wrap} key={item.symbol}>
      {item.symbol === 'ELF' ? (
        <CommonAvatar
          shapeType="circular"
          title={item.symbol}
          svgName="aelf-avatar"
          avatarSize={pTd(48)}
          style={itemStyle.left}
        />
      ) : (
        <CommonAvatar shapeType="circular" title={item.symbol} avatarSize={pTd(48)} style={itemStyle.left} />
      )}

      <View style={itemStyle.right}>
        <TextL numberOfLines={1} ellipsizeMode={'tail'}>
          {item.symbol}
        </TextL>

        {item.isDefault ? (
          <Svg icon="lock" size={pTd(20)} iconStyle={itemStyle.addedStyle} />
        ) : (
          <CommonSwitch
            value={!!item.isAdded}
            onValueChange={() => onHandleToken(item, item.isAdded ? 'delete' : 'add')}
          />
        )}
      </View>
    </TouchableOpacity>
  );
}, areEqual);
Item.displayName = 'Item';

const ManageTokenList: React.FC<ManageTokenListProps> = () => {
  const { t } = useLanguage();
  const [tokenState, tokenActions] = useToken();
  const { tokenDataShowInMarket } = tokenState;

  const isLoading = useIsFetchingTokenList();
  const { fetchTokenList } = tokenActions;

  const [keyword, setKeyword] = useState<string>('');

  const [addedTokenList, setAddedTokenList] = useState<any[]>([]);
  const [handledList, setHandledList] = useState<any[]>([]);
  const [filteredList, setFilteredList] = useState<any[]>([]);

  useEffect(() => {
    if (tokenDataShowInMarket.length) return;
    fetchTokenList({ pageSize: 10000, pageNo: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onHandleTokenItem = useCallback(async (item: TokenItemShowType, type: 'add' | 'delete') => {
    // TODO

    const setAccountToken = (data: any) => {
      return true;
    };

    const data = {
      tokenId: item?.id,
      enable: type === 'add',
    };
    const result = setAccountToken(data);
    if (result) CommonToast.success('Success');
  }, []);

  const fetchAddedList = useCallback(() => {
    // TODO
    const mockAddedTokenList = [
      {
        chainId: 'AELF',
        id: 4,
        name: 'STORAGE Token',
        symbol: 'STORAGE',
      },
    ];
    setAddedTokenList(mockAddedTokenList);
  }, []);

  // handle tokenList
  useEffect(() => {
    if (!tokenDataShowInMarket.length) return;
    if (!addedTokenList.length) return;

    const tmpList = tokenDataShowInMarket?.map(ele => {
      return { ...ele, isAdded: !!addedTokenList.find(item => item.id === ele?.id) };
    });
    setHandledList(tmpList);
    setFilteredList(tmpList);
  }, [addedTokenList, handledList.length, tokenDataShowInMarket]);

  // keyword filter list
  useEffect(() => {
    setFilteredList(filterTokenList(handledList, keyword));
  }, [tokenDataShowInMarket, keyword, handledList]);

  useEffect(() => {
    fetchAddedList();
  }, [fetchAddedList]);
  return (
    <PageContainer
      titleDom={t('Add Tokens')}
      safeAreaColor={['blue', 'white']}
      rightDom={<View />}
      containerStyles={pageStyles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <View style={pageStyles.inputWrap}>
        <CommonInput
          value={keyword}
          placeholder={t('Token Name')}
          onChangeText={v => {
            setKeyword(v.trim());
          }}
        />
      </View>

      {!!keyword && !filteredList.length && <NoData noPic message={t('There is no search result.')} />}
      <FlatList
        style={pageStyles.list}
        data={filteredList || []}
        renderItem={({ item }) => <Item item={item} onHandleToken={onHandleTokenItem} />}
        keyExtractor={(item: any) => item.symbol || ''}
      />
      {isLoading && <Dialog.Loading />}
    </PageContainer>
  );
};

export default ManageTokenList;

export const pageStyles = StyleSheet.create({
  pageWrap: {
    flex: 1,
    ...gStyles.paddingArg(0),
  },
  inputWrap: {
    backgroundColor: defaultColors.bg5,
    ...gStyles.paddingArg(0, 16, 16),
  },
  list: {
    flex: 1,
  },
  noResult: {
    marginTop: pTd(40),
    textAlign: 'center',
    color: defaultColors.font7,
  },
});

const itemStyle = StyleSheet.create({
  wrap: {
    height: pTd(72),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    marginLeft: pTd(16),
  },
  right: {
    height: pTd(72),
    marginLeft: pTd(16),
    paddingRight: pTd(16),
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: defaultColors.border6,
    borderBottomWidth: pTd(0.5),
  },
  addedStyle: {
    marginRight: pTd(14),
  },
  tokenName: {
    flex: 1,
  },
  balanceWrap: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  token: {
    color: defaultColors.font5,
    lineHeight: pTd(22),
    overflow: 'hidden',
  },
  dollar: {
    marginTop: pTd(2),
    lineHeight: pTd(16),
    color: defaultColors.font7,
  },
});
