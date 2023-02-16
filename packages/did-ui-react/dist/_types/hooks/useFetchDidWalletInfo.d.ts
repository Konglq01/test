import { VerificationType } from '@portkey/types/verifier';
export default function useFetchDidWalletInfo(): ({ baseURL, sessionId, verificationType, }: {
    baseURL: string;
    managerAddress: string;
    sessionId: string;
    verificationType: VerificationType;
}) => Promise<import("@portkey/types/types-ca/wallet").CreateWalletResult>;
