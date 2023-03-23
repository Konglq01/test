import clsx from 'clsx';
import TitleWrapper, { TitleWrapperProps } from 'components/TitleWrapper';
import './index.less';

export default function SecondPageHeader({ title, leftElement, leftCallBack, className }: TitleWrapperProps) {
  return (
    <TitleWrapper
      className={clsx(['second-page-header', 'flex-start-center', className])}
      title={title}
      leftElement={leftElement}
      leftCallBack={leftCallBack}
    />
  );
}
