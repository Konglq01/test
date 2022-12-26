import CustomSvg from 'components/CustomSvg';
import './index.less';

export default function AboutUs() {
  return (
    <div className="flex-column-center about-us-drawer">
      <CustomSvg type="PortKey" style={{ width: 77.5, height: 80 }} />
      <span className="version">V1.0.0</span>
    </div>
  );
}
