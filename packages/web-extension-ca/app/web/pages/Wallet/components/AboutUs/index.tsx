import CustomSvg from 'components/CustomSvg';
import './index.less';

export default function AboutUs() {
  return (
    <div className="flex-column-center about-us-drawer">
      <CustomSvg type="PortKey" />
      <span className="version">V1.0.0</span>
    </div>
  );
}
