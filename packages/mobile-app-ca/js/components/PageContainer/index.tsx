import React, { ReactNode } from 'react';
import CustomHeader, { CustomHeaderProps } from 'components/CustomHeader';
import SafeAreaBox, { SafeAreaBoxProps } from 'components/SafeAreaBox';
import { useGStyles } from 'assets/theme/useGStyles';
import { KeyboardAwareScrollView, KeyboardAwareScrollViewProps } from 'react-native-keyboard-aware-scroll-view';
import { StyleProp, TouchableWithoutFeedback, View, ViewStyle, Keyboard } from 'react-native';
import { defaultColors } from 'assets/theme';

const safeAreaColorMap = {
  white: defaultColors.bg1,
  blue: defaultColors.bg5,
  gray: defaultColors.bg4,
  transparent: 'transparent',
};

export type SafeAreaColorMapKeyUnit = keyof typeof safeAreaColorMap;

export default function PageContainer({
  safeAreaColor = ['white', 'white'],
  children,
  safeAreaProps,
  containerStyles,
  scrollViewProps,
  hideHeader,
  hideTouchable,
  ...props
}: CustomHeaderProps & {
  safeAreaColor?: SafeAreaColorMapKeyUnit[]; // top and bottom safeArea color
  children?: ReactNode;
  safeAreaProps?: SafeAreaBoxProps[];
  scrollViewProps?: KeyboardAwareScrollViewProps & {
    disabled?: boolean; // disabled scrollView
  };
  containerStyles?: StyleProp<ViewStyle>;
  hideHeader?: boolean;
  hideTouchable?: boolean;
}) {
  const gStyles = useGStyles();

  return (
    <SafeAreaBox
      {...safeAreaProps}
      edges={['top', 'right', 'left']}
      style={[{ backgroundColor: safeAreaColorMap[safeAreaColor[0]] }, safeAreaProps?.[0]?.style]}>
      <SafeAreaBox
        edges={['bottom']}
        style={[{ backgroundColor: safeAreaColorMap[safeAreaColor[1]] }, safeAreaProps?.[1]?.style]}>
        {!hideHeader && <CustomHeader themeType={safeAreaColor[0]} {...props} />}
        {scrollViewProps?.disabled ? (
          hideTouchable ? (
            <View style={[gStyles.container, containerStyles]}>{children}</View>
          ) : (
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
              <View style={[gStyles.container, containerStyles]}>{children}</View>
            </TouchableWithoutFeedback>
          )
        ) : (
          <KeyboardAwareScrollView
            keyboardOpeningTime={0}
            extraHeight={20}
            // alwaysBounceVertical={false}
            keyboardShouldPersistTaps="handled"
            // enableAutomaticScroll={false}
            {...scrollViewProps}>
            <View style={[gStyles.container, containerStyles]}>{children}</View>
          </KeyboardAwareScrollView>
        )}
      </SafeAreaBox>
    </SafeAreaBox>
  );
}
