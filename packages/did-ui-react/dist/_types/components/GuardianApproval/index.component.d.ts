import { ReactNode } from 'react';
import { BaseGuardianItem } from '@portkey/store/store-ca/guardians/type';
import { LoginType } from '@portkey/types/types-ca/wallet';
import { GuardiansApprovedType } from '@portkey/types/guardian';
import { OnErrorFunc } from '../../types/error';
import './index.less';
export interface GuardianApprovalProps {
    header?: ReactNode;
    loginType: LoginType;
    className?: string;
    serviceUrl: string;
    guardianList?: BaseGuardianItem[];
    isErrorTip?: boolean;
    onError?: OnErrorFunc;
    onConfirm?: (guardianList: GuardiansApprovedType[]) => void;
}
export default function GuardianApproval({ header, loginType, className, serviceUrl, guardianList, isErrorTip, onError, onConfirm, }: GuardianApprovalProps): JSX.Element;
