import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import CommonWebView from 'components/CommonWebView';
import '../../Test/TestSDK';
import WebView from 'react-native-webview';

export default function SettingsScreen() {
  WebView;
  return (
    <View style={{ ...styles.container }}>
      <CommonWebView />
      {/* <WebView source={{ uri: 'https://www.baidu.com' }} /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
  },
});
