import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { defaultColors } from 'assets/theme';
import navigationService from 'utils/navigationService';
import { useLanguage } from 'i18n/hooks';
import { pTd } from 'utils/unit';
import Collapsible from 'components/Collapsible';
import NFTAvatar from 'components/NFTAvatar';
import GStyles from 'assets/theme/GStyles';
import CommonAvatar from 'components/CommonAvatar';
import Svg from 'components/Svg';
import { TextM, TextXL } from 'components/CommonText';
import { fontColorStyle } from 'assets/theme/color';
import { useWallet } from 'hooks/store';

export enum NoDataMessage {
  CustomNetWorkNoData = 'No transaction records accessible from the current custom network',
  CommonNoData = 'You have no transactions',
}

export type NFTItemType = {
  data: any;
  collapsed?: boolean;
  currentNFT?: any;
  setCurrentNFT?: any;
  loadMoreItem?: (id: string) => void;
};

export default function NFTItem(props: NFTItemType) {
  const { collapsed = false, data, currentNFT, setCurrentNFT, loadMoreItem } = props;
  const { currentNetwork } = useWallet();

  const { t } = useLanguage();

  console.log(data?.nftInfo?.nftProtocolInfo);

  console.log('22222', collapsed, currentNFT, data?.name);
  const setResult = data?.name === currentNFT ? '' : data?.name;
  console.log('setResult', setResult);

  return (
    <View style={styles.wrap}>
      <TouchableOpacity
        style={styles.topSeries}
        onPress={() => setCurrentNFT(data?.name === currentNFT ? '' : data?.name)}>
        <Svg
          icon={collapsed ? 'right-arrow' : 'down-arrow'}
          size={pTd(16)}
          color={defaultColors.font3}
          iconStyle={styles.touchIcon}
        />
        <CommonAvatar title={data?.name} shapeType={'square'} style={styles.avatarStyle} />
        <View style={styles.topSeriesCenter}>
          <TextXL style={styles.nftSeriesName}>{data?.name}</TextXL>
          <TextM style={styles.nftSeriesChainInfo}>
            {data?.chainId} {currentNetwork !== 'MAIN' && 'Testnet'}
          </TextM>
        </View>
        <View>
          <TextXL style={styles.nftSeriesName}>{4}</TextXL>
          <TextM style={styles.nftSeriesChainInfo} />
        </View>
      </TouchableOpacity>
      <Collapsible collapsed={collapsed}>
        <View style={styles.listWrap}>
          {data?.nftInfo?.nftProtocolInfo?.map((ele: any, index: number) => (
            <NFTAvatar
              style={[styles.itemAvatarStyle, index % 3 === 2 ? styles.noMarginRight : {}]}
              key={ele.symbol}
              data={ele}
              onPress={() => {
                navigationService.navigate('NFTDetail', { item: ele });
              }}
            />
          ))}
        </View>
        <TouchableOpacity style={styles.loadMore} onPress={() => loadMoreItem?.(data.name)}>
          <TextM style={fontColorStyle.color4}>More</TextM>
          <Svg icon="down-arrow" size={pTd(16)} color={defaultColors.primaryColor} iconStyle={styles.downArrow} />
        </TouchableOpacity>
      </Collapsible>
      <View style={styles.divider} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    backgroundColor: defaultColors.bg1,
  },
  itemWrap: {
    width: '100%',
    height: pTd(100),
    ...GStyles.marginArg(24, 20),
  },

  topSeries: {
    ...GStyles.flexRow,
    alignItems: 'center',
    ...GStyles.marginArg(24, 20, 0),
  },
  listWrap: {
    ...GStyles.flexRow,
    paddingLeft: pTd(44),
    paddingRight: pTd(20),
    marginTop: pTd(16),
    marginBottom: pTd(16),
  },
  touchIcon: {
    marginRight: pTd(10),
  },
  avatarStyle: {
    width: pTd(36),
    height: pTd(36),
    lineHeight: pTd(36),
  },
  topSeriesCenter: {
    flex: 1,
    paddingLeft: pTd(12),
  },
  nftSeriesName: {
    lineHeight: pTd(22),
  },
  nftSeriesChainInfo: {
    marginTop: pTd(4),
    lineHeight: pTd(16),
  },
  itemAvatarStyle: {
    marginRight: pTd(8),
    marginBottom: pTd(8),
  },
  noMarginRight: {
    marginRight: 0,
  },
  loadMore: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingLeft: pTd(44),
    paddingRight: pTd(21),
    textAlign: 'center',
  },
  downArrow: {
    marginLeft: pTd(4),
  },
  divider: {
    width: '100%',
    marginTop: pTd(24),
    marginLeft: pTd(44),
    height: pTd(1),
    backgroundColor: defaultColors.bg7,
  },
});
