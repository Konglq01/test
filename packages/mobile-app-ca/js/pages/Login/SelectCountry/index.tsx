import { bottomBarHeight, screenHeight, windowHeight } from '@portkey-wallet/utils/mobile/device';
import React, { useCallback, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import countryCodeIndex from '@portkey-wallet/constants/constants-ca/countryCode/countryCodeIndex.json';
import Touchable from 'components/Touchable';
import CommonLargeList, { CommonLargeListProps } from './components/CommonLargeList';
import IndexBar from './components/IndexBar';
import { CountryItem } from '@portkey-wallet/constants/constants-ca';
import PageContainer from 'components/PageContainer';
const list = countryCodeIndex.map(i => ({ index: i[0] as string, items: i[1] as CountryItem[] }));
import GStyles from 'assets/theme/GStyles';
import { headerHeight as HeaderHeight } from 'components/CustomHeader/style/index.style';

export interface IndexLargeListProps extends CommonLargeListProps {
  data: Array<any>;
  headerHeight?: number;
  showHeader?: boolean;
  indexBarStyle?: ViewStyle;
  indexBarBoxStyle?: ViewStyle;
  indexTestStyle?: TextStyle;
  indexArray: Array<any>;
  upPullRefresh?: boolean;
}
function IndexLargeList(props: IndexLargeListProps) {
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
          if (data[i].items && Array.isArray(data[i].items)) itemKey = itemKey + data[i].items.length;
        }
        return itemKey * indexHeight + sectionKey * sectionHeight + hotHeight;
      }
      return 0;
    },
    [props],
  );
  const maxOffset = useMemo(() => {
    return getOffset(props.data?.length) - windowHeight + HeaderHeight + bottomBarHeight;
  }, [props.data?.length, getOffset]);
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
  } = props;
  const top_offset = 100;
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
        <View
          style={[
            styles.flatBox,
            {
              top: top_offset,
            },
            indexBarBoxStyle,
          ]}>
          <IndexBar data={indexArray} onPress={index => onSectionSelect(index)} />
        </View>
      )}
    </View>
  );
}

export default function SelectCountry() {
  const _renderItem = ({ section, row }: { section: number; row: number }) => {
    const item = list[section].items[row];
    return (
      <Touchable style={{ height: 40, backgroundColor: 'red' }}>
        <Text>{item.country}</Text>
      </Touchable>
    );
  };
  const _renderSection = (index: any) => {
    const contact = list[index];
    return (
      <View style={{ height: 20 }}>
        <Text>{typeof contact.index === 'string' ? contact.index : 'text'}</Text>
      </View>
    );
  };
  return (
    <PageContainer containerStyles={{ ...GStyles.paddingArg(0) }} scrollViewProps={{ disabled: true }}>
      <IndexLargeList
        sectionHeight={20}
        indexHeight={40}
        data={list}
        indexArray={countryCodeIndex.map(item => item[0])}
        renderItem={_renderItem}
        renderSection={_renderSection}
      />
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  box: {
    flex: 1,
  },
  flatBox: {
    position: 'absolute',
    right: 5,
  },
});
