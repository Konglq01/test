import { defaultColors } from 'assets/theme';
import { FontStyles } from 'assets/theme/styles';
import CommonAvatar from 'components/CommonAvatar';
import { TextL, TextS } from 'components/CommonText';
import React, { memo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { pTd } from 'utils/unit';
import { IRecordsItemType } from '@portkey-wallet/types/types-ca/discover';
interface TokenListItemType {
  item: IRecordsItemType;
  onPress?: () => void;
}

const RecordItem: React.FC<TokenListItemType> = props => {
  const { item, onPress } = props;

  return (
    <TouchableOpacity style={itemStyle.wrap} onPress={() => onPress?.()}>
      <CommonAvatar hasBorder avatarSize={pTd(32)} svgName={'elf-icon'} />
      <View style={itemStyle.right}>
        <View style={itemStyle.infoWrap}>
          <TextL numberOfLines={1} ellipsizeMode={'tail'} style={itemStyle.gameName}>
            {item?.name || 'title'}
          </TextL>
          <TextS numberOfLines={1} style={[FontStyles.font3, itemStyle.gameInfo]}>
            {item?.url || 'wwww.baidu.com'}
          </TextS>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default memo(RecordItem);

const itemStyle = StyleSheet.create({
  wrap: {
    height: pTd(70),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  right: {
    height: pTd(80),
    marginLeft: pTd(16),
    paddingRight: pTd(16),
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: defaultColors.border6,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  infoWrap: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  gameName: {
    lineHeight: pTd(22),
  },
  gameInfo: {
    lineHeight: pTd(16),
    marginTop: pTd(2),
  },
});
