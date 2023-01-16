import React, { useRef } from 'react';
import Overlay from 'rn-teaset/components/Overlay/Overlay';
import { View, StyleSheet, Animated } from 'react-native';
import { TextL } from '../CommonText';
import { defaultColors } from 'assets/theme';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import useEffectOnce from 'hooks/useEffectOnce';
import GStyles from 'assets/theme/GStyles';
let elements: any = [];
let timer: NodeJS.Timeout | null = null;

const animatedConfig = {
  duration: 500,
  useNativeDriver: false,
};

function LoadingBody({ text = 'Loading...' }: { text?: string }) {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  useEffectOnce(() => {
    const animations = Animated.sequence([
      Animated.timing(fadeAnim, {
        ...animatedConfig,
        toValue: 1.2,
      }),
      Animated.timing(fadeAnim, {
        ...animatedConfig,
        toValue: 1,
      }),
    ]);
    Animated.loop(animations).start();
    return () => {
      animations.stop();
    };
  });
  return (
    <View style={GStyles.center}>
      <Animated.View style={{ transform: [{ scale: fadeAnim }] }}>
        <Svg icon="logo-icon" color={defaultColors.primaryColor} size={pTd(80)} />
      </Animated.View>
      <TextL style={styles.textStyles}>{text}</TextL>
    </View>
  );
}

export default class Loading extends React.Component {
  static show(text?: string, overlayProps?: any, duration = 20000) {
    Loading.hide();
    const overlayView = (
      <Overlay.PopView
        modal={true}
        type="zoomIn"
        ref={(v: any) => elements.push(v)}
        style={styles.container}
        {...overlayProps}>
        <LoadingBody text={text} />
      </Overlay.PopView>
    );
    Overlay.show(overlayView);
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      Loading.hide();
    }, duration);
  }

  static hide() {
    timer && clearTimeout(timer);
    timer = null;
    elements = elements.filter((item: any) => item); //Discard invalid data
    const key = elements.pop();
    key && key.close && key.close();
  }

  static destroy() {
    timer && clearTimeout(timer);
    timer = null;
    elements.forEach((item: { close: () => any }) => {
      item && item.close && item.close();
    });
    elements = [];
  }

  componentWillUnmount() {
    Loading.destroy();
  }
}
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: defaultColors.bg1,
  },
  textStyles: {
    color: defaultColors.font5,
    marginTop: 20,
  },
});
