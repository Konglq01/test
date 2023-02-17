import { DotLoading, InfiniteScroll } from 'antd-mobile';
import { useTranslation } from 'react-i18next';
import { useEffectOnce } from 'react-use';

export interface ILoadingMoreProps {
  hasMore?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  noDataText?: string;
  loadMore: (isRetry?: boolean) => Promise<void>;
}

export default function LoadingMore({
  hasMore = false,
  isLoading = false,
  loadingText = 'Loading',
  noDataText = 'No Data',
  loadMore,
}: ILoadingMoreProps) {
  const { t } = useTranslation();
  let ticking = false;

  const handleScroll: EventListener = (event) => {
    const target = event.target as Element;
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (target) {
          if (target.clientHeight === target.scrollHeight - target.scrollTop) {
            if (!isLoading) {
              loadMore();
            }
          }
        }
        ticking = false;
      });
      ticking = true;
    }
  };

  useEffectOnce(() => {
    const root = document.querySelector('#root');
    root?.addEventListener('scroll', handleScroll);
    return root?.removeEventListener('scroll', handleScroll);
  });

  return (
    <InfiniteScroll loadMore={loadMore} hasMore={hasMore}>
      {hasMore ? (
        <>
          <span>{t(loadingText)}</span>
          <DotLoading />
        </>
      ) : (
        <span>{t(noDataText)}</span>
      )}
    </InfiniteScroll>
  );
}
