import { useCallback } from 'react';
import {
  getCAHolderByManager,
  getCAHolderManagerInfo,
  getLoginGuardianAccount,
} from '@portkey/graphql/contract/queries';
import { sleep } from '@portkey/utils';
import { useCurrentWallet } from './wallet';
import { useCurrentChain } from './chainList';
import type { LoginGuardianAccountDto } from '@portkey/graphql/contract/__generated__/types';
// TODO
export const useCurrentWalletInfoByScan = () => {
  // getCAHolderManagerInfo;
  // ucxifHkQcqob3zL3c2WppfEQn46oADEmm6bJdHsfNgX8ye2tw
  const { currentNetwork } = useCurrentWallet();
  const currentChain = useCurrentChain();
  const fetch = useCallback(async (manager: string): Promise<LoginGuardianAccountDto | null> => {
    // TODO
    const result = await getCAHolderByManager(currentNetwork, {
      manager: 'ucxifHkQcqob3zL3c2WppfEQn46oADEmm6bJdHsfNgX8ye2tw',
      chainId: currentChain?.chainId || 'AELF',
    });
    console.log(result, 'useCurrentWalletInfoByScan==');
    if (!result.caHolderManagerInfo.length) {
      await sleep(3000);
      return fetch(manager);
    } else {
      const managerInfo = result.caHolderManagerInfo[0];

      return managerInfo.loginGuardianAccountInfo[0];
      // console.log(holderInfoResult, 'holderInfo===');
      // return loginGuardianAccountInfo;
    }
  }, []);

  return fetch;
};
