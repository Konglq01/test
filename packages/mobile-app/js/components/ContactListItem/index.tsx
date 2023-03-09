import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import React, { memo } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
// import { addressBookUpdate } from '@portkey-wallet/store/addressBook/actions';
// import { addressFormat, isAddress } from '@portkey-wallet/utils';
// import { NetworkType } from '@portkey-wallet/types';
import { formatStr2EllipsisStr } from 'utils';
import { pTd } from 'utils/unit';

export interface ContactListItemType {
  name?: string;
  title?: string;
  address?: string;
  item?: any;
  onPress?: (item: any) => void;
}

const ContactListItem: React.FC<ContactListItemType> = props => {
  const { title, address = '', item, onPress } = props;

  return (
    <TouchableOpacity onPress={() => onPress?.(item)}>
      {title ? (
        <View style={styles.itemWrap}>
          <Text style={styles.itemTitle}>{title}</Text>
          <Text style={styles.space} />
          <Text style={styles.itemAddress}>{formatStr2EllipsisStr(address, 22)}</Text>
        </View>
      ) : (
        <View style={styles.itemWrap}>
          <Text style={styles.onlyItemAddress}>{formatStr2EllipsisStr(address, 22)}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default memo(ContactListItem);

const styles = StyleSheet.create({
  itemWrap: {
    height: pTd(73),
    width: '100%',
    ...GStyles.paddingArg(16, 16, 18),
    display: 'flex',
    justifyContent: 'center',
    borderBottomColor: defaultColors.border6,
    borderBottomWidth: pTd(0.5),
  },
  itemTitle: {
    color: defaultColors.font5,
    fontSize: pTd(14),
    lineHeight: pTd(20),
  },
  space: {
    height: pTd(5),
  },
  itemAddress: {
    color: defaultColors.font3,
    fontSize: pTd(10),
  },
  onlyItemAddress: {
    color: defaultColors.font5,
    fontSize: pTd(12),
  },
});
