import React, { useRef } from 'react';
import Overlay from 'teaset/components/Overlay/Overlay';
import { View, StyleSheet, Animated, Keyboard } from 'react-native';
import { TextL } from '../CommonText';
import { defaultColors } from 'assets/theme';
import useEffectOnce from 'hooks/useEffectOnce';
import GStyles from 'assets/theme/GStyles';
import Spinner from 'react-native-spinkit';
import { FontStyles } from 'assets/theme/styles';

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
      <Spinner type="Circle" color={FontStyles.font11.color} size={40} />
      <TextL style={styles.textStyles}>{text}</TextL>
    </View>
  );
}

export default class Loading extends React.Component {
  static show(text?: string, overlayProps?: any, duration = 2000000) {
    Keyboard.dismiss();
    Loading.hide();
    const overlayView = (
      <Overlay.PopView
        modal={true}
        type="zoomIn"
        ref={(v: any) => elements.push(v)}
        style={styles.container}
        overlayOpacity={0}
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
    backgroundColor: '#00000030',
  },
  textStyles: {
    color: defaultColors.font11,
    marginTop: 20,
  },
});
