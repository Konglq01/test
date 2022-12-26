import { defaultColors } from 'assets/theme';
import { TextL } from 'components/CommonText';
import Svg, { IconName } from 'components/Svg';
import React, { memo } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { pTd } from 'utils/unit';

interface MenuItemProps {
  title: string;
  icon: IconName;
  onPress?: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ title, icon, onPress }) => {
  return (
    <TouchableOpacity style={styles.itemWrap} onPress={() => onPress?.()}>
      <Svg icon={icon} size={24} iconStyle={styles.menuIcon} />
      <TextL style={styles.title}>{title}</TextL>
      <Svg icon="right-arrow" size={16} color={defaultColors.font7} />
    </TouchableOpacity>
  );
};

export default memo(MenuItem);

const styles = StyleSheet.create({
  test: {
    width: 26,
    height: 26,
  },
  itemWrap: {
    width: '100%',
    height: pTd(64),
    borderBottomColor: defaultColors.border6,
    borderBottomWidth: pTd(0.5),
    paddingLeft: pTd(16),
    paddingRight: pTd(16),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    borderRadius: pTd(6),
    overflow: 'hidden',
  },
  title: {
    flex: 1,
    paddingLeft: pTd(16),
    color: defaultColors.font5,
  },
});
