/**
 * @file
 *
 * First you have to configure networkList using ConfigProvider.setGlobalConfig
 */
import { ModalProps } from 'antd';
import { DIDWalletInfo } from '../types';
import { LoginType } from '@portkey/types/types-ca/wallet';
import { ChainInfoType } from './types';
import { OnErrorFunc } from '../../types/error';
import './index.less';
export interface SignInProps {
    chainId?: string;
    chainInfo?: ChainInfoType;
    loginType?: LoginType;
    sandboxId?: string;
    isErrorTip?: boolean;
    inputValidator?: (value?: string) => Promise<any>;
    onNetworkChange?: (network: string) => void;
    onFinish?: (didWallet: DIDWalletInfo) => void;
    open?: boolean;
    className?: string;
    getContainer?: ModalProps['getContainer'];
    onCancel?: () => void;
    onError?: OnErrorFunc;
}
export default function SignIn({ chainId, chainInfo, loginType, isErrorTip, sandboxId, inputValidator, open, className, getContainer, onNetworkChange, onCancel, onFinish, onError, }: SignInProps): JSX.Element;
