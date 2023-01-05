import { defaultColors } from 'assets/theme';
import { TextL, TextM } from 'components/CommonText';
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
      {icon && <Svg icon={icon} size={26} iconStyle={styles.menuIcon} />}
      <TextL style={styles.title}>{title}</TextL>
      <Svg icon="right-arrow" size={16} color={defaultColors.font7} />
    </TouchableOpacity>
  );
};

export default memo(MenuItem);

const styles = StyleSheet.create({
  itemWrap: {
    height: pTd(64),
    backgroundColor: defaultColors.bg1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: defaultColors.border6,
    borderBottomWidth: 1,
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
