import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { pTd } from 'utils/unit';
import { parseInputChange } from '@portkey-wallet/utils/input';
import { ZERO } from '@portkey-wallet/constants/misc';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { Input } from '@rneui/themed';
import { unitConverter } from '@portkey-wallet/utils/converter';
import { useLanguage } from 'i18n/hooks';
import CommonAvatar from 'components/CommonAvatar';
import { IToSendAssetParamsType } from '@portkey-wallet/types/types-ca/routeParams';
import { useSymbolImages } from '@portkey-wallet/hooks/hooks-ca/useToken';
import { ELF_SYMBOL } from '@portkey-wallet/constants/constants-ca/assets';

interface AmountTokenProps {
  balanceShow: number | string;
  sendTokenNumber: string;
  setSendTokenNumber: any;
  selectedAccount: any;
  selectedToken: IToSendAssetParamsType;
  setSelectedToken: any;
}

export default function AmountToken({
  balanceShow,
  sendTokenNumber,
  setSendTokenNumber,
  selectedToken,
}: AmountTokenProps) {
  const { t } = useLanguage();

  const symbolImages = useSymbolImages();

  const formatTokenNameToSuffix = (str: string) => {
    return `${str.slice(0, 5)}...`;
  };

  return (
    <View style={styles.amountWrap}>
      <View style={styles.top}>
        <Text style={styles.topTitle}>{t('Amount')}</Text>
        <Text style={styles.topBalance}>{`${t('Balance')} ${unitConverter(
          ZERO.plus(balanceShow).div(`1e${selectedToken?.decimals}`),
        )} ${selectedToken?.symbol ?? '0'}`}</Text>
      </View>
      <View style={styles.bottom}>
        <View style={styles.bottomLeft}>
          {/* <Svg icon="aelf-avatar" size={pTd(28)} /> */}
          {/* {symbolImages[selectedToken?.symbol] ? (
            <CommonAvatar
              shapeType="circular"
              imageUrl={symbolImages[selectedToken.symbol] || ''}
              avatarSize={28}
              title={''}
            />
          ) : (
            <Text style={styles.imgStyle}>{selectedToken?.symbol?.[0]}</Text>
          )} */}

          {selectedToken.symbol === ELF_SYMBOL ? (
            <CommonAvatar
              shapeType="circular"
              svgName={selectedToken.symbol === ELF_SYMBOL ? 'elf-icon' : undefined}
              imageUrl={symbolImages[selectedToken.symbol] || ''}
              avatarSize={28}
            />
          ) : (
            <Text style={styles.imgStyle}>{selectedToken?.symbol?.[0]}</Text>
          )}
          <Text style={styles.symbolName}>
            {selectedToken?.symbol?.length > 5 ? formatTokenNameToSuffix(selectedToken?.symbol) : selectedToken?.symbol}
          </Text>
        </View>
        <View style={styles.bottomRight}>
          <Input
            onFocus={() => {
              if (sendTokenNumber === '0') setSendTokenNumber('');
            }}
            keyboardType="numeric"
            value={sendTokenNumber}
            maxLength={18}
            containerStyle={styles.containerStyle}
            inputContainerStyle={styles.inputContainerStyle}
            inputStyle={styles.inputStyle}
            onChangeText={v => {
              const newAmount = parseInputChange(v.trim(), ZERO, 4);
              setSendTokenNumber(newAmount);
            }}
          />
          {/* {selectedToken.symbol === 'ELF' && (
            <TextS style={styles.usdtNumSent}>
              ${' '}
              {sendTokenNumber === ' '
                ? '0.00'
                : unitConverter(ZERO.plus(sendTokenNumber ? sendTokenNumber : '0').times(rate.USDT), 2)}
            </TextS>
          )} */}
        </View>
      </View>
    </View>
  );
}

export const styles = StyleSheet.create({
  amountWrap: {
    paddingTop: pTd(12),
    paddingBottom: pTd(16),
    display: 'flex',
    justifyContent: 'space-around',
  },
  top: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topTitle: {
    color: defaultColors.font3,
    fontSize: pTd(14),
  },
  topBalance: {
    color: defaultColors.font3,
    fontSize: pTd(12),
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
  imgStyle: {
    width: pTd(28),
    height: pTd(28),
    lineHeight: pTd(28),
    borderColor: defaultColors.border1,
    borderWidth: pTd(1),
    borderRadius: pTd(14),
    textAlign: 'center',
  },
  symbolName: {
    flex: 1,
    textAlign: 'center',
    color: defaultColors.font5,
  },
  bottomRight: {
    flexDirection: 'row',
    position: 'relative',
    borderBottomColor: defaultColors.border6,
    borderBottomWidth: pTd(0.5),
  },
  containerStyle: {
    width: '100%',
    minWidth: pTd(143),
    maxWidth: pTd(183),
    height: pTd(40),
    overflow: 'hidden',
  },
  inputContainerStyle: {
    // backgroundColor: 're123456
    borderColor: 'white', // how to delete bottom border?a
  },
  inputStyle: {
    paddingTop: 0,
    paddingBottom: 0,
    minHeight: pTd(40),
    borderColor: defaultColors.bg1,
    // backgroundColor: 'green',
    lineHeight: pTd(28),
    paddingRight: pTd(80),
    color: defaultColors.font5,
    fontSize: pTd(24),
  },
  usdtNumSent: {
    position: 'absolute',
    right: 0,
    bottom: pTd(5),
    borderBottomColor: defaultColors.border6,
    color: defaultColors.font3,
  },
});
