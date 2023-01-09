import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from 'pages/Home';
import DashBoard from 'pages/DashBoard';
import Svg from 'components/Svg';
import { defaultColors } from 'assets/theme';
import { useNetworkInitialization } from '@portkey/hooks/network';
import { useAccountListBalanceTimer } from 'contexts/useInterface/hooks';
import { useLanguage } from 'i18n/hooks';
import MyMenu from 'pages/MyMenu';

const Tab = createBottomTabNavigator();

export const tabMenuList = [
  { name: 'Wallet', label: 'Wallet', index: 0, icon: 'logo-icon', component: DashBoard },
  { name: 'Discover', label: 'Discover', index: 1, icon: 'discover', component: HomeScreen },
  { name: 'Settings', label: 'My', index: 2, icon: 'my', component: MyMenu },
] as const;

type tabMenuIcon = typeof tabMenuList[number]['icon'];

export default function TabRoot() {
  const { t } = useLanguage();

  useNetworkInitialization();
  useAccountListBalanceTimer();
  return (
    <Tab.Navigator
      initialRouteName="Wallet"
      screenOptions={({ route }) => ({
        header: () => null,
        // tabBarIcon: tabBarIconProps => BottomTabBar({ ...tabBarIconProps, route }),
        tabBarIcon: ({ focused }) => {
          const iconName: tabMenuIcon = tabMenuList.find(tab => tab.name === route.name)?.icon ?? 'logo-icon';
          return <Svg icon={iconName} size={20} color={focused ? defaultColors.font4 : defaultColors.font7} />;
        },
      })}>
      {tabMenuList.map(ele => (
        <Tab.Screen
          key={ele.name}
          name={ele.name}
          component={ele.component}
          options={{
            title: t(ele.label),
          }}
        />
      ))}
    </Tab.Navigator>
  );
}
