import { UserGuardianStatus } from '@portkey/store/store-ca/guardians/type';
import { OnErrorFunc } from '../../types/error';
import './index.less';
export interface GuardianListProps {
    className?: string;
    guardianList?: UserGuardianStatus[];
    expiredTime?: number;
    serviceUrl: string;
    isErrorTip?: boolean;
    onError?: OnErrorFunc;
    onConfirm?: () => void;
    onSend?: (item: UserGuardianStatus, index: number) => void;
    onVerifying?: (item: UserGuardianStatus, index: number) => void;
}
export default function GuardianList({ className, serviceUrl, guardianList, expiredTime, isErrorTip, onError, onConfirm, onSend, onVerifying, }: GuardianListProps): JSX.Element;
