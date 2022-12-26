import { Input } from '@rneui/base';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { TextM } from 'components/CommonText';
import Svg from 'components/Svg';
import { useLanguage } from 'i18n/hooks';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { formatStr2EllipsisStr } from 'utils';

import navigationService from 'utils/navigationService';
import { pTd } from 'utils/unit';

interface ToProps {
  selectedFromAccount: { accountName: string; address: string };
  selectedToContact: { name: string; address: string };
  setSelectedToContact: (contact: any) => void;
  tokenItem: any;
}

export default function To({ selectedFromAccount, selectedToContact, setSelectedToContact, tokenItem }: ToProps) {
  const { t } = useLanguage();
  console.log('selectedFromAccount', selectedFromAccount, selectedToContact);

  return (
    <View style={styles.toWrap}>
      <TextM style={styles.leftTitle}>{t('To')}</TextM>

      {selectedToContact?.name ? (
        <View style={styles.middle}>
          <Text style={styles.middleTitle}>{selectedToContact?.name || ''}</Text>
          <Text style={styles.middleAddress}>{formatStr2EllipsisStr(selectedToContact?.address, 15) || ''}</Text>
          <TouchableOpacity style={styles.iconWrap} onPress={() => setSelectedToContact({ address: '', title: '' })}>
            <Svg icon="clear" size={pTd(16)} />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.middle}>
          <Input
            placeholder={t('Address')}
            containerStyle={styles.containerStyle}
            inputContainerStyle={styles.inputContainerStyle}
            inputStyle={styles.inputStyle}
            value={selectedToContact?.address || ''}
            onChangeText={v => setSelectedToContact({ name: '', address: v.trim() })}
          />
        </View>
      )}

      <TouchableOpacity
        style={styles.right}
        onPress={() => {
          navigationService.navigate('SelectContact', {
            tokenItem,
            address: selectedFromAccount.address,
            name: selectedFromAccount.accountName,
          });
        }}>
        <Svg icon="contact" size={pTd(16)} />
      </TouchableOpacity>
    </View>
  );
}

export const styles = StyleSheet.create({
  toWrap: {
    height: pTd(56),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderTopColor: defaultColors.border6,
    borderTopWidth: pTd(0.5),
  },
  leftTitle: {
    width: pTd(49),
    color: defaultColors.font3,
  },
  middle: {
    position: 'relative',
    flex: 1,
    justifyContent: 'center',
  },
  middleTitle: {
    fontSize: pTd(14),
    color: defaultColors.font5,
    lineHeight: pTd(20),
  },
  middleAddress: {
    marginTop: pTd(2),
    fontSize: pTd(10),
    color: defaultColors.font3,
    lineHeight: pTd(14),
  },
  iconWrap: {
    zIndex: 100,
    position: 'absolute',
    right: pTd(18),
    bottom: pTd(10),
    width: pTd(16),
    height: pTd(16),
  },
  containerStyle: {
    ...GStyles.marginArg(0),
    ...GStyles.paddingArg(0),
    height: pTd(56),
  },
  inputContainerStyle: {
    borderBottomColor: defaultColors.bg1,
    height: pTd(56),
  },
  inputStyle: {
    color: defaultColors.font5,
    paddingRight: pTd(50),
    fontSize: pTd(14),
  },
  right: {
    width: pTd(16),
  },
});
