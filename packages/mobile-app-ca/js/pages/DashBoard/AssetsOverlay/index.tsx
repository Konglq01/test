import React, { useState, useCallback, useEffect, useRef } from 'react';
import OverlayModal from 'components/OverlayModal';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TextL, TextS, TextXL } from 'components/CommonText';
import { ModalBody } from 'components/ModalBody';
import CommonInput from 'components/CommonInput';
import { AccountType } from '@portkey/types/wallet';
import { pTd } from 'utils/unit';
import { screenHeight } from '@portkey/utils/mobile/device';
import { useLanguage } from 'i18n/hooks';
import useDebounce from 'hooks/useDebounce';
import NoData from 'components/NoData';
import { Image } from '@rneui/themed';
import { defaultColors } from 'assets/theme';
import { useWallet } from 'hooks/store';
import TokenListItem from 'components/TokenListItem';
import { FontStyles } from 'assets/theme/styles';
import { useCaAddresses } from '@portkey/hooks/hooks-ca/wallet';
import { useCurrentNetworkInfo } from '@portkey/hooks/hooks-ca/network';
import { fetchAssetList } from '@portkey/store/store-ca/assets/api';
import { IAssetItemType } from '@portkey/store/store-ca/assets/type';
import navigationService from 'utils/navigationService';
import { IToSendAssetParamsType, IToSendHomeParamsType } from '@portkey/types/types-ca/routeParams';
import useEffectOnce from 'hooks/useEffectOnce';

type onFinishSelectTokenType = (tokenItem: any) => void;
type TokenListProps = {
  account?: AccountType;
  onFinishSelectToken?: onFinishSelectTokenType;
};

// const enum noResult {
//   'There are currently no assets to send' = 'There are currently no assets to send',
//   'There is no search result.' = 'There is no search result.',
// }

const AssetItem = (props: { symbol: string; onPress: (item: any) => void; item: IAssetItemType }) => {
  const { symbol, onPress, item } = props;

  const { currentNetwork } = useWallet();

  if (item.tokenInfo)
    return (
      <TokenListItem
        symbol={item.symbol}
        icon={'aelf-avatar'}
        item={{ ...item, ...item?.tokenInfo, tokenContractAddress: item.address }}
        onPress={() => onPress(item)}
      />
    );

  if (item.nftInfo) {
    const {
      nftInfo: { tokenId },
    } = item;
    return (
      <TouchableOpacity style={itemStyle.wrap} onPress={() => onPress?.(item)}>
        {item.nftInfo.imageUrl ? (
          <Image style={[itemStyle.left]} source={{ uri: item.nftInfo.imageUrl }} />
        ) : (
          <Text style={[itemStyle.left, itemStyle.noPic]}>{item.symbol[0]}</Text>
        )}
        <View style={itemStyle.right}>
          <View>
            <TextL numberOfLines={1} ellipsizeMode={'tail'} style={[FontStyles.font5]}>
              {`${symbol || 'Name'} #${tokenId}`}
            </TextL>

            {/* TODO: why use currentNetwork   */}
            {currentNetwork ? (
              <TextS numberOfLines={1} style={[FontStyles.font7, itemStyle.nftItemInfo]}>
                {item.chainId === 'AELF' ? 'MainChain' : 'SideChain'} {item.chainId}
              </TextS>
            ) : (
              // TODO: price use witch one
              <TextL style={[FontStyles.font7]}>$ -</TextL>
            )}
          </View>

          {/* TODO: num of nft use witch one */}
          <View style={itemStyle.balanceWrap}>
            <TextXL style={[itemStyle.token, FontStyles.font5]}>{item.nftInfo.balance}</TextXL>
            <TextS style={itemStyle.dollar} />
          </View>
        </View>
      </TouchableOpacity>
    );
  }
  return <></>;
};
const MAX_RESULT_COUNT = 10;
const INIT_PAGE_INFO = {
  curPage: 0,
  total: 0,
  isLoading: false,
};

