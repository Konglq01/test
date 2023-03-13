import { bottomBarHeight, windowHeight } from '@portkey-wallet/utils/mobile/device';
import React, { useCallback, useMemo, useRef } from 'react';
import { View, ViewStyle, TextStyle, StyleSheet } from 'react-native';
import CommonLargeList, { CommonLargeListProps } from 'components/CommonLargeList';
import IndexBar from 'components/IndexBar';
import { headerHeight as HeaderHeight } from 'components/CustomHeader/style/index.style';
export interface IndexLargeListProps extends CommonLargeListProps {
  data: Array<any>;
  headerHeight?: number;
  showHeader?: boolean;
  indexBarStyle?: ViewStyle;
  indexBarBoxStyle?: ViewStyle;
  indexTextStyle?: TextStyle;
  indexArray?: Array<string>;
  upPullRefresh?: boolean;
  topOffset?: number;
  extraHeight?: number;
}
export default function IndexBarLargeList(props: IndexLargeListProps) {
  const largeListRef = useRef<any>();
  const getOffset = useCallback(
    (key: number) => {
      const { data, indexHeight, sectionHeight, headerHeight, showHeader } = props;
      if (Array.isArray(data) && Array.isArray(data[0]?.items)) {
        let [sectionKey, itemKey, hotHeight] = [key, 0, 0];
        if (showHeader) {
          sectionKey = key === 0 ? key : key - 1;
          hotHeight = key ? headerHeight ?? 0 : 0;
        }
        for (let i = 0; i < sectionKey; i++) {
          if (Array.isArray(data[i]?.items)) itemKey = itemKey + data[i].items.length;
        }
        return itemKey * indexHeight + sectionKey * sectionHeight + hotHeight;
      }
      return 0;
    },
    [props],
  );
  const maxOffset = useMemo(() => {
    return getOffset(props.data?.length) - windowHeight + HeaderHeight + bottomBarHeight + (props.extraHeight ?? 0);
  }, [getOffset, props.data?.length, props.extraHeight]);
  const onSectionSelect = useCallback(
    (key: number) => {
      const offset = getOffset(key);
      largeListRef.current?.scrollTo({
        x: 0,
        y: Math.min(maxOffset, offset),
      });
    },
    [getOffset, maxOffset],
  );
  const {
    indexArray,
    data,
    sectionHeight,
    indexHeight,
    showHeader,
    renderItem,
    onLoading,
    allLoaded,
    onRefresh,
    renderSection,
    renderHeader,
    indexBarBoxStyle,
    topOffset,
  } = props;
  return (
    <View style={styles.box}>
      <CommonLargeList
        onLoading={onLoading}
        allLoaded={allLoaded}
        renderItem={renderItem}
        renderSection={renderSection}
        ref={largeListRef}
        sectionHeight={sectionHeight}
        indexHeight={indexHeight}
        renderHeader={showHeader ? renderHeader : undefined}
        onRefresh={onRefresh}
        data={data}
      />
      {indexArray && (
        <IndexBar
          showPopover
          style={[{ top: topOffset }, indexBarBoxStyle]}
          data={indexArray}
          onPress={index => onSectionSelect(index)}
        />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  box: { flex: 1 },
});
