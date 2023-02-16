import { FormProps } from 'antd';
import './index.less';
export interface SetPinBaseProps {
    className?: string;
    onFinish?: (val: string) => void;
    onFinishFailed?: FormProps['onFinishFailed'];
}
export default function SetPinBase({ className, onFinish, onFinishFailed }: SetPinBaseProps): JSX.Element;
