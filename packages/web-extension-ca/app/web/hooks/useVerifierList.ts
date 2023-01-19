import { useEffect } from 'react';
import { useAppDispatch } from 'store/Provider/hooks';
import { setVerifierListAction } from '@portkey/store/store-ca/guardians/actions';
import { getVerifierList } from 'utils/sandboxUtil/getVerifierList';
import { useCurrentChain } from '@portkey/hooks/hooks-ca/chainList';
import { message } from 'antd';
import { useCurrentNetworkInfo } from '@portkey/hooks/hooks-ca/network';

const useVerifierList = () => {
  const dispatch = useAppDispatch();
  const currentChain = useCurrentChain('AELF');
  const currentNetwork = useCurrentNetworkInfo();
  useEffect(() => {
    console.log(currentChain, 'currentChain===');
    // message.error('Could not find chain information')
    if (!currentChain) return;
    getVerifierList({
      rpcUrl: currentChain.endPoint,
      address: currentChain.caContractAddress,
      chainType: currentNetwork.walletType,
    })
      .then((res) => {
        console.log(res, 'getVerifierList===');
        const verifierList = res.result.verifierList?.map((item: any) => ({
          ...item,
          url: item.endPoints[0],
        }));
        dispatch(setVerifierListAction(verifierList));
      })
      .catch((err) => {
        console.error(err, 'useVerifierList===error');
      });
  }, [currentChain, currentNetwork, dispatch]);
};

export default useVerifierList;
