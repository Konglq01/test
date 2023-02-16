import { CreateWalletType } from '../types';
import { NetworkItem } from '@portkey/types/types-ca/network';
import './index.less';
export interface LoginBaseProps {
    network?: string;
    networkList?: NetworkItem[];
    onLogin?: (value: string) => void;
    inputValidator?: (value?: string) => Promise<any>;
    onStep?: (value: CreateWalletType) => void;
    onNetworkChange?: (network: string) => void;
}
export default function LoginBase({ network, networkList, inputValidator, onLogin, onStep, onNetworkChange, }: LoginBaseProps): JSX.Element;
