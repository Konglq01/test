import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp, CardStyleInterpolators } from '@react-navigation/stack';

import Tab, { tabMenuList } from './Tab';
import Test from 'pages/Test';
import navigationService from 'utils/navigationService';
import { Counter } from 'pages/Counter';
import AElfTest from 'pages/AElfTest';
import Element from 'pages/Element';
import I18n from 'pages/I18n';
import Authentication from 'pages/Authentication';
import LoginNav from 'pages/Login';
import AccountNav from 'pages/Account';
import ContactsNav from 'pages/Contacts';
import TokenNav from 'pages/Token';
import SendNav from 'pages/Send';

import Referral from 'pages/Referral';
import SecurityLock from 'pages/SecurityLock';
import WebView from 'pages/WebView';
import Echarts from 'pages/Echarts';
import DashBoard from 'pages/DashBoard/index';
import NetworkNav from 'pages/ManageNetwork/router';
import SettingsNav from 'pages/SettingsPage/router';
import Receive from 'pages/Receive';

const Stack = createStackNavigator();
export const stackNav = [
  { name: 'Referral', component: Referral },
  { name: 'Tab', component: Tab },
  { name: 'Test', component: Test },
  { name: 'Counter', component: Counter },
  { name: 'AElfTest', component: AElfTest },
  { name: 'Element', component: Element },
  { name: 'I18n', component: I18n },
  { name: 'Authentication', component: Authentication },
  { name: 'SecurityLock', component: SecurityLock, options: { gestureEnabled: false } },
  { name: 'WebView', component: WebView },
  { name: 'Echarts', component: Echarts },
  { name: 'DashBoard', component: DashBoard },
  { name: 'Receive', component: Receive },

  ...NetworkNav,
  ...ContactsNav,
  ...LoginNav,
  ...AccountNav,
  ...TokenNav,
  ...SendNav,
  ...SettingsNav,
] as const;

export type RootStackParamList = {
  [key in typeof stackNav[number]['name']]: undefined;
};
export type TabParamList = {
  [key in typeof tabMenuList[number]['name']]: undefined;
};
export type RootStackName = typeof stackNav[number]['name'];

export type RootNavigationProp = StackNavigationProp<RootStackParamList>;

export default function NavigationRoot() {
  return (
    <NavigationContainer ref={navigationService.setTopLevelNavigator}>
      <Stack.Navigator
        initialRouteName="Referral"
        screenOptions={{ cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, headerShown: false }}>
        {stackNav.map((item, index) => (
          <Stack.Screen options={item.name === 'SecurityLock' ? item.options : undefined} key={index} {...item} />
        ))}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
