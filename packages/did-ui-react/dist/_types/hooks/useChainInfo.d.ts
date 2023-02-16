import { ChainInfoType } from '../components/SignIn/types';
import { OnErrorFunc } from '../types/error';
interface ChainInfoParams {
    baseUrl?: string;
    chainId: string;
    chainInfo?: ChainInfoType;
}
declare const useChainInfo: ({ baseUrl, chainInfo, chainId }: ChainInfoParams, onError?: OnErrorFunc) => ChainInfoType | undefined;
export default useChainInfo;
