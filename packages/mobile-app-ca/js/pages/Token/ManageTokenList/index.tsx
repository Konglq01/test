import PageContainer from 'components/PageContainer';
import { useIsFetchingTokenList, useToken } from '@portkey/hooks/hooks-ca/useToken';
import { TokenItemShowType } from '@portkey/types/types-ca/token';
import CommonInput from 'components/CommonInput';
import { useAppCASelector } from '@portkey/hooks/hooks-ca';
import { Dialog } from '@rneui/themed';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import gStyles from 'assets/theme/GStyles';
import { defaultColors } from 'assets/theme';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import CommonToast from 'components/CommonToast';
import { TextL, TextM, TextS } from 'components/CommonText';
import { pTd } from 'utils/unit';
import Svg from 'components/Svg';
import CommonSwitch from 'components/CommonSwitch';
import CommonAvatar from 'components/CommonAvatar';
import { useLanguage } from 'i18n/hooks';
import NoData from 'components/NoData';
import { fetchAllTokenListAsync } from '@portkey/store/store-ca/tokenManagement/action';
import useDebounce from 'hooks/useDebounce';
import { useAppCommonDispatch } from '@portkey/hooks';
import { request } from '@portkey/api/api-did';
import { useCurrentNetworkInfo } from '@portkey/hooks/hooks-ca/network';
import { useCaAddresses, useChainIdList, useWallet } from '@portkey/hooks/hooks-ca/wallet';
import { fetchTokenListAsync } from '@portkey/store/store-ca/assets/slice';
import Loading from 'components/Loading';
import { formatChainInfo } from 'utils';
import { FontStyles } from 'assets/theme/styles';

interface ManageTokenListProps {
  route?: any;
}

type ItemProps = {
  isTestnet: boolean;
  item: TokenItemShowType;
  onHandleToken: (item: TokenItemShowType, type: 'add' | 'delete') => void;
};
function areEqual(prevProps: ItemProps, nextProps: ItemProps) {
  return nextProps.item.isAdded === prevProps.item.isAdded;
}

const Item = memo(({ isTestnet, item, onHandleToken }: ItemProps) => {
  return (
    <TouchableOpacity style={itemStyle.wrap} key={`${item.symbol}${item.address}${item.chainId}}`}>
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
        <View>
          <TextL numberOfLines={1} ellipsizeMode={'tail'}>
            {item.symbol}
          </TextL>
          <TextS numberOfLines={1} ellipsizeMode={'tail'} style={[FontStyles.font3]}>
            {`${formatChainInfo(item.chainId)} ${isTestnet && 'Testnet'}`}
          </TextS>
        </View>

        {item.isDefault ? (
          <Svg icon="lock" size={pTd(20)} iconStyle={itemStyle.addedStyle} />
        ) : (
          <CommonSwitch value={!!item.isAdded} onChange={() => onHandleToken(item, item.isAdded ? 'delete' : 'add')} />
        )}
      </View>
    </TouchableOpacity>
  );
}, areEqual);
Item.displayName = 'Item';

const ManageTokenList: React.FC<ManageTokenListProps> = () => {
  const { t } = useLanguage();

  const isLoading = useIsFetchingTokenList();
  const currentNetworkInfo = useCurrentNetworkInfo();
  const { currentNetwork } = useWallet();

  const chainList = useChainIdList();

  const dispatch = useAppCommonDispatch();
  const caAddressArray = useCaAddresses();

  const { tokenDataShowInMarket } = useAppCASelector(state => state.tokenManagement);

  const [tokenList, setTokenList] = useState([]);

  const [keyword, setKeyword] = useState<string>('');
  // const [tokenList, setTokenList] = useState(tokenDataShowInMarket);

  const debounceWord = useDebounce(keyword, 500);

  // useEffect(() => {
  //   return setTokenList(tokenDataShowInMarket);
  // }, [tokenDataShowInMarket]);

  useEffect(() => {
    if (tokenDataShowInMarket.length) return;
    dispatch(fetchAllTokenListAsync({ keyword: debounceWord, chainIdArray: chainList }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onHandleTokenItem = useCallback(
    async (item: TokenItemShowType, isAdded: boolean) => {
      // TODO
      Loading.show();
      await request.token
        .displayUserToken({
          baseURL: currentNetworkInfo.apiUrl,
          resourceUrl: `${item.userTokenId}/display`,
          params: {
            isDisplay: isAdded,
          },
        })
        .then(res => {
          setTimeout(() => {
            dispatch(fetchAllTokenListAsync({ keyword: debounceWord, chainIdArray: chainList }));
            dispatch(fetchTokenListAsync({ caAddresses: caAddressArray }));
            Loading.hide();

            CommonToast.success('Success');
          }, 1000);
        })
        .catch(err => {
          console.log(err);
          CommonToast.fail('Fail');
        });
    },
    [caAddressArray, chainList, currentNetworkInfo.apiUrl, debounceWord, dispatch],
  );

  useEffect(() => {
    dispatch(fetchAllTokenListAsync({ keyword: debounceWord, chainIdArray: chainList }));
  }, [chainList, debounceWord, dispatch]);

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
      {!!keyword && !tokenDataShowInMarket.length && <NoData noPic message={t('There is no search result.')} />}
      <FlatList
        style={pageStyles.list}
        data={tokenDataShowInMarket || []}
        renderItem={({ item }: { item: TokenItemShowType }) => (
          <Item
            isTestnet={currentNetwork === 'TESTNET'}
            item={item}
            onHandleToken={() => onHandleTokenItem(item, !item?.isAdded)}
          />
        )}
        keyExtractor={(item: TokenItemShowType) => item?.id || item?.symbol}
      />
      {/* {isLoading && <Dialog.Loading />} */}
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
