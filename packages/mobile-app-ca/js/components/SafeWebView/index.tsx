import WebView, { WebViewProps } from 'react-native-webview';
import React from 'react';

const SafeWebView: React.FC<WebViewProps> = props => {
  const { originWhitelist = ['https://*'] } = props;

  return <WebView originWhitelist={originWhitelist} {...props} />;
};

export default SafeWebView;
