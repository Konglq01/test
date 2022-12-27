import { useEffect } from 'react';
import { useAppDispatch } from 'store/Provider/hooks';
import { setVerifierListAction } from '@portkey/store/store-ca/guardians/actions';
import { getVerifierList } from 'utils/sandboxUtil/getVerifierList';

const useVerifierList = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    getVerifierList({
      rpcUrl: 'http://192.168.67.77:8000',
      address: '2LUmicHyH4RXrMjG4beDwuDsiWJESyLkgkwPdGTR8kahRzq5XS',
      chainType: 'aelf',
    })
      .then((res) => {
        console.log(res, 'getVerifierList===');
        const verifierList = res.result.verifierList?.map((item: any) => ({
          name: item.name,
          url: item.endPoints[0],
          imageUrl: item.imageUrl,
        }));
        dispatch(setVerifierListAction(verifierList));
      })
      .catch((err) => {
        console.error(err, 'useVerifierList===error');
      });
  }, [dispatch]);
};

export default useVerifierList;
