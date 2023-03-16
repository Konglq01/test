import CustomSvg from 'components/CustomSvg';
import './index.less';

export default function AboutUs() {
  return (
    <div className="flex-column-center about-us-drawer">
      <CustomSvg type="PortKey" />
      <span className="version">{process.env.SDK_VERSION?.toUpperCase()}</span>
    </div>
  );
}
