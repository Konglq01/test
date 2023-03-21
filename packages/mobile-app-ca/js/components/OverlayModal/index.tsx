'use strict';
import React, { ReactNode } from 'react';
import Overlay from 'rn-teaset/components/Overlay/Overlay';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { bottomBarHeight, screenHeight, screenWidth, statusBarHeight } from '@portkey-wallet/utils/mobile/device';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { pTd } from 'utils/unit';

export type OverlayInterface = {
  close?: () => void;
};

let elements: OverlayInterface[] = [];
const customBounds = {
  x: 0,
  y: screenHeight,
  width: screenWidth,
  height: 0,
};
export type OverlayModalProps = {
  position?: 'bottom' | 'center';
  modal?: boolean;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  type?: 'custom' | 'zoomOut';
  autoKeyboardInsets?: boolean;
  animated?: boolean;
};

export default class OverlayModal extends React.Component {
  static show(component: ReactNode, overlayProps: OverlayModalProps = {}) {
    const { position, style: propsStyle, containerStyle: propsContainerStyle, ...props } = overlayProps;
    const style: StyleProp<ViewStyle> = [];
    const containerStyle: StyleProp<ViewStyle> = [];
    if (position) {
      style.push(stylesMap[position].style);
      containerStyle.push(stylesMap[position].containerStyle);
    } else {
      style.push(styles.bgStyle);
      containerStyle.push(styles.containerStyle);
    }
    propsStyle && style.push(propsStyle);
    propsContainerStyle && containerStyle.push(propsContainerStyle);
    const overlayView = (
      <Overlay.PopView
        modal={false}
        type="custom"
        ref={(v: OverlayInterface) => elements.push(v)}
        style={style}
        overlayOpacity={0.3}
        containerStyle={containerStyle}
        customBounds={customBounds}
        {...props}>
        {component}
      </Overlay.PopView>
    );
    Overlay.show(overlayView);
  }

  static hide() {
    elements = elements.filter(item => item); // Discard invalid data
    const topItem = elements.pop();
    topItem?.close?.();
  }

  static destroy() {
    elements.forEach(item => {
      item?.close?.();
    });
    elements = [];
  }

  componentWillUnmount() {
    OverlayModal.destroy();
  }
}
const styles = StyleSheet.create({
  bgStyle: {
    backgroundColor: 'white',
  },
  containerStyle: {
    flex: 1,
  },
  // center
  centerStyle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContainerStyle: {
    marginBottom: statusBarHeight,
  },
  // bottom
  bottomStyle: { flexDirection: 'column-reverse' },
  bottomContainerStyle: {
    paddingBottom: bottomBarHeight,
    backgroundColor: defaultColors.bg1,
    ...GStyles.radiusArg(10, 10, 0, 0),
    overflow: 'hidden',
  },
});

const stylesMap = {
  bottom: {
    style: styles.bottomStyle,
    containerStyle: styles.bottomContainerStyle,
  },
  center: {
    style: styles.centerStyle,
    containerStyle: styles.centerContainerStyle,
  },
};
