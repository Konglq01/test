import React, { useMemo } from 'react';
import PageContainer from 'components/PageContainer';
import { Text, View, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import { getExploreLink } from '@portkey-wallet/utils';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import CommonButton from 'components/CommonButton';
import { TextM, TextS } from 'components/CommonText';
import fonts from 'assets/theme/fonts';
import navigationService from 'utils/navigationService';
import { formatStr2EllipsisStr, formatTransferTime } from 'utils';
import { useCurrentNetwork } from '@portkey-wallet/hooks/network';
import { useWallet } from 'hooks/store';
import { useLanguage } from 'i18n/hooks';

interface TransferDetailProps {
  route?: any;
  transfer?: string;
}

const TransferDetail: React.FC<TransferDetailProps> = ({ route, transfer }) => {
  const { t } = useLanguage();
  const { params } = route;
  const { transferInfo } = params;
  const { blockExplorerURL } = useCurrentNetwork();
  const { currentAccount } = useWallet();

  console.log('transferInfo........', transferInfo, transfer);

  const totalToken = useMemo(() => {
    return Number(transferInfo.amount) + Number(transferInfo.fee);
  }, []);

  const title = useMemo(() => {
    let result;
    switch (transferInfo.category) {
      case 'send':
        result = 'Sent';
        break;
      case 'receive':
        result = 'Received';
        break;
      default:
        result = transferInfo.category;
        break;
    }
    return result;
  }, [transferInfo.category]);

  return (
    <PageContainer
      titleDom={<Text />}
      leftDom={<Text />}
      rightDom={
        <TouchableOpacity onPress={() => navigationService.goBack()}>
          <Svg icon="close" size={pTd(14)} />
        </TouchableOpacity>
      }
      containerStyles={styles.containerStyle}
      scrollViewProps={{ disabled: true }}>
      {transferInfo.category === 'send' && <Svg icon="transfer-send" size={pTd(58)} iconStyle={styles.typeIcon} />}
      {transferInfo.category === 'receive' && (
        <Svg icon="transfer-receive" size={pTd(58)} iconStyle={styles.typeIcon} />
      )}

      {/* TODO: names */}
      <Text style={styles.typeTitle}>{t(title)}</Text>

      <View style={[styles.flexSpaceBetween, styles.titles1]}>
        <TextM style={styles.lightGrayFontColor}>{t('Status')}</TextM>
        <TextM style={styles.blackFontColor}>{t('Date')}</TextM>
      </View>

      <View style={[styles.flexSpaceBetween, styles.values1]}>
        <TextM style={styles.greenFontColor}>{t('Success')}</TextM>
        <TextM style={styles.blackFontColor}>{formatTransferTime(transferInfo.time * 1000 || '')}</TextM>
      </View>
      <Text style={styles.divider} />

      <View style={[styles.flexSpaceBetween, styles.titles2]}>
        <TextM style={styles.lightGrayFontColor}>{t('From')}</TextM>
        <TextM style={styles.lightGrayFontColor}>{t('To')}</TextM>
      </View>

      <View style={[styles.flexSpaceBetween, styles.values2]}>
        <TextM style={styles.blackFontColor}>{formatStr2EllipsisStr(transferInfo.from, 5)}</TextM>
        <TextM style={styles.blackFontColor}>{formatStr2EllipsisStr(transferInfo.to, 5)}</TextM>
      </View>

      <View style={styles.card}>
        <View style={styles.cardTop}>
          <View style={[styles.flexSpaceBetween]}>
            <TextM style={styles.lightGrayFontColor}>{t('Amount')}</TextM>
            <TextM style={styles.blackFontColor}>{`${transferInfo.amount} ${transferInfo.symbol}`}</TextM>
          </View>
          <View style={[styles.flexSpaceBetween, styles.marginTop16]}>
            <TextM style={styles.lightGrayFontColor}>{t('Transaction Fee')}</TextM>
            <TextM style={styles.blackFontColor}>{`${transferInfo.fee} ${transferInfo.feeSymbol}`}</TextM>
          </View>
        </View>
        <Text style={[styles.divider, styles.marginTop0]} />
        <View style={styles.cardBottom}>
          <View style={[styles.flexSpaceBetween]}>
            <TextM style={[styles.blackFontColor, styles.fontBold]}>{t('Total')}</TextM>
            <TextM style={[styles.blackFontColor, styles.fontBold]}>{`${totalToken} ${transferInfo.symbol} `}</TextM>
          </View>
          <View style={[styles.flexSpaceBetween, styles.marginTop4]}>
            <Text />
            <TextS style={styles.lightGrayFontColor}>{`$${totalToken} USD`}</TextS>
          </View>
        </View>
      </View>

      <View style={styles.space} />

      {blockExplorerURL ? (
        <CommonButton
          onPress={() => Linking.openURL(getExploreLink(blockExplorerURL, currentAccount?.address || ''))}
          // containerStyle={GStyles.marginTop(8)}
          title={t('View on Explorer')}
          type="clear"
          style={styles.button}
        />
      ) : null}
    </PageContainer>
  );
};

export default TransferDetail;

export const styles = StyleSheet.create({
  containerStyle: {
    paddingLeft: pTd(32),
    paddingRight: pTd(32),
    display: 'flex',
    alignItems: 'center',
  },
  typeIcon: {
    marginTop: pTd(32),
  },
  typeTitle: {
    marginTop: pTd(24),
    color: defaultColors.font5,
    fontSize: pTd(20),
    lineHeight: pTd(24),
  },
  flexSpaceBetween: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: pTd(20),
    width: '100%',
  },
  titles1: {
    marginTop: pTd(56),
  },
  values1: {
    marginTop: pTd(4),
  },
  divider: {
    marginTop: pTd(24),
    width: pTd(311),
    height: pTd(0.5),
    backgroundColor: defaultColors.border6,
  },
  titles2: {
    marginTop: pTd(25),
  },
  values2: {
    marginTop: pTd(4),
  },
  card: {
    marginTop: pTd(32),
    borderRadius: pTd(6),
    borderWidth: pTd(0.5),
    borderColor: defaultColors.border1,
    height: pTd(161),
    width: pTd(311),
  },
  cardTop: {
    ...GStyles.paddingArg(16),
    overflow: 'hidden',
    height: pTd(88),
  },
  cardBottom: {
    ...GStyles.paddingArg(16),
  },
  marginTop16: {
    marginTop: pTd(16),
  },
  marginTop4: {
    marginTop: pTd(4),
  },
  marginTop0: {
    marginTop: 0,
  },
  space: {
    flex: 1,
  },
  button: {
    marginBottom: pTd(30),
  },
  lightGrayFontColor: {
    color: defaultColors.font3,
  },
  blackFontColor: {
    color: defaultColors.font5,
  },
  fontBold: {
    ...fonts.mediumFont,
  },
  greenFontColor: {
    color: defaultColors.font10,
  },
});
