import CustomSvg from 'components/CustomSvg';
import { useLoading } from 'store/Provider/hooks';
import './index.less';

export default function ScreenLoading() {
  const [isLoading] = useLoading();
  return (
    <>
      {isLoading && (
        <div className="fix-max-content portkey-loading-wrapper">
          <div>
            <CustomSvg className="loading" type="PortKey" />
            <div className="loading-text">Loading...</div>
          </div>
        </div>
      )}
    </>
  );
}
