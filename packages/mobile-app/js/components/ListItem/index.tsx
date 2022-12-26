import React, { memo, ReactNode, useMemo } from 'react';
import { StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import { pTd } from 'utils/unit';
import { TextL, TextM, TextS } from 'components/CommonText';
import Touchable from 'components/Touchable';
import { defaultColors } from 'assets/theme';
import CommonSwitch from 'components/CommonSwitch';
import Svg from 'components/Svg';

export type ListItemProps = {
  title: string;
  onPress?: () => void;
  subtitle?: string;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  switchStyles?: StyleProp<ViewStyle>;
  subtitleStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
  details?: string;
  detailsStyle?: StyleProp<ViewStyle>;
  switching?: boolean;
  switchValue?: boolean;
  onValueChange?: (value: boolean) => void;
  rightElement?: ReactNode;
};
const ListItem: React.FC<ListItemProps> = props => {
  const {
    title,
    onPress,
    subtitle,
    style,
    titleStyle,
    subtitleStyle,
    disabled,
    details,
    detailsStyle,
    switching,
    switchValue,
    onValueChange,
    rightElement,
    switchStyles,
  } = props;
  const RightElement = useMemo(() => {
    if (switching) {
      return (
        <CommonSwitch
          style={switchStyles}
          value={switchValue}
          thumbColor="white"
          trackColor={{ false: '', true: defaultColors.primaryColor }}
          onValueChange={onValueChange}
        />
      );
    }

    return <Svg icon="right-arrow" size={18} color={defaultColors.font7} iconStyle={styles.iconStyle} />;
  }, [switching, switchStyles, switchValue, onValueChange]);
  return (
    <Touchable disabled={disabled} onPress={onPress} style={[styles.container, style]}>
      {details ? (
        <View style={styles.titleStyle}>
          <TextL numberOfLines={1} style={[titleStyle]}>
            {title}
          </TextL>
          <TextS style={[styles.detailsStyle, detailsStyle]}>{details}</TextS>
        </View>
      ) : (
        <TextL numberOfLines={1} style={[styles.titleStyle, titleStyle]}>
          {title}
        </TextL>
      )}
      {subtitle ? <TextM style={[styles.subtitleStyle, subtitleStyle]}>{subtitle}</TextM> : null}
      {rightElement !== undefined ? rightElement : RightElement}
    </Touchable>
  );
};
export default memo(ListItem);
const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: 56,
    paddingVertical: 18,
    backgroundColor: 'white',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: pTd(16),
    borderRadius: 6,
  },
  titleStyle: {
    flex: 1,
  },
  subtitleStyle: {
    color: defaultColors.font3,
  },
  detailsStyle: {
    marginTop: pTd(5),
    color: defaultColors.font3,
  },
  iconStyle: {
    marginTop: pTd(4),
  },
});
