import React, { useMemo } from 'react';
import { defaultColors } from 'assets/theme';
import { Image, StyleSheet, View } from 'react-native';
import { ViewStyleType } from 'types/styles';

export function VerifierImage({ size = 36, uri, style }: { size?: number; uri?: string; style?: ViewStyleType }) {
  const iconStyle = useMemo(() => {
    return {
      width: size,
      height: size,
      borderRadius: size / 2,
    };
  }, [size]);
  return (
    <View style={[styles.iconBox, iconStyle, style]}>
      <Image source={{ uri }} style={iconStyle} />
    </View>
  );
}

const styles = StyleSheet.create({
  iconBox: {
    borderColor: defaultColors.border2,
    borderWidth: 1,
  },
});
