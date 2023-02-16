import { TitleWrapperProps } from '../TitleWrapper';
import './index.less';
export default function BackHeader({ title, onBack, rightElement, ...props }: TitleWrapperProps & {
    onBack?: TitleWrapperProps['leftCallBack'];
}): JSX.Element;
