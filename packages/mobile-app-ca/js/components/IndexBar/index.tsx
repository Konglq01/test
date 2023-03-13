import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  PanResponder,
  TextStyle,
  GestureResponderEvent,
  View,
  PanResponderCallbacks,
} from 'react-native';
import { TextL } from 'components/CommonText';
import usePrevious from 'hooks/usePrevious';
import isEqual from 'lodash/isEqual';
import { ViewStyleType } from 'types/styles';
export interface IndexBarProps {
  data: string[];
  indexBarItemStyle?: ViewStyleType;
  indexTextStyle?: TextStyle;
  onPress?: (index: number) => void;
  style?: ViewStyleType;
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
};

interface PopoverInterface {
  setPopoverInfo: (info?: PopoverInfo) => void;
  setShow: (show?: boolean) => void;
}

export const Popover = forwardRef((_, _ref) => {
  const [show, setShow] = useState<boolean>();
  const [popoverInfo, setPopoverInfo] = useState<PopoverInfo>();
  useImperativeHandle(_ref, () => ({ setPopoverInfo, setShow }), []);
  if (!popoverInfo || !show) return null;
  return (
    <View style={styles.popover}>
      <TextL style={{ marginTop: popoverInfo.top }}>{popoverInfo.text}</TextL>
    </View>
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
  console.log(prevData, '======prevData');

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
      console.log(nowIndex, currentIndex);

      if (nowIndex !== undefined && nowIndex !== currentIndex) {
        indexInfoRef.current.currentIndex = nowIndex;
        onPress?.(nowIndex);
        popoverRef.current?.setPopoverInfo({ top: nowIndex * indexHeight, text: data[nowIndex] });
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
    ({ item }: { item: string; index: number }) => {
      return (
        <View style={[styles.indexBarItemStyle, indexBarItemStyle]}>
          <TextL style={[styles.indexTextStyle, indexTextStyle]}>{item}</TextL>
        </View>
      );
    },
    [indexBarItemStyle, indexTextStyle],
  );
  return (
    <View style={[styles.barBox, style]} ref={indexRef} {...panResponder.panHandlers}>
      {showPopover && <Popover ref={popoverRef} />}
      <FlatList
        data={data}
        alwaysBounceVertical={false}
        renderItem={indexBarItem}
        keyExtractor={(_: string, index: number) => index.toString()}
        initialNumToRender={data ? data.length : 10}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  indexTextStyle: {
    color: '#157EFB',
  },
  indexBarItemStyle: {
    width: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popover: {
    position: 'absolute',
    top: 0,
    bottom: 0,
  },
  barBox: {
    position: 'absolute',
    right: 5,
  },
});
