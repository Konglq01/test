/// <reference types="react" />
import { LoginType } from '@portkey/types/types-ca/wallet';
import { VerifierItem } from '@portkey/types/verifier';
import { IVerifyInfo } from '../../../types/verify';
import { OnErrorFunc } from '../../../../types/error';
interface Step2WithSignUpProps {
    loginType: LoginType;
    verifierList?: VerifierItem[];
    guardianAccount: string;
    serviceUrl: string;
    isErrorTip?: boolean;
    onCancel?: () => void;
    onFinish?: (values: {
        verifier: VerifierItem;
    } & IVerifyInfo) => void;
    onError?: OnErrorFunc;
}
declare function Step2WithSignUp({ loginType, serviceUrl, isErrorTip, verifierList, guardianAccount, onFinish, onCancel, onError, }: Step2WithSignUpProps): JSX.Element;
declare const _default: import("react").MemoExoticComponent<typeof Step2WithSignUp>;
export default _default;
