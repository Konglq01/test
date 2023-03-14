import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import {
  StyleSheet,
  PanResponder,
  TextStyle,
  GestureResponderEvent,
  View,
  PanResponderCallbacks,
  Animated,
} from 'react-native';
import { TextL, TextS } from 'components/CommonText';
import usePrevious from 'hooks/usePrevious';
import isEqual from 'lodash/isEqual';
import { ViewStyleType } from 'types/styles';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
export interface IndexBarProps {
  data: string[];
  style?: ViewStyleType;
  indexBarItemStyle?: ViewStyleType;
  indexTextStyle?: TextStyle;
  onPress?: (index: number) => void;
  showPopover?: boolean;
}
interface PageLocationType {
  height: number;
  pageX: number;
  pageY: number;
  indexHeight: number;
}
interface IndexInfoType extends PageLocationType {
  currentIndex: number;
}
type PopoverInfo = {
  text: string | number;
  top: number;
  indexHeight: number;
};

interface PopoverInterface {
  setPopoverInfo: (info?: PopoverInfo) => void;
  setShow: (show?: boolean) => void;
}

export const Popover = forwardRef((_, _ref) => {
  const [show, setShow] = useState<boolean>();
  const [popoverInfo, setPopoverInfo] = useState<PopoverInfo>();
  const marginTop = useRef(new Animated.Value(0)).current;
  const onSetPopoverInfo = useCallback(
    (info: PopoverInfo) => {
      if (!info) return;
      Animated.timing(marginTop, {
        useNativeDriver: false,
        toValue: info.top - info.indexHeight / 2,
        duration: 200,
      }).start(({ finished }) => {
        finished && setPopoverInfo(info);
      });
    },
    [marginTop],
  );
  useImperativeHandle(_ref, () => ({ setPopoverInfo: onSetPopoverInfo, setShow }), [onSetPopoverInfo]);

  if (!popoverInfo || !show) return null;
  return (
    <Animated.View style={[styles.popover, { marginTop }]}>
      <TextL style={[styles.popoverItem]}>{popoverInfo.text}</TextL>
    </Animated.View>
  );
});
Popover.displayName = 'Popover';

export default function IndexBar({
  style,
  data,
  indexBarItemStyle,
  indexTextStyle,
  onPress,
  showPopover,
}: IndexBarProps) {
  const indexInfoRef = useRef<IndexInfoType>();
  const indexRef = useRef<View>(null);
  const popoverRef = useRef<PopoverInterface>();
  const prevData = usePrevious(data);
  const getIndex = useCallback((nativePageY: number) => {
    if (!indexInfoRef.current) return;
    const { pageY, height, indexHeight } = indexInfoRef.current;
    const nativeClientY = nativePageY - pageY;
    if (nativeClientY < 0 || nativeClientY > height) return;
    return Math.floor(nativeClientY / indexHeight);
  }, []);

  const setCurrentIndex = useCallback(
    (nativePageY: number) => {
      if (!indexInfoRef.current) return;
      const { currentIndex, indexHeight } = indexInfoRef.current;
      const nowIndex = getIndex(nativePageY);
      if (nowIndex !== undefined && nowIndex !== currentIndex) {
        indexInfoRef.current.currentIndex = nowIndex;
        onPress?.(nowIndex);
        popoverRef.current?.setPopoverInfo({ top: nowIndex * indexHeight, text: data[nowIndex], indexHeight });
      }
    },
    [data, getIndex, onPress],
  );

  const onPanResponderStart: PanResponderCallbacks['onPanResponderStart'] = useCallback(
    async (evt: { nativeEvent: { pageY: any } }) => {
      const eventPageY = evt.nativeEvent.pageY;
      if (indexInfoRef.current && (isEqual(data, prevData) || !prevData)) {
        indexInfoRef.current.currentIndex = -1;
      } else {
        const { height, pageX, pageY, indexHeight } = await new Promise<PageLocationType>((resolve, reject) => {
          if (indexRef.current === null) {
            reject('no indexRef');
            return;
          }
          indexRef.current.measure((_x, _y, _width, _height, _pageX, _pageY) => {
            resolve({
              height: _height,
              pageX: _pageX,
              pageY: _pageY,
              indexHeight: _height / data.length,
            });
          });
        });
        indexInfoRef.current = {
          height,
          pageX,
          pageY,
          indexHeight,
          currentIndex: 0,
        };
      }
      setCurrentIndex(eventPageY);
    },
    [data, prevData, setCurrentIndex],
  );
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderStart,
        onPanResponderMove: (evt: GestureResponderEvent) => {
          popoverRef.current?.setShow(true);
          setCurrentIndex(evt.nativeEvent.pageY);
        },
        onPanResponderEnd: () => {
          popoverRef.current?.setPopoverInfo(undefined);
          popoverRef.current?.setShow(false);
        },
      }),
    [onPanResponderStart, setCurrentIndex],
  );
  const indexBarItem = useCallback(
    (item: string, index: number) => {
      return (
        <View key={index} style={[styles.indexBarItemStyle, indexBarItemStyle]}>
          <TextS style={[styles.indexTextStyle, indexTextStyle]}>{item}</TextS>
        </View>
      );
    },
    [indexBarItemStyle, indexTextStyle],
  );
  return (
    <View style={[styles.barBox, style]} ref={indexRef} {...panResponder.panHandlers}>
      {showPopover && <Popover ref={popoverRef} />}
      {data?.map(indexBarItem)}
    </View>
  );
}

const styles = StyleSheet.create({
  indexTextStyle: {
    color: defaultColors.font3,
  },
  indexBarItemStyle: {
    flex: 1,
    width: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popover: {
    position: 'absolute',
    right: 30,
    height: 50,
    width: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: defaultColors.bg6,
  },
  popoverItem: {},
  barBox: {
    position: 'absolute',
    right: pTd(4),
  },
});
