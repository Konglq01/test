import Loading from '../Loading';
import { useEffect, useState, useCallback } from 'react';
import { eventBus } from '../../utils';
import { SET_GLOBAL_LOADING } from '../../constants/events';
import { OpacityType } from '@portkey/types';
import './index.less';

export default function ScreenLoading() {
  const [isLoading, setLoading] = useState<boolean | OpacityType>();

  const setLoadingHandler = useCallback((e: boolean | OpacityType) => setLoading(e), []);

  useEffect(() => {
    eventBus.addListener(SET_GLOBAL_LOADING, setLoadingHandler);
    return () => {
      eventBus.removeListener(SET_GLOBAL_LOADING, setLoadingHandler);
    };
  }, [setLoadingHandler]);

  return (
    <>
      {!!isLoading && (
        <div
          className="fix-max-content portkey-ui-loading-wrapper"
          style={
            typeof isLoading !== 'number'
              ? {}
              : {
                  backgroundColor: `rgb(00 00 00 / ${isLoading * 100}%)`,
                }
          }>
          <Loading />
          <div className="loading-text">Loading...</div>
        </div>
      )}
    </>
  );
}
