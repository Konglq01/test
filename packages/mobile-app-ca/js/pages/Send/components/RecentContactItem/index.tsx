import { useWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { RecentContactItemType } from '@portkey-wallet/types/types-ca/contact';
import { defaultColors } from 'assets/theme';
import { FontStyles } from 'assets/theme/styles';
import GStyles from 'assets/theme/GStyles';
import Collapsible from 'components/Collapsible';
import { TextM, TextS, TextXXL } from 'components/CommonText';
import Svg from 'components/Svg';
import React, { memo, useState } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { formatChainInfoToShow, formatStr2EllipsisStr } from '@portkey-wallet/utils';
import { pTd } from 'utils/unit';
import { ChainId } from '@portkey-wallet/types';

export interface ItemType {
  contact: RecentContactItemType;
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
            <TextXXL>{contact.name.slice(0, 1)}</TextXXL>
          </View>
          <TextM style={styles.contactName}>{contact.name}</TextM>
          <Svg icon={collapsed ? 'down-arrow' : 'up-arrow'} size={pTd(20)} />
        </TouchableOpacity>

        <Collapsible collapsed={collapsed} style={styles.addressListWrap}>
          {contact?.addresses?.map((ele, index) => (
            <TouchableOpacity
              style={[index !== 0 && styles.addressItemWrap]}
              key={`${ele?.address}${ele?.chainId}`}
              onPress={() => {
                const { address, chainId } = contact.addresses?.[index];
                onPress?.({ address: `ELF_${address}_${chainId}`, name: contact.name });
              }}>
              <Text style={[styles.address, !!0 && FontStyles.font7]}>
                {formatStr2EllipsisStr(`ELF_${ele?.address}_${ele.chainId}`, 10)}
              </Text>
              {/* TODO */}
              <Text style={[styles.address, !!0 && FontStyles.font7]}>
                {/* TODO: delete as  */}

                {formatChainInfoToShow(ele?.chainId as ChainId, currentNetwork)}
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
        onPress?.({ address: `ELF_${contact.addresses?.[0].address}_${contact.addresses?.[0].chainId}`, name: '' });
      }}>
      <TextS style={styles.address1}>
        {formatStr2EllipsisStr(`ELF_${contact.addresses?.[0].address}_${contact.addressChainId}`, 10)}
      </TextS>
      {/* TODO: delete as  */}
      <Text style={styles.chainInfo1}>{formatChainInfoToShow(contact?.addressChainId as ChainId, currentNetwork)}</Text>
    </TouchableOpacity>
  );
};

export default memo(RecentContactItem);

export const styles = StyleSheet.create({
  itemWrap: {
    width: '100%',
    ...GStyles.paddingArg(20, 20),
    borderBottomColor: defaultColors.bg7,
    borderBottomWidth: StyleSheet.hairlineWidth,
    backgroundColor: defaultColors.bg1,
  },
  itemAvatar: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: defaultColors.border1,
    width: pTd(40),
    height: pTd(40),
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
