import { SetPinBaseProps } from '../../../SetPinBase/index.component';
import './index.less';
interface SetPinProps extends SetPinBaseProps {
    onCancel?: () => void;
}
export default function SetPin(props: SetPinProps): JSX.Element;
export {};
