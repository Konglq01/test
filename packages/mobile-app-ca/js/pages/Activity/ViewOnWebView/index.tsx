import React from 'react';
import { StyleSheet, View } from 'react-native';
import { defaultColors } from 'assets/theme';
import WebView from 'react-native-webview';
import CustomHeader, { CustomHeaderProps } from 'components/CustomHeader';
import SafeAreaBox from 'components/SafeAreaBox';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { TextM } from 'components/CommonText';
import Svg from 'components/Svg';

const safeAreaColorMap = {
  white: defaultColors.bg1,
  blue: defaultColors.bg5,
  gray: defaultColors.bg4,
  transparent: 'transparent',
};

export type SafeAreaColorMapKeyUnit = keyof typeof safeAreaColorMap;

type WebViewPageType = 'default' | 'discover';

const ViewOnWebView: React.FC = () => {
  const {
    title = '',
    url,
    webViewPageType = 'default',
  } = useRouterParams<{ url: string; title?: string; webViewPageType: WebViewPageType }>();

  return (
    <SafeAreaBox edges={['top', 'right', 'left']} style={[{ backgroundColor: safeAreaColorMap.blue }]}>
      <CustomHeader themeType={'blue'} titleDom={title} rightDom={<Svg icon="terms" />} />
      <View style={pageStyles.webViewContainer}>
        {webViewPageType === 'default' && (
          <View>
            <TextM>11</TextM>
          </View>
        )}
        <WebView style={pageStyles.webView} source={{ uri: url ?? '' }} />
      </View>
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
  webViewContainer: {
    flex: 1,
  },
  webView: {
    width: '100%',
  },
  noResult: {},
});
