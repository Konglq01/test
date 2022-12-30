import { useCurrentNetworkInfo } from './network';
import { useMemo, useCallback } from 'react';
import { searchCAHolderManagerInfo, searchLoginGuardianType } from '@portkey/graphql/contract/queries';
import type { LoginGuardianTypeDto } from '@portkey/graphql/contract/types';
import { sleep } from '@portkey/utils';
import { useCurrentWallet } from './wallet';
import { useCurrentChain } from './chainList';
// TODO
export const useCurrentWalletInfoByScan = () => {
  // searchCAHolderManagerInfo;
  // ucxifHkQcqob3zL3c2WppfEQn46oADEmm6bJdHsfNgX8ye2tw
  const { currentNetwork } = useCurrentWallet();
  const currentChain = useCurrentChain();
  const fetch = useCallback(async (manager: string): Promise<LoginGuardianTypeDto> => {
    // TODO
    const result = await searchCAHolderManagerInfo(currentNetwork, {
      // manager: 'ucxifHkQcqob3zL3c2WppfEQn46oADEmm6bJdHsfNgX8ye2tw',
      caHash: '0652fa31e555d70ad913a505a143bcda636d541c323cc8a58363def054149922',
      chainId: currentChain?.chainId || 'AELF',
    });
    console.log(result, 'useCurrentWalletInfoByScan==');
    if (!result.data.caHolderManagerInfo.length) {
      await sleep(3000);
      return fetch(manager);
    } else {
      const managerInfo = result.data.caHolderManagerInfo[0];
      const holderInfoResult = await searchLoginGuardianType(currentNetwork, {
        caHash: managerInfo.caHash,
        chainId: currentChain?.chainId || 'AELF',
      });
      const loginGuardianTypeInfo = holderInfoResult.data.loginGuardianTypeInfo[0];
      console.log(holderInfoResult, 'holderInfo===');
      return loginGuardianTypeInfo;
    }
  }, []);

  return fetch;
};
