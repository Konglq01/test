import Loading from 'components/Loading';
import { useAppSelector } from 'store/Provider/hooks';
import './index.less';

export default function ScreenLoading() {
  const { isLoading } = useAppSelector((state) => state.userInfo);

  console.log(isLoading, 'isLoading===');
  return (
    <>
      {!!isLoading && (
        <div
          className="fix-max-content portkey-loading-wrapper"
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
