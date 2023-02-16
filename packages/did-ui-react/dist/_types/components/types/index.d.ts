import { CAInfoType } from '@portkey/types/types-ca/wallet';
import { WalletInfoType } from '@portkey/types/wallet';
export type CreateWalletType = 'SignUp' | 'Login' | 'LoginByScan';
export interface DIDWalletInfo {
    caInfo: CAInfoType;
    pin: string;
    walletInfo: WalletInfoType;
}
