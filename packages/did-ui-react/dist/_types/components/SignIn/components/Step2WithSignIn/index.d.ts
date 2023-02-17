/// <reference types="react" />
import { BaseGuardianItem } from '@portkey/store/store-ca/guardians/type';
import { ChainType } from '@portkey/types';
import { GuardiansApprovedType } from '@portkey/types/guardian';
import { LoginType } from '@portkey/types/types-ca/wallet';
import { VerifierItem } from '@portkey/types/verifier';
import { OnErrorFunc } from '../../../../types/error';
import { ChainInfoType } from '../../types';
import './index.less';
interface Step2WithSignInProps {
    sandboxId?: string;
    loginType: LoginType;
    serviceUrl: string;
    chainInfo?: ChainInfoType;
    chainType?: ChainType;
    isErrorTip?: boolean;
    guardianList?: BaseGuardianItem[];
    guardianAccount: string;
    verifierList?: VerifierItem[];
    approvedList?: GuardiansApprovedType[];
    onFinish?: (guardianList: GuardiansApprovedType[]) => void;
    onCancel?: () => void;
    onError?: OnErrorFunc;
}
declare function Step2WithSignIn({ sandboxId, loginType, serviceUrl, chainInfo, chainType, isErrorTip, verifierList, approvedList, guardianAccount, onFinish, onCancel, onError, }: Step2WithSignInProps): JSX.Element;
declare const _default: import("react").MemoExoticComponent<typeof Step2WithSignIn>;
export default _default;
