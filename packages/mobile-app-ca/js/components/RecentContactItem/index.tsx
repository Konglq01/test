import { useWallet } from '@portkey/hooks/hooks-ca/wallet';
import { ContactItemType, RecentContactItemType } from '@portkey/types/types-ca/contact';
import { defaultColors } from 'assets/theme';
import { fontColorStyle } from 'assets/theme/color';
import GStyles from 'assets/theme/GStyles';
import Collapsible from 'components/Collapsible';
import { TextM, TextS, TextXXXL } from 'components/CommonText';
import Svg from 'components/Svg';
import React, { memo, useState } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { formatStr2EllipsisStr } from 'utils';
// import { formatStr2EllipsisStr } from 'utils';
import { pTd } from 'utils/unit';

export interface ItemType {
  contact: ContactItemType | RecentContactItemType;
  onPress?: (item: any) => void;
}

const RecentContactItem: React.FC<ItemType> = props => {
  const { contact, onPress } = props;

  const { currentNetwork } = useWallet();

  const [collapsed, setCollapsed] = useState(true);

  if (contact?.name)
    return (
      <TouchableOpacity style={styles.itemWrap}>
        <TouchableOpacity style={styles.topWrap} onPress={() => setCollapsed(!collapsed)}>
          <View style={styles.itemAvatar}>
            <TextXXXL>{contact.name.slice(0, 1)}</TextXXXL>
          </View>
          <TextM style={styles.contactName}>{contact.name}</TextM>
          <Svg icon={collapsed ? 'down-arrow' : 'up-arrow'} size={pTd(20)} />
        </TouchableOpacity>

        <Collapsible collapsed={collapsed} style={styles.addressListWrap}>
          {contact?.addresses?.map((ele, index) => (
            <TouchableOpacity
              style={[index !== 0 && styles.addressItemWrap]}
              key={`${ele?.address}${ele.chainType}`}
              onPress={() => {
                onPress?.({ address: contact.addresses?.[0].address, name: contact.name });
              }}>
              <Text style={[styles.address, Math.random() > 0.5 && fontColorStyle.color7]}>
                {formatStr2EllipsisStr(ele?.address, 10)}
              </Text>
              {/* TODO */}
              <Text style={[styles.address, Math.random() > 0.5 && fontColorStyle.color7]}>
                {`${ele?.chainId === 'AELF' ? 'MainChain' : 'SideChain'} ${ele?.chainId} ${
                  currentNetwork === 'TESTNET' && 'Testnet'
                }`}
              </Text>
            </TouchableOpacity>
          ))}
        </Collapsible>
      </TouchableOpacity>
    );

  return (
    <TouchableOpacity
      style={styles.itemWrap}
      onPress={() => {
        onPress?.({ address: contact.addresses?.[0].address, name: '' });
      }}>
      <TextS style={styles.address1}>{formatStr2EllipsisStr(contact.addresses?.[0].address, 10)}</TextS>
      <Text style={styles.chainInfo1}>{`${contact?.id === 'AELF' ? 'MainChain' : 'SideChain'} ${contact?.id} ${
        currentNetwork === 'TESTNET' && 'Testnet'
      }`}</Text>
    </TouchableOpacity>
  );
};

export default memo(RecentContactItem);

export const styles = StyleSheet.create({
  itemWrap: {
    width: '100%',
    ...GStyles.paddingArg(20, 20),
    borderBottomColor: defaultColors.bg7,
    borderBottomWidth: pTd(1),
    backgroundColor: defaultColors.bg1,
  },
  itemAvatar: {
    borderWidth: pTd(1),
    borderColor: defaultColors.border1,
    width: pTd(45),
    height: pTd(45),
    borderRadius: pTd(23),
    backgroundColor: defaultColors.bg4,
    marginRight: pTd(10),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topWrap: {
    ...GStyles.flexRow,
    alignItems: 'center',
  },
  contactName: {
    flex: 1,
  },
  addressListWrap: {
    paddingTop: pTd(10),
    paddingBottom: pTd(10),
    marginLeft: pTd(54),
  },
  addressItemWrap: {
    marginTop: pTd(16),
  },
  address: {
    color: defaultColors.font3,
    width: '100%',
    fontSize: pTd(10),
  },
  itemNameWrap: {
    flex: 1,
  },
  itemName: {
    color: defaultColors.font3,
    fontSize: pTd(14),
  },
  address1: {},
  chainInfo1: {
    marginTop: pTd(4),
    fontSize: pTd(10),
    color: defaultColors.font3,
  },
});
