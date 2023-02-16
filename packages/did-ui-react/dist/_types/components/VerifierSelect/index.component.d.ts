import { LoginType } from '@portkey/types/types-ca/wallet';
import { VerifierItem } from '@portkey/types/verifier';
import { OnErrorFunc } from '../../types/error';
import './index.less';
export interface VerifierSelectProps {
    serviceUrl: string;
    verifierList?: VerifierItem[];
    defaultVerifier?: string;
    guardianAccount: string;
    className?: string;
    loginType?: LoginType;
    isErrorTip?: boolean;
    onError?: OnErrorFunc;
    onConfirm?: (result: {
        verifier: VerifierItem;
        verifierSessionId: string;
        endPoint: string;
    }) => void;
}
export default function VerifierSelect({ className, serviceUrl, isErrorTip, verifierList, guardianAccount, loginType, defaultVerifier, onError, onConfirm, }: VerifierSelectProps): JSX.Element;
