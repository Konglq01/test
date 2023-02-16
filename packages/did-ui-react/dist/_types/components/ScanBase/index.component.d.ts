import { ReactNode } from 'react';
import { NetworkItem } from '@portkey/types/types-ca/network';
import { DIDWalletInfo } from '../types';
import { OnErrorFunc } from '../../types/error';
import './index.less';
export interface ScanBaseProps {
    chainId?: string;
    backIcon?: ReactNode;
    privateKey?: string;
    currentNetwork?: NetworkItem;
    isErrorTip?: boolean;
    onError?: OnErrorFunc;
    onBack?: () => void;
    onFinish?: (walletInfo: DIDWalletInfo) => void;
    onFinishFailed?: (errorInfo: any) => void;
}
export default function ScanBase({ chainId, backIcon, isErrorTip, privateKey, currentNetwork, onError, onBack, onFinish, onFinishFailed, }: ScanBaseProps): JSX.Element;
