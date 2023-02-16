/// <reference types="react" />
import { UserGuardianItem, UserGuardianStatus } from '@portkey/store/store-ca/guardians/type';
import { OnErrorFunc } from '../../../../types/error';
interface GuardianItemProps {
    disabled?: boolean;
    isExpired?: boolean;
    serviceUrl: string;
    item: UserGuardianStatus;
    isErrorTip?: boolean;
    onError?: OnErrorFunc;
    onSend?: (item: UserGuardianItem) => void;
    onVerifying?: (item: UserGuardianItem) => void;
}
declare function GuardianItems({ disabled, item, isExpired, serviceUrl, isErrorTip, onError, onSend, onVerifying, }: GuardianItemProps): JSX.Element;
declare const _default: import("react").MemoExoticComponent<typeof GuardianItems>;
export default _default;
