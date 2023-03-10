import React from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { pTd } from 'utils/unit';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { useLanguage } from 'i18n/hooks';
import { TextM } from 'components/CommonText';
import { FontStyles } from 'assets/theme/styles';

interface AmountNFT {
  sendNumber: string;
  setSendNumber: any;
}

export default function AmountNFT(props: AmountNFT) {
  const { sendNumber, setSendNumber } = props;
  const { t } = useLanguage();

  return (
    <View style={styles.wrap}>
      <TextM style={styles.title}>Amount</TextM>
      <View style={styles.iptWrap}>
        <TextInput
          style={[styles.inputStyle, sendNumber === '0' && FontStyles.font7]}
          keyboardType="numeric"
          maxLength={18}
          value={sendNumber}
          onChangeText={(v: string) => setSendNumber(v.replace(/^(0+)|[^\d]+/g, ''))}
        />
      </View>
    </View>
  );
}

export const styles = StyleSheet.create({
  wrap: {
    paddingTop: pTd(12),
    paddingBottom: pTd(16),
    display: 'flex',
    justifyContent: 'space-around',
  },
  title: {
    width: '100%',
    textAlign: 'center',
    color: defaultColors.font3,
  },
  bottom: {
    marginTop: pTd(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  bottomLeft: {
    minWidth: pTd(114),
    height: pTd(40),
    backgroundColor: defaultColors.bg4,
    borderRadius: pTd(6),
    ...GStyles.paddingArg(6, 10),
    flexDirection: 'row',
    alignItems: 'center',
  },
  symbolName: {
    flex: 1,
    textAlign: 'center',
  },
  bottomRight: {
    flexDirection: 'row',
    position: 'relative',
    borderBottomColor: defaultColors.border6,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  containerStyle: {
    width: '100%',
    minWidth: pTd(143),
    maxWidth: pTd(183),
    height: pTd(40),
    overflow: 'hidden',
  },
  iptWrap: {
    width: '100%',
    marginTop: pTd(21),
  },
  inputStyle: {
    // paddingTop: 0,
    // paddingBottom: 0,
    width: pTd(221),
    minHeight: pTd(38),
    borderBottomColor: defaultColors.bg7,
    borderBottomWidth: StyleSheet.hairlineWidth,
    textAlign: 'center',
    // backgroundColor: 'green',
    // lineHeight: pTd(28),
    // paddingRight: pTd(80),
    color: defaultColors.font5,
    fontSize: pTd(24),
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  usdtNumSent: {
    position: 'absolute',
    right: 0,
    bottom: pTd(5),
    borderBottomColor: defaultColors.border6,
    color: defaultColors.font3,
  },
});
