import { useAppCASelector } from '@portkey/hooks/hooks-ca';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { TextM } from 'components/CommonText';
import Svg from 'components/Svg';
import { useLanguage } from 'i18n/hooks';
import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { formatStr2EllipsisStr } from 'utils';

import { pTd } from 'utils/unit';

interface ToProps {
  selectedToContact: { name: string; address: string };
  setSelectedToContact: (contact: any) => void;
  tokenItem: any;
  step: 1 | 2;
  setStep: any;
}

export default function To({ selectedToContact, setSelectedToContact, step, setStep }: ToProps) {
  const { t } = useLanguage();

  const { contactMap } = useAppCASelector(store => store.contact);

  return (
    <View style={styles.toWrap}>
      <TextM style={styles.leftTitle}>{t('To')}</TextM>

      {!selectedToContact?.name ? (
        <View style={styles.middle}>
          {/* <Input
          
            containerStyle={styles.containerStyle}
            inputContainerStyle={styles.inputContainerStyle}
            inputStyle={styles.inputStyle}
            value={selectedToContact?.address || ''}
            onChangeText={v => setSelectedToContact({ name: '', address: v.trim() })}
          /> */}
          <TextInput
            editable={step === 1}
            style={styles.inputStyle}
            placeholder={t('Address')}
            multiline={true}
            value={selectedToContact?.address || ''}
            onChangeText={v => setSelectedToContact({ name: '', address: v.trim() })}
          />

          {!!selectedToContact?.address && (
            <TouchableOpacity
              style={styles.iconWrap}
              onPress={() => {
                setStep(1);
                setSelectedToContact({ address: '', title: '' });
              }}>
              <Svg icon="clear2" size={pTd(16)} />
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View style={styles.middle}>
          <Text style={styles.middleTitle}>{selectedToContact?.name || 'xxxx'}</Text>
          <Text style={styles.middleAddress}>
            {formatStr2EllipsisStr(selectedToContact?.address, 15) || 'ELF_U97UqZe52baDgmgjEKLXiF34eEu3432sdfsdH5_AELF'}
          </Text>

          <TouchableOpacity
            style={styles.iconWrap}
            onPress={() => {
              setStep(1);
              setSelectedToContact({ address: '', name: '' });
            }}>
            <Svg icon="clear2" size={pTd(16)} />
          </TouchableOpacity>
        </View>
      )}
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
    width: pTd(235),
    fontSize: pTd(10),
    color: defaultColors.font3,
    lineHeight: pTd(14),
  },
  iconWrap: {
    zIndex: 100,
    position: 'absolute',
    right: 0,
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
    paddingRight: pTd(30),
    fontSize: pTd(14),
  },
  right: {
    width: pTd(16),
  },
});
