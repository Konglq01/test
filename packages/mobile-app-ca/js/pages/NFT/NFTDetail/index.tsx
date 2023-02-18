import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Image } from '@rneui/base';
import PageContainer from 'components/PageContainer';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from 'i18n/hooks';
import CommonButton from 'components/CommonButton';
import GStyles from 'assets/theme/GStyles';
import { pTd } from 'utils/unit';
import { defaultColors } from 'assets/theme';
import { TextL, TextXL, TextXXXL } from 'components/CommonText';
import { FontStyles } from 'assets/theme/styles';
import fonts from 'assets/theme/fonts';
import navigationService from 'utils/navigationService';
import useRouterParams from '@portkey/hooks/useRouterParams';

export interface TokenDetailProps {
  route?: any;
}

interface NftItemType {
  alias: string;
  balance: string;
  chainId: string;
  imageUrl: string;
  symbol: string;
  tokenContractAddress: string;
  tokenId: string;
}

const NFTDetail: React.FC<TokenDetailProps> = props => {
  const { t } = useLanguage();

  const nftItem = useRouterParams<NftItemType>();

  const { alias, balance, chainId, imageUrl, symbol, tokenContractAddress, tokenId } = nftItem;

  const navigation = useNavigation();

  return (
    <PageContainer
      type="leftBack"
      backTitle={t('Back')}
      titleDom={''}
      safeAreaColor={['white', 'white']}
      leftCallback={() => navigation.goBack()}
      containerStyles={styles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <TextXXXL style={styles.title}>{`${alias} #${tokenId}`}</TextXXXL>
      <TextL style={[FontStyles.font3]}>{`Amount ${balance}`}</TextL>

      {!imageUrl ? (
        <Text style={styles.image}>{alias[0]}</Text>
      ) : (
        <Image
          source={{
            uri: imageUrl,
          }}
          style={styles.image1}
        />
      )}

      <CommonButton
        style={{}}
        type="primary"
        onPress={() => {
          navigationService.navigate('SendHome', { sendType: 'nft', nftItem: nftItem });
        }}>
        Send
      </CommonButton>
      <TextXL style={styles.symbolDescribeTitle}>{symbol}</TextXL>
      <TextXL style={[styles.symbolContent, FontStyles.font3]} />
    </PageContainer>
  );
};

export default NFTDetail;

export const styles = StyleSheet.create({
  pageWrap: {
    backgroundColor: defaultColors.bg1,
    ...GStyles.paddingArg(20),
  },
  title: {
    ...fonts.mediumFont,
  },
  amount: {
    marginTop: pTd(8),
  },
  image: {
    marginTop: pTd(16),
    marginBottom: pTd(16),
    width: pTd(335),
    height: pTd(335),
    borderRadius: pTd(8),
    lineHeight: pTd(335),
    textAlign: 'center',
    fontSize: pTd(100),
    backgroundColor: defaultColors.bg7,
    color: defaultColors.font7,
  },
  image1: {
    marginTop: pTd(16),
    marginBottom: pTd(16),
    width: pTd(335),
    height: pTd(335),
    borderRadius: pTd(8),
    lineHeight: pTd(335),
    textAlign: 'center',
    fontSize: pTd(100),
  },
  symbolDescribeTitle: {
    marginTop: pTd(32),
    ...fonts.mediumFont,
  },
  symbolContent: {
    marginTop: pTd(4),
  },
});
