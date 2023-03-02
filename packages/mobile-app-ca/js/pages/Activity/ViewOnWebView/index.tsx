import React from 'react';
import { StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme';
import { useLanguage } from 'i18n/hooks';
import WebView from 'react-native-webview';
import CustomHeader from 'components/CustomHeader';
import SafeAreaBox from 'components/SafeAreaBox';

const safeAreaColorMap = {
  white: defaultColors.bg1,
  blue: defaultColors.bg5,
  gray: defaultColors.bg4,
  transparent: 'transparent',
};

export type SafeAreaColorMapKeyUnit = keyof typeof safeAreaColorMap;

interface ViewOnWebViewPropsType {
  route?: any;
}

const ViewOnWebView: React.FC<ViewOnWebViewPropsType> = ({ route }) => {
  const { t } = useLanguage();
  const { params } = route;

  return (
    <SafeAreaBox edges={['top', 'right', 'left']} style={[{ backgroundColor: safeAreaColorMap.blue }]}>
      <CustomHeader themeType={'blue'} titleDom={'AELF Block Explorer'} />
      <WebView style={pageStyles.webView} source={{ uri: params?.url ?? '' }} />
    </SafeAreaBox>
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
  },
  noResult: {},
});
