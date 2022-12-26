import CustomSvg from 'components/CustomSvg';
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
                  backgroundColor: `rgb(255 255 255 / ${isLoading * 100}%)`,
                }
          }>
          <div>
            <CustomSvg className="loading" type="PortKey" />
            <div className="loading-text">Loading...</div>
          </div>
        </div>
      )}
    </>
  );
}
