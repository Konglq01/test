import TitleWrapper, { TitleWrapperProps } from 'components/TitleWrapper';
import './index.less';

export default function SecondPageHeader({ title }: TitleWrapperProps) {
  return <TitleWrapper className="second-page-header flex-start-center" title={title} leftElement={false} />;
}
