import { fetchChainListAsync } from '@portkey-wallet/store/network/actions';
import { ChainItemType } from '@portkey-wallet/types/chain';
import ListComponent, { ListComponentInterface } from 'components/ListComponent';
import React, { memo, useRef } from 'react';
import { useAppDispatch } from 'store/hooks';
import ListEmptyComponent from '../ListEmptyComponent';
import NetworkItem from '../NetworkItem';
interface CommonScreenProps {
  networkList: ChainItemType[];
  isSearch?: boolean;
}
function CommonScreen({ networkList, isSearch }: CommonScreenProps) {
  const list = useRef<ListComponentInterface>();
  const dispatch = useAppDispatch();

  return (
    <ListComponent
      ref={list}
      upPullRefresh={async () => {
        await dispatch(fetchChainListAsync());
        list.current?.endUpPullRefresh();
      }}
      data={networkList}
      ListEmptyComponent={<ListEmptyComponent isSearch={isSearch} />}
      renderItem={({ item: chain }) => <NetworkItem chain={chain} isCommon />}
    />
  );
}

export default memo(CommonScreen);
