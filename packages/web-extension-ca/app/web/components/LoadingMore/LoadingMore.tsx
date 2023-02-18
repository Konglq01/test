import { DotLoading, InfiniteScroll } from 'antd-mobile';
import { useTranslation } from 'react-i18next';

export interface ILoadingMoreProps {
  hasMore?: boolean;
  loadingText?: string;
  noDataText?: string;
  loadMore: (isRetry?: boolean) => Promise<void>;
}

export default function LoadingMore({
  hasMore = false,
  loadingText = 'Loading',
  noDataText = 'No Data',
  loadMore,
}: ILoadingMoreProps) {
  const { t } = useTranslation();

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