const AssetList = ({ onFinishSelectToken, account }: TokenListProps) => {
  const { t } = useLanguage();
  const caAddresses = useCaAddresses();
  const currentNetworkInfo = useCurrentNetworkInfo();
  const [keyword, setKeyword] = useState('');

  const debounceKeyword = useDebounce(keyword, 800);

  const [listShow, setListShow] = useState<IAssetItemType[]>([]);
  const pageInfoRef = useRef({
    ...INIT_PAGE_INFO,
  });

  const getList = useCallback(
    async (_keyword = '', isInit = false) => {
      if (!isInit && listShow.length > 0 && listShow.length >= pageInfoRef.current.total) return;
      if (pageInfoRef.current.isLoading) return;
      pageInfoRef.current.isLoading = true;
      try {
        const response = await fetchAssetList({
          caAddresses,
          maxResultCount: MAX_RESULT_COUNT,
          skipCount: pageInfoRef.current.curPage * MAX_RESULT_COUNT,
          keyword: _keyword,
        });
        pageInfoRef.current.curPage = pageInfoRef.current.curPage + 1;
        pageInfoRef.current.total = response.totalRecordCount;
        console.log('fetchAccountAssetsByKeywords:', response);

        if (isInit) {
          setListShow(response.data);
        } else {
          setListShow(pre => pre.concat(response.data));
        }
      } catch (err) {
        // TODO: should show err?
        console.log('fetchAccountAssetsByKeywords err:', err);
      }
      pageInfoRef.current.isLoading = false;
    },
    [caAddresses, listShow.length],
  );

  const onKeywordChange = useCallback(() => {
    pageInfoRef.current = {
      ...INIT_PAGE_INFO,
    };
    getList(debounceKeyword, true);
  }, [getList, debounceKeyword]);

  useEffect(() => {
    onKeywordChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceKeyword]);

  // useEffectOnce(() => {
  //   onKeywordChange();
  // });

  const renderItem = useCallback(({ item }: { item: IAssetItemType }) => {
    return (
      <AssetItem
        symbol={item.symbol || ''}
        // icon={'aelf-avatar'}
        item={item}
        onPress={() => {
          OverlayModal.hide();
          // onFinishSelectToken?.(item);
          const routeParams = {
            sendType: item?.nftInfo ? 'nft' : 'token',
            assetInfo: item?.nftInfo
              ? { ...item?.nftInfo, chainId: item.chainId, symbol: item.symbol }
              : { ...item?.tokenInfo, chainId: item.chainId, symbol: item.symbol },
            toInfo: {
              address: '',
              name: '',
            },
          };
          navigationService.navigate('SendHome', routeParams as unknown as IToSendHomeParamsType);
        }}
      />
    );
  }, []);

  return (
    <ModalBody modalBodyType="bottom" style={styles.modalStyle}>
      <TextXL style={[styles.title, FontStyles.font5]}>{t('Select Assets')}</TextXL>

      {/* no assets in this accout  */}
      {/* '{ import { list } from 'pages/SettingsPage/HelpAndFeedBack/config';' has been removed } */}
      <CommonInput
        placeholder={t('Search Assets')}
        containerStyle={styles.containerStyle}
        inputContainerStyle={styles.inputContainerStyle}
        inputStyle={styles.inputStyle}
        value={keyword}
        onChangeText={v => {
          setKeyword(v.trim());
        }}
      />

      {listShow.length === 0 ? (
        debounceKeyword ? (
          <NoData noPic message={t('No results found')} />
        ) : (
          <NoData noPic message={t('There are currently no assets to send.')} />
        )
      ) : (
        <FlatList
          style={styles.flatList}
          data={listShow || []}
          renderItem={renderItem}
          keyExtractor={(_item, index) => `${index}`}
          onEndReached={() => {
            getList();
          }}
        />
      )}
    </ModalBody>
  );
};

export const showAssetList = (props: TokenListProps) => {
  OverlayModal.show(<AssetList {...props} />, {
    position: 'bottom',
    autoKeyboardInsets: false,
  });
};

export default {
  showAssetList,
};

export const styles = StyleSheet.create({
  modalStyle: {
    height: screenHeight - pTd(100),
  },
  title: {
    textAlign: 'center',
    height: pTd(22),
    lineHeight: pTd(22),
    marginTop: pTd(17),
    marginBottom: pTd(16),
  },
  containerStyle: {
    marginLeft: pTd(16),
    width: pTd(343),
    marginBottom: pTd(8),
  },
  inputContainerStyle: {
    height: pTd(44),
  },
  inputStyle: {
    height: pTd(44),
  },
  flatList: {
    marginTop: pTd(8),
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
    width: pTd(48),
    height: pTd(48),
    borderRadius: pTd(6),
    overflow: 'hidden',
  },
  noPic: {
    backgroundColor: defaultColors.bg7,
    color: defaultColors.font7,
    fontSize: pTd(20),
    textAlign: 'center',
    lineHeight: pTd(48),
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
    borderBottomColor: defaultColors.bg7,
    borderBottomWidth: pTd(0.5),
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
    lineHeight: pTd(22),
    overflow: 'hidden',
  },
  dollar: {
    marginTop: pTd(2),
    lineHeight: pTd(16),
  },
  nftItemInfo: {
    marginTop: pTd(2),
  },
});
