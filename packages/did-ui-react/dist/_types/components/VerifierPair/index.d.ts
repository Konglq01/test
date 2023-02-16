import { LoginType } from '@portkey/types/types-ca/wallet';
import './index.less';
interface VerifierPairProps {
    guardianType?: LoginType;
    verifierSrc?: string;
    wrapperClassName?: string;
    size?: number;
}
export default function VerifierPair({ guardianType, size, verifierSrc, wrapperClassName, }: VerifierPairProps): JSX.Element;
export {};
