import { VerifierItem } from '@portkey/types/verifier';
import { LoginType } from '@portkey/types/types-ca/wallet';
import { OnErrorFunc } from '../../types/error';
import './index.less';
export interface CodeVerifyProps {
    serviceUrl: string;
    verifier: VerifierItem;
    className?: string;
    loginType?: LoginType;
    isCountdownNow?: boolean;
    isLoginAccount?: boolean;
    guardianAccount: string;
    verifierSessionId: string;
    isErrorTip?: boolean;
    onError?: OnErrorFunc;
    onSuccess?: (res: {
        verificationDoc: string;
        signature: string;
        verifierId: string;
    }) => void;
}
export default function CodeVerify({ verifier, className, serviceUrl, isErrorTip, isCountdownNow, isLoginAccount, guardianAccount, loginType, verifierSessionId, onError, onSuccess, }: CodeVerifyProps): JSX.Element;
