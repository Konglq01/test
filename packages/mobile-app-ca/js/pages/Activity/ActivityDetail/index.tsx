import {
  DEFAULT_DECIMAL,
  TransactionTypes,
  transactionTypesMap,
} from '@portkey-wallet/constants/constants-ca/activity';
import { ZERO } from '@portkey-wallet/constants/misc';
import { useCurrentChain } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useCaAddresses, useCurrentWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { fetchActivity } from '@portkey-wallet/store/store-ca/activity/api';
import { ActivityItemType, TransactionStatus } from '@portkey-wallet/types/types-ca/activity';
import { getExploreLink } from '@portkey-wallet/utils';
import { unitConverter } from '@portkey-wallet/utils/converter';
import { Image } from '@rneui/base';
import { defaultColors } from 'assets/theme';
import fonts from 'assets/theme/fonts';
import GStyles from 'assets/theme/GStyles';
import { FontStyles } from 'assets/theme/styles';
import CommonButton from 'components/CommonButton';
import { TextL, TextM, TextS } from 'components/CommonText';
import CommonToast from 'components/CommonToast';
import PageContainer from 'components/PageContainer';
import Svg from 'components/Svg';
import * as Clipboard from 'expo-clipboard';
import useEffectOnce from 'hooks/useEffectOnce';
import { useLanguage } from 'i18n/hooks';
import React, { useMemo, useState } from 'react';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { formatStr2EllipsisStr, formatTransferTime } from 'utils';
import navigationService from 'utils/navigationService';
import { pTd } from 'utils/unit';

interface RouterParams {
  transactionId?: string;
  blockHash?: string;
  isReceived?: boolean;
}

const hiddenArr = [TransactionTypes.SOCIAL_RECOVERY, TransactionTypes.ADD_MANAGER, TransactionTypes.REMOVE_MANAGER];

