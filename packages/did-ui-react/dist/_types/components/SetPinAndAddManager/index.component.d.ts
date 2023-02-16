import { LoginType, ManagerInfo } from '@portkey/types/types-ca/wallet';
import { WalletInfoType } from '@portkey/types/wallet';
import { VerificationType } from '@portkey/types/verifier';
import { GuardiansApprovedType } from '@portkey/types/guardian';
import { DIDWalletInfo } from '../types';
import { OnErrorFunc } from '../../types/error';
export interface SetPinAndAddManagerProps {
    serviceUrl: string;
    className?: string;
    loginType?: LoginType;
    privateKey?: string;
    chainId?: string;
    guardianAccount: string;
    verificationType: VerificationType;
    walletName?: string;
    guardianApprovedList: GuardiansApprovedType[];
    isErrorTip?: boolean;
    onError?: OnErrorFunc;
    onAddManager?: (result: {
        managerInfo: ManagerInfo;
        pin: string;
        walletInfo: WalletInfoType;
    }) => void;
    onFinish?: (values: DIDWalletInfo) => void;
}
export default function SetPinAndAddManager({ serviceUrl, chainId, className, loginType, privateKey, walletName, guardianAccount, verificationType, guardianApprovedList, isErrorTip, onError, onFinish, onAddManager, }: SetPinAndAddManagerProps): JSX.Element;
