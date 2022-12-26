import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import navigationService from 'utils/navigationService';
import Svg from 'components/Svg';
import PageContainer from 'components/PageContainer';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import { useLanguage } from 'i18n/hooks';
import WebView from 'react-native-webview';

interface ViewOnWebViewPropsType {
  route?: any;
}

const ViewOnWebView: React.FC<ViewOnWebViewPropsType> = ({ route }) => {
  const { t } = useLanguage();
  const { params } = route;

  return (
    <PageContainer
      titleDom={'aelf'}
      safeAreaColor={['blue', 'white']}
      containerStyles={pageStyles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <WebView style={pageStyles.webView} source={{ uri: params.url ?? 'https://www.baidu.com' }} />
    </PageContainer>
  );
};

export default ViewOnWebView;

export const pageStyles = StyleSheet.create({
  pageWrap: {
    paddingLeft: 0,
    paddingRight: 0,
    backgroundColor: defaultColors.bg1,
  },
  webView: {
    width: '100%',
    height: '100%',
  },
  noResult: {},
});
