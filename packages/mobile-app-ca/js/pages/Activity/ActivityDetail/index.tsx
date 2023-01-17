import React, { useMemo } from 'react';
import PageContainer from 'components/PageContainer';
import { Text, View, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import { getExploreLink } from '@portkey/utils';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import CommonButton from 'components/CommonButton';
import { TextL, TextM, TextS } from 'components/CommonText';
import fonts from 'assets/theme/fonts';
import navigationService from 'utils/navigationService';
import { formatStr2EllipsisStr, formatTransferTime } from 'utils';
import { useCurrentNetwork } from '@portkey/hooks/network';
import { useWallet } from 'hooks/store';
import { useLanguage } from 'i18n/hooks';
import CommonToast from 'components/CommonToast';
import * as Clipboard from 'expo-clipboard';
import { Image } from '@rneui/base';

interface ActivityDetailProps {
  route?: any;
  transfer?: string;
}

const type = 'nft';
const mockUrl =
  'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/fotojet-5-1650369753.jpg?crop=0.498xw:0.997xh;0,0&resize=640:*';

const ActivityDetail: React.FC<ActivityDetailProps> = ({ route, transfer }) => {
  const { walletName } = useWallet();
  const { t } = useLanguage();
  const { params } = route;
  // const { transferInfo } = params;
  const transferInfo = {
    category: 'send',
    title: 'test',
  };

  const { blockExplorerURL } = useCurrentNetwork();

  console.log('transferInfo........', transferInfo, transfer);

  // const title = useMemo(() => {}, [transferInfo.category]);

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
      {/* TODO: names */}
      <Text style={styles.typeTitle}>{t('Transfer')}</Text>

      <Text style={styles.tokenCount}>-12.2 READ</Text>
      <Text style={styles.usdtCount}>$ 0.11</Text>

      {type !== 'nft' && (
        <View style={styles.topWrap}>
          {/* <Text style={styles.noImg}>A</Text> */}
          <Image style={styles.img} source={{ uri: mockUrl }} />
          <View style={styles.topLeft}>
            <TextL style={styles.nftTitle}>BoxcatPlanet #2271</TextL>
            <TextS>Amount：3</TextS>
          </View>
        </View>
      )}

      {type !== 'nft' && <View style={styles.divider} />}

      <View style={[styles.flexSpaceBetween, styles.titles1]}>
        <TextM style={styles.lightGrayFontColor}>{t('Status')}</TextM>
        <TextM style={styles.lightGrayFontColor}>{t('Date')}</TextM>
      </View>

      <View style={[styles.flexSpaceBetween, styles.values1]}>
        <TextM style={styles.greenFontColor}>{t('Success')}</TextM>
        <TextM style={styles.blackFontColor}>{formatTransferTime(Date.now() || '')}</TextM>
      </View>

      <View style={styles.card}>
        {/* From */}
        <View style={styles.section}>
          <View style={[styles.flexSpaceBetween]}>
            <TextM style={styles.lightGrayFontColor}>{t('From')}</TextM>
            <TextM style={styles.blackFontColor}>{walletName}</TextM>
          </View>
          <View style={[styles.flexSpaceBetween]}>
            <TextM style={styles.lightGrayFontColor} />
            <TextM style={styles.lightGrayFontColor}>
              {formatStr2EllipsisStr('ELF_xsasadsadsaddasd_xasxasdsadsad_AELF')}
            </TextM>
          </View>
        </View>
        <Text style={[styles.divider, styles.marginTop0]} />
        {/* To */}
        <View style={styles.section}>
          <View style={[styles.flexSpaceBetween]}>
            <TextM style={[styles.lightGrayFontColor]}>{t('To')}</TextM>
            <TextM style={[styles.blackFontColor, styles.fontBold]}>{`Sally`}</TextM>
          </View>
          <View style={[styles.flexSpaceBetween]}>
            <Text />
            <TextS style={styles.lightGrayFontColor}>
              {formatStr2EllipsisStr('ELF_xsasadsadsaddasd_xasxasdsadsad_AELF')}
            </TextS>
          </View>
        </View>
        <Text style={[styles.divider, styles.marginTop0]} />
        {/* more Info */}
        <View style={styles.section}>
          <View style={[styles.flexSpaceBetween]}>
            <TextM style={[styles.lightGrayFontColor]}>{t('Network')}</TextM>
            <TextM style={[styles.blackFontColor]}>{`${'MainChain AELF'} → ${'MainChain AELF'} `}</TextM>
          </View>
          <View style={[styles.flexSpaceBetween, styles.marginTop16]}>
            <TextM style={[styles.lightGrayFontColor]}>{t('Transaction ID')}</TextM>
            <View style={[GStyles.flexRow, styles.alignItemsCenter]}>
              <TextM style={{}}>{formatStr2EllipsisStr('xsadxxxxxx', 10, 'tail')}</TextM>
              <TouchableOpacity
                style={styles.marginLeft8}
                onPress={async () => {
                  const isCopy = await Clipboard.setStringAsync('xxxxx');
                  isCopy && CommonToast.success(t('Copy Success'));
                }}>
                <Svg icon="copy" size={pTd(13)} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <Text style={[styles.divider, styles.marginTop0]} />
        {/* transaction Fee */}
        <View style={styles.section}>
          <View style={[styles.flexSpaceBetween]}>
            <TextM style={[styles.blackFontColor, styles.fontBold]}>{t('Transaction Fee')}</TextM>
            <TextM style={[styles.blackFontColor, styles.fontBold]}>{`${'0.0001'} ${'ELF'} `}</TextM>
          </View>
          <View style={[styles.flexSpaceBetween, styles.marginTop4]}>
            <Text />
            <TextS style={styles.lightGrayFontColor}>{`$ ${'0.11'}`}</TextS>
          </View>
        </View>
      </View>

      <View style={styles.space} />

      {blockExplorerURL ? (
        <CommonButton
          // onPress={() => Linking.openURL(getExploreLink(blockExplorerURL, currentAccount?.address || ''))}
          containerStyle={[GStyles.marginTop(pTd(8)), styles.bottomButton]}
          onPress={() =>
            navigationService.navigate('ViewOnWebView', {
              url: getExploreLink(blockExplorerURL, 'currentAccount?.address' || ''),
            })
          }
          title={t('View on Explorer')}
          type="clear"
          style={styles.button}
          buttonStyle={styles.bottomButton}
        />
      ) : null}
    </PageContainer>
  );
};

export default ActivityDetail;

export const styles = StyleSheet.create({
  containerStyle: {
    paddingLeft: pTd(20),
    paddingRight: pTd(20),
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
    ...GStyles.flexRow,
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
  nftTitle: {
    color: defaultColors.font5,
    marginBottom: pTd(4),
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
    marginTop: pTd(24),
  },
  values1: {
    marginTop: pTd(4),
  },
  divider: {
    marginTop: pTd(24),
    width: '100%',
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
    marginTop: pTd(24),
    borderRadius: pTd(6),
    borderWidth: pTd(0.5),
    borderColor: defaultColors.border1,
    width: '100%',
  },
  section: {
    ...GStyles.paddingArg(16, 12),
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
  bottomButton: {
    backgroundColor: defaultColors.bg1,
  },
});