const ActivityDetail = () => {
  const { t } = useLanguage();
  const { transactionId = '', blockHash = '', isReceived: isReceivedParams } = useRouterParams<RouterParams>();
  const caAddresses = useCaAddresses();
  const { currentNetwork } = useCurrentWallet();

  const isTestNet = useMemo(() => (currentNetwork === 'TESTNET' ? 'TESTNET' : ''), [currentNetwork]);

  const [activityItem, setActivityItem] = useState<ActivityItemType>();

  const { explorerUrl } = useCurrentChain(activityItem?.fromChainId) as { explorerUrl: string };

  useEffectOnce(() => {
    const params = {
      caAddresses,
      transactionId,
      blockHash,
    };
    fetchActivity(params)
      .then(res => {
        if (isReceivedParams !== undefined) {
          res.isReceived = isReceivedParams;
        }
        setActivityItem(res);
      })
      .catch(error => {
        throw Error(JSON.stringify(error));
      });
  });

  const isNft = useMemo(() => !!activityItem?.nftInfo?.nftId, [activityItem?.nftInfo?.nftId]);
  const status = useMemo(() => {
    if (!activityItem?.status) return { text: '', style: 'confirmed' };

    if (activityItem?.status === TransactionStatus.Mined)
      return {
        text: 'Confirmed',
        style: 'confirmed',
      };
    return {
      text: 'Failed',
      style: 'failed',
    };
  }, [activityItem]);

  const networkUI = useMemo(() => {
    const { transactionType, fromChainId, toChainId, transactionId: _transactionId = '' } = activityItem || {};
    const from = fromChainId === 'AELF' ? 'MainChain AELF' : `SideChain ${fromChainId}`;
    const to = toChainId === 'AELF' ? 'MainChain AELF' : `SideChain ${toChainId}`;

    const isNetworkShow = transactionType && !hiddenArr.includes(transactionType);
    return (
      <>
        <View style={styles.section}>
          {isNetworkShow && (
            <View style={[styles.flexSpaceBetween]}>
              <TextM style={[styles.lightGrayFontColor]}>{t('Network')}</TextM>
              <View style={styles.networkInfoContent}>
                <TextM style={[styles.blackFontColor]}>{`${from} ${isTestNet}`}</TextM>
                <View style={GStyles.flexRow}>
                  <TextM style={[styles.lightGrayFontColor]}>{` → `}</TextM>
                  <TextM style={[styles.blackFontColor]}>{`${to} ${isTestNet}`}</TextM>
                </View>
              </View>
            </View>
          )}
          <View style={[styles.flexSpaceBetween, isNetworkShow && styles.marginTop16]}>
            <TextM style={[styles.lightGrayFontColor]}>{t('Transaction ID')}</TextM>
            <View style={[GStyles.flexRow, styles.alignItemsCenter]}>
              <TextM style={{}}>{formatStr2EllipsisStr(_transactionId, 10, 'tail')}</TextM>
              <TouchableOpacity
                style={styles.marginLeft8}
                onPress={async () => {
                  const isCopy = await Clipboard.setStringAsync(_transactionId);
                  isCopy && CommonToast.success(t('Copy Success'));
                }}>
                <Svg icon="copy" size={pTd(13)} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <Text style={[styles.divider, styles.marginTop0]} />
      </>
    );
  }, [activityItem, isTestNet, t]);

  const feeUI = useMemo(() => {
    const transactionFees = activityItem?.transactionFees || [];
    return (
      <View style={styles.section}>
        <View style={[styles.flexSpaceBetween]}>
          <TextM style={[styles.blackFontColor, styles.fontBold]}>{t('Transaction Fee')}</TextM>
          <View>
            {transactionFees.map((item, index) => (
              <View key={index} style={[styles.transactionFeeItemWrap, index > 0 && styles.marginTop8]}>
                <TextM style={[styles.blackFontColor, styles.fontBold]}>{`${unitConverter(
                  ZERO.plus(item.fee || 0).div(`1e${DEFAULT_DECIMAL}`),
                )} ${item.symbol}`}</TextM>
                {!isTestNet && (
                  <TextS style={[styles.lightGrayFontColor, styles.marginTop4]}>{`$ ${unitConverter(
                    ZERO.plus(item?.feeInUsd ?? 0).div(`1e${DEFAULT_DECIMAL}`),
                    2,
                  )}`}</TextS>
                )}
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  }, [activityItem?.transactionFees, isTestNet, t]);

  return (
    <PageContainer
      hideHeader
      safeAreaColor={['white']}
      containerStyles={styles.containerStyle}
      scrollViewProps={{ disabled: true }}>
      <StatusBar barStyle={'dark-content'} />
      <TouchableOpacity style={styles.closeWrap} onPress={() => navigationService.goBack()}>
        <Svg icon="close" size={pTd(16)} />
      </TouchableOpacity>
      <Text style={[styles.typeTitle]}>
        {transactionTypesMap(activityItem?.transactionType, activityItem?.nftInfo?.nftId)}
      </Text>

      {isNft ? (
        <>
          <View style={styles.topWrap}>
            {activityItem?.nftInfo?.imageUrl ? (
              <Image style={styles.img} source={{ uri: activityItem?.nftInfo?.imageUrl || '' }} />
            ) : (
              <Text style={styles.noImg}>{activityItem?.nftInfo?.alias?.slice(0, 1)}</Text>
            )}
            <View style={styles.nftInfo}>
              <TextL style={styles.nftTitle}>{`${activityItem?.nftInfo?.alias || ''} #${
                activityItem?.nftInfo?.nftId || ''
              }`}</TextL>
              <TextS style={[FontStyles.font3, styles.marginTop4]}>Amount: {activityItem?.amount || ''}</TextS>
            </View>
          </View>
          <View style={styles.divider} />
        </>
      ) : (
        <>
          <Text style={[styles.tokenCount, styles.fontBold]}>
            {!hiddenArr.includes(activityItem?.transactionType as TransactionTypes) &&
              (activityItem?.isReceived ? '+' : '-')}
            {`${unitConverter(
              ZERO.plus(activityItem?.amount || 0).div(`1e${activityItem?.decimals || DEFAULT_DECIMAL}`),
            )} ${activityItem?.symbol || ''}`}
          </Text>
          {!isTestNet && (
            <Text style={styles.usdtCount}>{`$ ${unitConverter(ZERO.plus(activityItem?.priceInUsd ?? 0), 2)}`}</Text>
          )}
        </>
      )}

      <View style={[styles.flexSpaceBetween, styles.titles1]}>
        <TextM style={styles.lightGrayFontColor}>{t('Status')}</TextM>
        <TextM style={styles.lightGrayFontColor}>{t('Date')}</TextM>
      </View>

      <View style={[styles.flexSpaceBetween, styles.values1]}>
        <TextM style={styles.greenFontColor}>{t(status.text)}</TextM>
        <TextM style={styles.blackFontColor}>
          {activityItem && activityItem.timestamp ? formatTransferTime(Number(activityItem?.timestamp) * 1000) : ''}
        </TextM>
      </View>

      <View style={styles.card}>
        {/* From */}
        <View style={styles.section}>
          <View style={[styles.flexSpaceBetween]}>
            <TextM style={styles.lightGrayFontColor}>{t('From')}</TextM>
            <View style={styles.alignItemsEnd}>
              {activityItem?.from && <TextM style={styles.blackFontColor}>{activityItem.from}</TextM>}
              <TextS style={styles.lightGrayFontColor}>{formatStr2EllipsisStr(activityItem?.fromAddress)}</TextS>
            </View>
          </View>
        </View>
        <Text style={[styles.divider, styles.marginTop0]} />
        {/* To */}
        <View style={styles.section}>
          <View style={[styles.flexSpaceBetween]}>
            <TextM style={[styles.lightGrayFontColor]}>{t('To')}</TextM>
            <View style={styles.alignItemsEnd}>
              {activityItem?.to && <TextM style={[styles.blackFontColor]}>{activityItem.to}</TextM>}
              <TextS style={styles.lightGrayFontColor}>{formatStr2EllipsisStr(activityItem?.toAddress)}</TextS>
            </View>
          </View>
        </View>
        <Text style={[styles.divider, styles.marginTop0]} />
        {/* more Info */}

        {networkUI}
        {/* transaction Fee */}
        {feeUI}
      </View>

      <View style={styles.space} />

      {explorerUrl && (
        <CommonButton
          containerStyle={[GStyles.marginTop(pTd(8)), styles.bottomButton]}
          onPress={() => {
            if (!explorerUrl) return;
            if (!activityItem?.transactionId) return;

            navigationService.navigate('ViewOnWebView', {
              url: getExploreLink(explorerUrl, activityItem?.transactionId || '', 'transaction'),
            });
          }}
          title={t('View on Explorer')}
          type="clear"
          style={styles.button}
          buttonStyle={styles.bottomButton}
        />
      )}
    </PageContainer>
  );
};

export default ActivityDetail;

export const styles = StyleSheet.create({
  containerStyle: {
    paddingLeft: pTd(20),
    paddingRight: pTd(20),
    paddingTop: pTd(16),
    display: 'flex',
    alignItems: 'center',
  },
  closeWrap: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  typeIcon: {
    marginTop: pTd(32),
  },
  typeTitle: {
    marginTop: pTd(5),
    color: defaultColors.font5,
    fontSize: pTd(20),
    lineHeight: pTd(24),
  },
  tokenCount: {
    marginTop: pTd(40),
    fontSize: pTd(28),
    ...fonts.mediumFont,
    color: defaultColors.font5,
  },
  usdtCount: {
    marginTop: pTd(4),
    fontSize: pTd(14),
  },
  topWrap: {
    width: '100%',
    marginTop: pTd(40),
    display: 'flex',
    flexDirection: 'row',
    minWidth: '100%',
  },
  img: {
    width: pTd(64),
    height: pTd(64),
    borderRadius: pTd(6),
    marginRight: pTd(16),
  },
  noImg: {
    overflow: 'hidden',
    width: pTd(64),
    height: pTd(64),
    borderRadius: pTd(6),
    backgroundColor: defaultColors.bg7,
    fontSize: pTd(54),
    lineHeight: pTd(64),
    textAlign: 'center',
    color: defaultColors.font7,
    marginRight: pTd(16),
  },
  topLeft: {
    ...GStyles.flexCol,
    justifyContent: 'center',
  },
  nftInfo: {
    display: 'flex',
    justifyContent: 'center',
  },
  nftTitle: {
    ...fonts.mediumFont,
    color: defaultColors.font5,
    marginBottom: pTd(4),
    flexDirection: 'row',
    display: 'flex',
    flexWrap: 'wrap',
  },
  flexSpaceBetween: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: pTd(20),
    width: '100%',
  },
  titles1: {
    marginTop: pTd(24),
  },
  values1: {
    marginTop: pTd(4),
  },
  divider: {
    marginTop: pTd(24),
    width: '100%',
    height: StyleSheet.hairlineWidth,
    backgroundColor: defaultColors.border1,
  },
  titles2: {
    marginTop: pTd(25),
  },
  values2: {
    marginTop: pTd(4),
  },
  card: {
    marginTop: pTd(24),
    borderRadius: pTd(6),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: defaultColors.border1,
    width: '100%',
  },
  section: {
    ...GStyles.paddingArg(16, 12),
  },
  marginTop16: {
    marginTop: pTd(16),
  },
  marginTop8: {
    marginTop: pTd(8),
  },
  marginTop4: {
    marginTop: pTd(4),
  },
  marginTop0: {
    marginTop: 0,
  },
  marginLeft8: {
    marginLeft: pTd(8),
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
  alignItemsCenter: {
    alignItems: 'center',
  },
  alignItemsEnd: {
    alignItems: 'flex-end',
  },
  bottomButton: {
    backgroundColor: defaultColors.bg1,
  },
  networkInfoContent: {
    flexDirection: 'row',
    flexShrink: 1,
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    marginLeft: pTd(20),
  },
  transactionFeeItemWrap: {
    alignItems: 'flex-end',
  },
});
