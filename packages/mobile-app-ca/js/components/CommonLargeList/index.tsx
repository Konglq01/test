import React, { forwardRef, Ref } from 'react';
import { LargeList, LargeListPropType } from 'react-native-largelist';
export interface CommonLargeListProps
  extends Omit<LargeListPropType, 'heightForIndexPath' | 'renderIndexPath' | 'heightForSection'> {
  indexHeight: number;
  sectionHeight: number;
  renderItem: LargeListPropType['renderIndexPath'];
}

const CommonLargeList = forwardRef((props: CommonLargeListProps, forwardedRef: Ref<LargeList>) => {
  const { data, sectionHeight, indexHeight, renderItem, renderSection, ...listProps } = props;

  const listData = data?.[0]?.items ? data : [{ items: data }];
  return (
    <LargeList
      {...listProps}
      renderIndexPath={renderItem}
      renderSection={renderSection}
      ref={forwardedRef}
      heightForSection={() => sectionHeight}
      heightForIndexPath={() => indexHeight}
      data={Array.isArray(listData) ? listData : []}
    />
  );
});
CommonLargeList.displayName = 'CommonLargeList';
export default CommonLargeList;
