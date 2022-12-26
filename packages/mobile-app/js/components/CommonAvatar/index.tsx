import React from 'react';
import Svg, { IconName } from 'components/Svg';
import { pTd } from 'utils/unit';
import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme';

interface CommonAvatarProps {
  title: string;
  avatarSize?: string | number;
  svgName?: IconName;
  style?: any;
}

export default function CommonAvatar(props: CommonAvatarProps) {
  const { title, svgName, avatarSize = pTd(48), style = {} } = props;
  const initialsTitle = title?.[0];

  if (!svgName)
    return (
      <View style={[styles.avatarWrap, style]}>
        <Text style={styles.text}>{initialsTitle}</Text>
      </View>
    );

  return <Svg size={avatarSize} icon={svgName} iconStyle={style} />;
}

const styles = StyleSheet.create({
  avatarWrap: {
    width: pTd(48),
    height: pTd(48),
    borderRadius: pTd(48),
    color: defaultColors.font5,
    backgroundColor: defaultColors.bg4,
    borderColor: defaultColors.border1,
    borderWidth: pTd(1),
    display: 'flex',
  },
  text: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    lineHeight: pTd(48),
    fontSize: pTd(20),
  },
});
