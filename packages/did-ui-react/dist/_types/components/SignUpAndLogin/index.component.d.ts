import type { CreateWalletType, DIDWalletInfo } from '../types';
import { NetworkItem } from '@portkey/types/types-ca/network';
import { ChainInfoType } from '../SignIn/types';
import { OnErrorFunc } from '../../types/error';
import './index.less';
export interface SignUpAndLoginProps {
    type?: CreateWalletType;
    chainInfo?: ChainInfoType;
    sandboxId?: string;
    privateKey?: string;
    networkList?: NetworkItem[];
    defaultNetwork?: string;
    className?: string;
    isErrorTip?: boolean;
    onError?: OnErrorFunc;
    inputValidator?: (value?: string) => Promise<any>;
    onSignTypeChange?: (type: CreateWalletType) => void;
    onSuccess?: (value: string) => void;
    onFinish?: (walletInfo: DIDWalletInfo) => void;
    onNetworkChange?: (network: string) => void;
}
export default function SignUpAndLoginBaseCom({ type, sandboxId, className, chainInfo, privateKey, networkList, defaultNetwork, isErrorTip, onError, onSuccess, onFinish, inputValidator, onSignTypeChange, onNetworkChange, }: SignUpAndLoginProps): JSX.Element;
