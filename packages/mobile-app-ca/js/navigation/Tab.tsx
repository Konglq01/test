import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashBoard from 'pages/DashBoard';
import Svg from 'components/Svg';
import { defaultColors } from 'assets/theme';
import { useLanguage } from 'i18n/hooks';
import MyMenu from 'pages/MyMenu';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import useLogOut from 'hooks/useLogOut';
import { TextS } from 'components/CommonText';
import { pTd } from 'utils/unit';

const Tab = createBottomTabNavigator();

type tabMenuIcon = typeof tabMenuList[number]['icon'];

export const tabMenuList = [
  { name: 'Wallet', label: 'Wallet', index: 0, icon: 'logo-icon', component: DashBoard },
  { name: 'Settings', label: 'My', index: 2, icon: 'my', component: MyMenu },
] as const;

export const getLabel = (name: string): string => tabMenuList.find(ele => ele.name === name)?.label ?? '';

export default function TabRoot() {
  const { t } = useLanguage();
  const { address } = useCurrentWalletInfo();
  const logOut = useLogOut();
  useEffect(() => {
    if (!address) logOut();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);
  return (
    <Tab.Navigator
      initialRouteName="Wallet"
      screenOptions={({ route }) => ({
        tabBarAllowFontScaling: false,
        header: () => null,
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
            tabBarActiveTintColor: defaultColors.font4,
          }}
        />
      ))}
    </Tab.Navigator>
  );
}
