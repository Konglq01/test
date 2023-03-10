import React, { forwardRef, Ref } from 'react';
import { LargeList, LargeListPropType } from 'react-native-largelist';
export interface CommonLargeListProps
  extends Omit<LargeListPropType, 'heightForIndexPath' | 'renderIndexPath' | 'heightForSection'> {
  indexHeight: number;
  sectionHeight: number;
  renderItem: LargeListPropType['renderIndexPath'];
}

const CommonLargeList = forwardRef((props: CommonLargeListProps, forwardedRef: Ref<LargeList>) => {
  const { data, sectionHeight, indexHeight, renderItem, onLoading, allLoaded, onRefresh, renderSection, renderHeader } =
    props;

  const listData = data?.[0]?.items ? data : [{ items: data }];
  return (
    <LargeList
      onLoading={onLoading}
      allLoaded={allLoaded}
      renderIndexPath={renderItem}
      renderSection={renderSection}
      ref={forwardedRef}
      heightForSection={() => sectionHeight}
      heightForIndexPath={() => indexHeight}
      renderHeader={renderHeader}
      onRefresh={onRefresh}
      data={Array.isArray(listData) ? listData : []}
    />
  );
});
CommonLargeList.displayName = 'CommonLargeList';
export default CommonLargeList;
