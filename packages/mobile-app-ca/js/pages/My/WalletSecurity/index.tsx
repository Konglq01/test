import React, { memo } from 'react';
import PageContainer from 'components/PageContainer';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';

import { useDeviceList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import navigationService from 'utils/navigationService';
import { pTd } from 'utils/unit';
import { TextL, TextM } from 'components/CommonText';
import Svg from 'components/Svg';
interface MenuItemProps {
  title: string;
  suffix?: string | number;
  onPress?: () => void;
}
const MenuItemRender: React.FC<MenuItemProps> = ({ title, onPress, suffix }) => {
  return (
    <TouchableOpacity style={itemStyles.itemWrap} onPress={() => onPress?.()}>
      <TextL style={itemStyles.title}>{title}</TextL>
      {suffix !== undefined && <TextM style={GStyles.marginRight(4)}>{suffix}</TextM>}
      <Svg icon="right-arrow" size={20} color={defaultColors.font3} />
    </TouchableOpacity>
  );
};
const MenuItem = memo(MenuItemRender);

const itemStyles = StyleSheet.create({
  itemWrap: {
    height: pTd(56),
    borderRadius: pTd(6),
    backgroundColor: defaultColors.bg1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: defaultColors.border6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: pTd(16),
  },
  menuIcon: {
    overflow: 'hidden',
    marginRight: pTd(16),
    borderRadius: pTd(6),
  },
  title: {
    flex: 1,
    color: defaultColors.font5,
    marginRight: pTd(12),
  },
});

const WalletSecurity: React.FC = () => {
  const deviceList = useDeviceList();

  return (
    <PageContainer
      titleDom={'Wallet Security'}
      safeAreaColor={['blue', 'gray']}
      containerStyles={pageStyles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <MenuItem
        title="Login Devices"
        suffix={deviceList.length}
        onPress={() => {
          navigationService.navigate('DeviceList');
        }}
      />
    </PageContainer>
  );
};

const pageStyles = StyleSheet.create({
  pageWrap: {
    flex: 1,
    backgroundColor: defaultColors.bg4,
    ...GStyles.paddingArg(24, 20, 18),
  },
});

export default WalletSecurity;
