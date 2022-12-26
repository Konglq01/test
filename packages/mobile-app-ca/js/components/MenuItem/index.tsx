import { defaultColors } from 'assets/theme';
import { TextM } from 'components/CommonText';
import Svg, { IconName } from 'components/Svg';
import React, { memo } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { pTd } from 'utils/unit';
import gStyles from 'assets/theme/GStyles';

interface MenuItemProps {
  title: string;
  icon?: IconName;
  onPress?: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ title, icon, onPress }) => {
  return (
    <TouchableOpacity style={styles.itemWrap} onPress={() => onPress?.()}>
      {icon && <Svg icon={icon} size={24} iconStyle={styles.menuIcon} />}
      <TextM style={styles.title}>{title}</TextM>
      <Svg icon="right-arrow" size={16} color={defaultColors.font7} />
    </TouchableOpacity>
  );
};

export default memo(MenuItem);

const styles = StyleSheet.create({
  itemWrap: {
    marginBottom: pTd(12),
    height: pTd(56),
    backgroundColor: defaultColors.bg1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...gStyles.paddingArg(0, 16),
    borderRadius: pTd(6),
  },
  menuIcon: {
    borderRadius: pTd(6),
    overflow: 'hidden',
    marginRight: pTd(16),
  },
  title: {
    flex: 1,
    color: defaultColors.font5,
    marginRight: pTd(12),
  },
});
