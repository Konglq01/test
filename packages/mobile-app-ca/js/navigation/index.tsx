import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp, CardStyleInterpolators } from '@react-navigation/stack';

import Tab, { tabMenuList } from './Tab';
import navigationService from 'utils/navigationService';
import LoginNav from 'pages/Login';
import PinNav from 'pages/Pin';
import TokenNav from 'pages/Token';
import SendNav from 'pages/Send';
import ActivityNav from 'pages/Activity';
import Home from 'pages/Home';

import Referral from 'pages/Referral';
import SecurityLock from 'pages/SecurityLock';
import Receive from 'pages/Receive';
import NFTDetail from 'pages/NFT/NFTDetail';
import QrScanner from 'pages/QrScanner';
import MyNav from 'pages/My/router';

const Stack = createStackNavigator();
export const stackNav = [
  { name: 'Referral', component: Referral },
  { name: 'Tab', component: Tab },
  { name: 'SecurityLock', component: SecurityLock, options: { gestureEnabled: false } },
  { name: 'Receive', component: Receive },
  { name: 'NFTDetail', component: NFTDetail },
  { name: 'QrScanner', component: QrScanner },

  // FIXME: test page
  { name: 'Home', component: Home },

  ...ActivityNav,
  ...LoginNav,
  ...TokenNav,
  ...SendNav,
  ...PinNav,
  ...MyNav,
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
        screenOptions={{
          headerBackAllowFontScaling: false,
          headerTitleAllowFontScaling: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          headerShown: false,
        }}>
        {stackNav.map((item, index) => (
          <Stack.Screen options={(item as any).options} key={index} {...(item as any)} />
        ))}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
