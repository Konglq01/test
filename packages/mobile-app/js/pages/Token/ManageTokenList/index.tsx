import PageContainer from 'components/PageContainer';
import { useIsFetchingTokenList, useToken } from '@portkey/hooks/hooks-eoa/useToken';
import { TokenItemShowType } from '@portkey/types/types-eoa/token';
import { filterTokenList } from '@portkey/utils/token';
import CommonInput from 'components/CommonInput';
import { useAppEOASelector } from '@portkey/hooks/index';
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
        <CommonAvatar title={item.symbol} svgName="aelf-avatar" avatarSize={pTd(48)} style={itemStyle.left} />
      ) : (
        <CommonAvatar title={item.symbol} avatarSize={pTd(48)} style={itemStyle.left} />
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
  const { fetchTokenList, addToken, deleteToken } = tokenActions;
  const { currentAccount } = useAppEOASelector(state => state.wallet);

  const [keyword, setKeyword] = useState<string>('');
  // const [isHandlingToken, setIsHandlingToken] = useState(false);
  const [list, setList] = useState<TokenItemShowType[]>([]);

  // when change account ,we need to init market tokenList
  useEffect(() => {
    // initTokenList();
  }, [currentAccount]);

  useEffect(() => {
    if (tokenDataShowInMarket.length) return;
    fetchTokenList({ pageSize: 10000, pageNo: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setList(filterTokenList(tokenDataShowInMarket, keyword));
  }, [tokenDataShowInMarket, keyword]);

  // const dispatch = useAppDispatch();
  console.log('tokenState', tokenState);

  const onHandleToken = useCallback(
    async (item: TokenItemShowType, type: 'add' | 'delete') => {
      // if (isHandlingToken) return;
      // setIsHandlingToken(true);

      try {
        if (type === 'add') {
          addToken(item);
        } else {
          deleteToken(item);
        }
      } catch (error) {
        CommonToast.fail(t('Operation Failed'));
      }
      // await sleep(500);
      // setIsHandlingToken(false);
    },
    [addToken, deleteToken, t],
  );

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
      {!!keyword && !list.length && <TextM style={pageStyles.noResult}>{t('There is no search result.')}</TextM>}
      <FlatList
        style={pageStyles.list}
        data={list || []}
        renderItem={({ item }) => <Item item={item} onHandleToken={onHandleToken} />}
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
