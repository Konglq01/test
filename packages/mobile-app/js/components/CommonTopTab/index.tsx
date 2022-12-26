import React, { memo, ReactElement } from 'react';
import { StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { screenWidth } from 'utils/device';
import { pTd } from 'utils/unit';
import { defaultColors } from 'assets/theme';

export interface TabItemTypes {
  name: string;
  tabItemDom: ReactElement;
}

export type CommonTopTabProps = {
  hasTabBarBorderRadius?: boolean;
  initialRouteName?: string;
  tabItemStyleProps?: any;
  tabList: TabItemTypes[];
};

const Tab = createMaterialTopTabNavigator();

const CommonTopTab: React.FC<CommonTopTabProps> = props => {
  const { tabList, initialRouteName, hasTabBarBorderRadius } = props;

  return (
    <Tab.Navigator
      initialRouteName={initialRouteName}
      initialLayout={{ width: screenWidth }}
      screenOptions={{
        tabBarStyle: [hasTabBarBorderRadius ? styles.radiusTarBarStyle : {}, styles.tabBarStyle], // tabWrap
        tabBarLabelStyle: styles.tabBarLabelStyle,
        tabBarInactiveTintColor: defaultColors.font3, // active
        tabBarActiveTintColor: defaultColors.font4, // inactive
        tabBarIndicatorStyle: { borderWidth: pTd(1), borderColor: defaultColors.bg5 }, // active border
      }}>
      {tabList.map(ele => (
        <Tab.Screen key={ele.name} name={ele.name}>
          {() => ele.tabItemDom}
        </Tab.Screen>
      ))}
    </Tab.Navigator>
  );
};
export default memo(CommonTopTab);

const styles = StyleSheet.create({
  tabBarStyle: {
    elevation: 10,
    shadowColor: defaultColors.border1,
    shadowOffset: { width: 0, height: 3 },
  },
  radiusTarBarStyle: {
    borderTopLeftRadius: pTd(8),
    borderTopRightRadius: pTd(8),
  },
  tabBarLabelStyle: {
    textTransform: 'none',
    fontSize: pTd(14),
  },
});
