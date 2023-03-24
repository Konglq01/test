import { useCallback } from 'react';
import { useAppDispatch } from 'store/Provider/hooks';
import { resetSettings } from '@portkey-wallet/store/settings/slice';
import { resetNetwork } from '@portkey-wallet/store/network/actions';
import { resetWallet } from '@portkey-wallet/store/store-ca/wallet/actions';
import { resetToken } from '@portkey-wallet/store/token/slice';
import { resetGuardiansState } from '@portkey-wallet/store/store-ca/guardians/actions';
import { resetLoginInfoAction } from 'store/reducers/loginCache/actions';
import { clearAssets } from '@portkey-wallet/store/store-ca/assets/slice';
import { resetContactAction } from '@portkey-wallet/store/store-ca/contact/actions';
import { request } from '@portkey-wallet/api/api-did';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { getHolderInfoByContract } from 'utils/sandboxUtil/getHolderInfo';
import { useCurrentChain } from '@portkey-wallet/hooks/hooks-ca/chainList';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import { DefaultChainId } from '@portkey-wallet/constants/constants-ca/network-test1';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { ManagerInfo } from '@portkey-wallet/graphql/contract/__generated__/types';
import { handleErrorMessage } from '@portkey-wallet/utils';
import { message } from 'antd';

export default function useLogOut() {
  const dispatch = useAppDispatch();
  return useCallback(() => {
    try {
      dispatch(resetWallet());
      dispatch(resetToken());
      dispatch(resetSettings());
      dispatch(resetNetwork());
      dispatch(resetGuardiansState());
      dispatch(resetLoginInfoAction());
      dispatch(clearAssets());
      dispatch(resetContactAction());
      request.initService();
      setTimeout(() => {
        request.initService();
      }, 2000);
    } catch (error) {
      console.log(error, '====error');
    }
  }, [dispatch]);
}

export function useCheckManagerOnLogout() {
  const { caHash, address } = useCurrentWalletInfo();
  const chain = useCurrentChain(DefaultChainId);
  const network = useCurrentNetworkInfo();
  const logout = useLogOut();
  return useLockCallback(async () => {
    try {
      if (!chain) throw 'Can not get chain info';
      const info = await getHolderInfoByContract({
        rpcUrl: chain.endPoint,
        chainType: network.walletType,
        address: chain.caContractAddress,
        paramsOption: {
          caHash,
        },
      });
      if (info.result) {
        const { managerInfos } = info.result as { managerInfos: ManagerInfo[] };
        const isManager = managerInfos?.some((manager) => manager?.address === address);
        if (!isManager) logout();
      }
    } catch (error) {
      console.log(error, '======error');
      const msg = handleErrorMessage(error);
      message.error(msg);
    }
  }, [address, caHash, logout]);
}
