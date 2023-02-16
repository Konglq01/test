/// <reference types="react" />
import { SetPinAndAddManagerProps } from '../../../SetPinAndAddManager/index.component';
import './index.less';
interface Step3Props extends SetPinAndAddManagerProps {
    onCancel?: () => void;
}
declare function Step3({ serviceUrl, chainId, loginType, guardianAccount, verificationType, guardianApprovedList, onFinish, onCancel, }: Step3Props): JSX.Element;
declare const _default: import("react").MemoExoticComponent<typeof Step3>;
export default _default;
