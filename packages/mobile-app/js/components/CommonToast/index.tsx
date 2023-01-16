import React, { ReactNode } from 'react';
import Toast from 'rn-teaset/components/Toast/Toast';
import Overlay from 'rn-teaset/components/Overlay/Overlay';
import { StyleSheet, View } from 'react-native';
import { defaultColors } from 'assets/theme';
import Svg from 'components/Svg';
import { TextL } from 'components/CommonText';
import { pTd } from 'utils/unit';
import { statusBarHeight } from 'utils/device';

type TostProps = [
  text: string,
  duration?: number,
  position?: 'top' | 'bottom' | 'center',
  icon?: 'success' | ReactNode,
];
const tostProps = {
  overlayOpacity: 0,
  overlayPointerEvents: 'none',
  closeOnHardwareBackPress: false,
  position: 'center',
};

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  top: {
    paddingTop: statusBarHeight + 50,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  bottom: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 80,
  },
  toastRow: {
    maxWidth: '70%',
    flexWrap: 'wrap',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 6,
    shadowColor: defaultColors.shadow1,
    backgroundColor: defaultColors.bg1,
    // shadow
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 2,
  },
  textStyle: {
    color: defaultColors.font3,
    marginLeft: pTd(10),
    textAlign: 'center',
  },
});

const icons: any = {
  success: <Svg icon="success" size={pTd(22)} />,
  fail: <Svg icon="fail" size={pTd(22)} />,
} as const;

const show = (...args: TostProps) => {
  const [text, duration = 2000, position = 'top', icon] = args;
  const key = Overlay.show(
    <Overlay.View {...tostProps} style={position ? styles[position] : undefined} position={position}>
      <View style={styles.toastRow}>
        {typeof icon === 'string' ? icons[icon] : icon}
        <TextL style={styles.textStyle}>{text}</TextL>
      </View>
    </Overlay.View>,
  );
  setTimeout(() => Overlay.hide(key), duration);
  return key;
};

let element: any;

export default {
  text(text: string) {
    Overlay.hide(element);
    element = show(text);
  },
  message(...args: TostProps) {
    Toast.hide(element);
    element = Toast.message(...args);
  },
  success(...args: TostProps) {
    if (!args[3]) args[3] = 'success';
    Overlay.hide(element);
    element = show(...args);
  },
  fail(...args: TostProps) {
    if (!args[3]) args[3] = 'fail';
    Overlay.hide(element);
    element = show(...args);
  },
  smile(...args: TostProps) {
    Toast.hide(element);
    element = Toast.smile(...args);
  },
  sad(...args: TostProps) {
    Toast.hide(element);
    element = Toast.sad(...args);
  },
  info(...args: TostProps) {
    Toast.hide(element);
    element = Toast.info(...args);
  },
  stop(...args: TostProps) {
    Toast.hide(element);
    element = Toast.stop(...args);
  },
};
