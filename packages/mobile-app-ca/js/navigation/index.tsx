import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp, CardStyleInterpolators } from '@react-navigation/stack';

import Tab, { tabMenuList } from './Tab';
import navigationService from 'utils/navigationService';
import LoginNav from 'pages/Login';
import GuardianNav from 'pages/Guardian';
import PinNav from 'pages/Pin';
import ContactsNav from 'pages/Contacts';
import TokenNav from 'pages/Token';
import SendNav from 'pages/Send';
import ActivityNav from 'pages/Activity';
import WalletNav from 'pages/Wallet';
import Home from 'pages/Home';

import Referral from 'pages/Referral';
import SecurityLock from 'pages/SecurityLock';
import DashBoard from 'pages/DashBoard/index';
import Receive from 'pages/Receive';
import NFTDetail from 'pages/NFT/NFTDetail';

const Stack = createStackNavigator();
export const stackNav = [
  { name: 'Referral', component: Referral },
  { name: 'Tab', component: Tab },
  { name: 'SecurityLock', component: SecurityLock, option: { gestureEnabled: false } },
  { name: 'DashBoard', component: DashBoard },
  { name: 'Receive', component: Receive },
  { name: 'NFTDetail', component: NFTDetail },
  // FIXME: test page
  { name: 'Home', component: Home },

  ...ActivityNav,
  ...ContactsNav,
  ...LoginNav,
  ...TokenNav,
  ...SendNav,
  ...GuardianNav,
  ...PinNav,
  ...WalletNav,
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
          <Stack.Screen options={(item as any).option} key={index} {...item} />
        ))}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
