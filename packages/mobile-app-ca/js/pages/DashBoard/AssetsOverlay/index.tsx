import React, { useState, useCallback, useEffect } from 'react';
import OverlayModal from 'components/OverlayModal';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TextL, TextM, TextS, TextXL } from 'components/CommonText';
import { ModalBody } from 'components/ModalBody';
import CommonInput from 'components/CommonInput';
import { useAppCASelector } from '@portkey/hooks/hooks-ca';
import { AccountType } from '@portkey/types/wallet';
import { pTd } from 'utils/unit';
import { screenHeight } from '@portkey/utils/mobile/device';
import { useLanguage } from 'i18n/hooks';
import useDebounce from 'hooks/useDebounce';
import useEffectOnce from 'hooks/useEffectOnce';
import { fetchAssetAsync } from '@portkey/store/store-ca/assets/slice';
import { useAppCommonDispatch } from '@portkey/hooks';
import NoData from 'components/NoData';
import { Image } from '@rneui/themed';
import { defaultColors } from 'assets/theme';
import { useWallet } from 'hooks/store';
import TokenListItem from 'components/TokenListItem';
import { FontStyles } from 'assets/theme/styles';
import { useCaAddresses } from '@portkey/hooks/hooks-ca/wallet';

type onFinishSelectTokenType = (tokenItem: any) => void;
type TokenListProps = {
  account?: AccountType;
  onFinishSelectToken?: onFinishSelectTokenType;
};

const mockUrl =
  'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/fotojet-5-1650369753.jpg?crop=0.498xw:0.997xh;0,0&resize=640:*';

// const enum noResult {
//   'There are currently no assets to send' = 'There are currently no assets to send',
//   'There is no search result.' = 'There is no search result.',
// }

const AssetItem = (props: any) => {
  const { symbol, onPress, item } = props;

  const { currentNetwork } = useWallet();

  if (item?.tokenInfo)
    return (
      <TokenListItem
        symbol={item.symbol}
        icon={'aelf-avatar'}
        item={{ ...item, ...item?.tokenInfo, tokenContractAddress: item.address }}
        onPress={() => onPress(item)}
      />
    );

  return (
    <TouchableOpacity style={itemStyle.wrap} onPress={() => onPress?.(item)}>
      {!mockUrl ? (
        <Image style={[itemStyle.left]} source={{ uri: mockUrl }} />
      ) : (
        <Text style={[itemStyle.left, itemStyle.noPic]}>M</Text>
      )}
      {/* <CommonAvatar style={itemStyle.left} title={symbol} svgName={undefined} avatarSize={pTd(48)} /> */}
      <View style={itemStyle.right}>
        <View>
          <TextL numberOfLines={1} ellipsizeMode={'tail'} style={[FontStyles.font5]}>
            {symbol || 'Name'} {'#0271'}
          </TextL>

          {currentNetwork ? (
            <TextS numberOfLines={1} style={[FontStyles.font7, itemStyle.nftItemInfo]}>
              {item?.chainId === ' AELF' ? 'MainChain' : 'SideChain'} {item.chainId}
            </TextS>
          ) : (
            <TextL style={[FontStyles.font7]}>$ 100 USD</TextL>
          )}
        </View>

        <View style={itemStyle.balanceWrap}>
          <TextXL style={[itemStyle.token, FontStyles.font5]}>{`2`}</TextXL>
          <TextS style={itemStyle.dollar} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const AssetList = ({ onFinishSelectToken, account }: TokenListProps) => {
  const { t } = useLanguage();
  const { accountAssets } = useAppCASelector(state => state.assets);
  const dispatch = useAppCommonDispatch();

  const caAddresses = useCaAddresses();

  const [listShow, setListShow] = useState<any[]>([]);

  const [filterListInfo, setFilterListInfo] = useState({
    pageSize: 10,
    pageNum: 1,
    keyword: '',
    list: [],
    total: 0,
    isLoading: false,
  });

  const debounceKeyword = useDebounce(filterListInfo.keyword, 800);

  const renderItem = useCallback(
    ({ item }: { item: any }) => {
      return (
        <AssetItem
          key={item.id}
          symbol={item.symbol}
          icon={'aelf-avatar'}
          item={item}
          onPress={() => {
            OverlayModal.hide();
            onFinishSelectToken?.(item);
          }}
        />
      );
    },
    [onFinishSelectToken],
  );

  useEffect(() => {
    // return setListShow(filterTokenList(list, keyword));
    console.log('change words');
  }, [debounceKeyword]);

  useEffect(() => {
    console.log('accountAssetsListaccountAssetsListaccountAssetsList', accountAssets);

    setListShow(accountAssets.accountAssetsList);
  }, [accountAssets, accountAssets.accountAssetsList]);

  useEffectOnce(() => {
    if (accountAssets.accountAssetsList.length !== 0) return;
    dispatch(fetchAssetAsync({ caAddresses, keyWord: ' ' }));
  });

  return (
    <ModalBody modalBodyType="bottom" style={styles.modalStyle}>
      <TextXL style={[styles.title, FontStyles.font5]}>{t('Select Assets')}</TextXL>

      {/* no assets in this accout  */}
      {/* '{ import { list } from 'pages/SettingsPage/HelpAndFeedBack/config';' has been removed } */}
      {filterListInfo?.list?.length ? (
        <NoData noPic message={t('There are currently no assets to send')} />
      ) : (
        <CommonInput
          placeholder={t('Search Assets')}
          containerStyle={styles.containerStyle}
          inputContainerStyle={styles.inputContainerStyle}
          inputStyle={styles.inputStyle}
          value={filterListInfo.keyword}
          onChangeText={v => {
            setFilterListInfo({
              ...filterListInfo,
              keyword: v.trim(),
            });
          }}
        />
      )}

      {listShow.length === 0 ? (
        <NoData noPic message={t('There are currently no assets to send.')} />
      ) : (
        <FlatList
          style={styles.flatList}
          data={listShow || []}
          renderItem={renderItem}
          keyExtractor={(item: any) => item.id || ''}
        />
      )}
    </ModalBody>
  );
};

export const showAssetList = (props: TokenListProps) => {
  OverlayModal.show(<AssetList {...props} />, {
    position: 'bottom',
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
