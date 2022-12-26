/* eslint-disable prettier/prettier */
import { View, Text } from 'react-native';
import React from 'react';
import Svg from 'components/Svg';
import { Styles } from './style/style';

interface TokenShowItemType {
  item: any;
  onHandleToken?: (item: any, type: 'delete' | 'add') => void;
}

const TokenShowItem: React.FC<TokenShowItemType> = props => {
  const { item = 'test', onHandleToken } = props;
  const { isDefault = false, isAdded = true, symbol = '' } = item;

  return (
    <View style={Styles.itemWrap}>
      <View style={Styles.leftDom}>
        <Text style={Styles.iconWrap}>
          <Svg icon="add1" />
        </Text>
        <Text style={Styles.title}>{symbol}</Text>
      </View>
      {isDefault && <Text style={Styles.buttonDefault}>已添加</Text>}
      {!isDefault && isAdded && (
        <Text style={Styles.buttonStyle} onPress={() => onHandleToken?.(item, 'delete')}>
          移除
        </Text>
      )}
      {!isDefault && !isAdded && (
        <Text style={Styles.buttonStyle} onPress={() => onHandleToken?.(item, 'add')}>
          添加
        </Text>
      )}
    </View>
  );
};

export default TokenShowItem;
