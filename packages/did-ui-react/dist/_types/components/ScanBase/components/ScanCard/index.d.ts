/// <reference types="react" />
import './index.less';
interface ScanCardProps {
    isShowIcon?: boolean;
    qrData?: string;
    backIcon?: React.ReactNode;
    onBack?: () => void;
}
export default function ScanCard({ qrData, backIcon, isShowIcon, onBack }: ScanCardProps): JSX.Element;
export {};
