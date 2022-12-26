import React from 'react';
import Svg, { IconName } from 'components/Svg';
import { pTd } from 'utils/unit';
import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme';
import { Image } from '@rneui/base';

interface CommonAvatarProps {
  title: string;
  avatarSize?: string | number;
  svgName?: IconName;
  url?: string;
  shapeType?: 'square' | 'circular';
  style?: any;
  color?: string;
}

export default function CommonAvatar(props: CommonAvatarProps) {
  const { title, svgName, avatarSize = pTd(48), style = {}, color, url, shapeType = 'circular' } = props;
  const initialsTitle = title?.[0];

  const sizeStyle = {
    width: Number(avatarSize),
    height: Number(avatarSize),
    lineHeight: Number(avatarSize),
    borderRadius: shapeType === 'square' ? pTd(6) : Number(avatarSize) / 2,
  };

  if (url)
    return (
      <Image
        style={[styles.avatarWrap, shapeType === 'square' && styles.squareStyle, sizeStyle, style]}
        source={{ uri: url }}
      />
    );

  if (svgName)
    return (
      <Svg
        size={avatarSize}
        icon={svgName}
        color={color}
        iconStyle={{
          ...styles.avatarWrap,
          ...(shapeType === 'square' ? styles.squareStyle : {}),
          ...sizeStyle,
          ...style,
        }}
      />
    );

  return (
    <Text style={[styles.avatarWrap, shapeType === 'square' && styles.squareStyle, sizeStyle, style]}>
      {initialsTitle}
    </Text>
  );
}

const styles = StyleSheet.create({
  avatarWrap: {
    width: pTd(48),
    height: pTd(48),
    borderRadius: pTd(48),
    color: defaultColors.font5,
    backgroundColor: defaultColors.bg4,
    display: 'flex',
    fontSize: pTd(20),
    lineHeight: pTd(48),
    overflow: 'hidden',
    textAlign: 'center',
  },
  squareStyle: {
    borderRadius: pTd(6),
    backgroundColor: defaultColors.bg7,
    borderWidth: 0,
    color: defaultColors.font7,
  },
});
