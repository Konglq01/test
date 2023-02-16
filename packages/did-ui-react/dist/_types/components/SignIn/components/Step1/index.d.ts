/// <reference types="react" />
import { SignUpAndLoginProps } from '../../../SignUpAndLogin/index.component';
import { CreateWalletType, DIDWalletInfo } from '../../../types';
export type OnSignInFinishedFun = (values: {
    isFinished: boolean;
    result: {
        type?: CreateWalletType;
        value: string | DIDWalletInfo;
    };
}) => void;
interface Step1Props extends SignUpAndLoginProps {
    onSignInFinished: OnSignInFinishedFun;
}
declare function Step1({ onSignInFinished, ...props }: Step1Props): JSX.Element;
declare const _default: import("react").MemoExoticComponent<typeof Step1>;
export default _default;
