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

export interface TokenDetailProps {
  route?: any;
}

const NFTDetail: React.FC<TokenDetailProps> = props => {
  const { t } = useLanguage();
  const { route } = props;

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
      <TextXXXL style={styles.title}>
        {'AoxcatPlanet'} {'#2271'}
      </TextXXXL>
      <TextL style={[FontStyles.font3]}>{'Amount 3'}</TextL>

      <Text style={styles.image}>A</Text>
      {/* <Image
        source={{
          uri: 'https://source.unsplash.com/random?sig=1',
        }}
        style={styles.image}
      /> */}
      <CommonButton style={{}} type="primary" onPress={() => navigationService.navigate('SendHome', { type: 'nft' })}>
        Send
      </CommonButton>
      <TextXL style={styles.symbolDescribeTitle}>Symbol Content</TextXL>
      <TextXL style={[styles.symbolContent, FontStyles.font3]}>
        Symbol Symbol Content Symbol Content Symbol Content Symbol Content Symbol Content Symbol Content Symbol Content
        Symbol Content askdhaksfhahdalhdlah
      </TextXL>
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
    overflow: 'hidden',
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
  symbolDescribeTitle: {
    marginTop: pTd(32),
    ...fonts.mediumFont,
  },
  symbolContent: {
    marginTop: pTd(4),
  },
});
