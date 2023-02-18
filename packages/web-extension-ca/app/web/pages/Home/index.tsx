// import { Button, message } from 'antd';
import { DefaultChainId } from '@portkey/constants/constants-ca/network-test2';
import { useCurrentChain } from '@portkey/hooks/hooks-ca/chainList';
import { useCurrentNetworkInfo } from '@portkey/hooks/hooks-ca/network';
import { useCurrentWallet, useCurrentWalletInfo } from '@portkey/hooks/hooks-ca/wallet';
import { Button } from 'antd';
import PortKeyHeader from 'pages/components/PortKeyHeader';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useUserInfo } from 'store/Provider/hooks';
import { managerForwardCall } from 'utils/sandboxUtil/managerForwardCall';
import MyBalance from './components/MyBalance';
import aes from '@portkey/utils/aes';
import Aelf from 'aelf-sdk';
import './index.less';
// import { useCurrentChain } from '@portkey/hooks/hooks-ca/chainList';
// import { useCurrentWallet } from '@portkey/hooks/hooks-ca/wallet';
// import { useCurrentNetworkInfo } from '@portkey/hooks/hooks-ca/network';

export default function Home() {
  const navigate = useNavigate();
  const chainInfo = useCurrentChain(DefaultChainId);
  const wallet = useCurrentWallet();
  const currentNetwork = useCurrentNetworkInfo();
  const { passwordSeed } = useUserInfo();

  // 2A7tQJt8LgTPDvExTRSKdXQxgKWBcudSaUgBSkh7BPwxbHHMNw
  // console.log(wallet, 'walletInfo==');

  const TestCode = (
    <Button
      title="ManagerForwardCall Transfer"
      onClick={async () => {
        // intervalCrossChainTransfer();
        const chainId = 'AELF';
        console.log(Aelf.utils.chainIdConvertor.base58ToChainId(chainId), 'chainIdToBase58===');
        // if (!chainInfo || !passwordSeed) return;
        // const privateKey = aes.decrypt(wallet.walletInfo.AESEncryptPrivateKey, passwordSeed);
        // if (!privateKey) return;
        // const result = await managerForwardCall({
        //   rpcUrl: chainInfo.endPoint,
        //   chainType: currentNetwork.walletType,
        //   address: chainInfo.caContractAddress,
        //   privateKey,
        //   paramsOption: {
        //     caHash: wallet.walletInfo.AELF?.caHash || '',
        //     contractAddress: 'JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE',
        //     methodName: 'Transfer',
        //     args: {
        //       symbol: 'ELF',
        //       // to: '2PfWcs9yhY5xVcJPskxjtAHiKyNUbX7wyWv2NcwFJEg9iNfnPj',
        //       to: 'ELF_nn659b9X1BLhnu5RWmEUbuuV7J9QKVVSN54j9UmeCbF3Dve5D_AELF',
        //       amount: 1 * 10 ** 8,
        //       memo: 'transfer address1 to address2',
        //     },
        //   },
        // });
        // // const account = getManagerAccount(pin);
        // if (!account) return;
        // const contract = await getContractBasic({
        //   contractAddress: chainInfo.caContractAddress,
        //   rpcUrl: chainInfo.endPoint,
        //   account,
        // });
        // const req = await contract?.callSendMethod('ManagerForwardCall', '', {
        //   caHash: wallet.AELF?.caHash,
        //   contractAddress: 'JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE',
        //   methodName: 'Transfer',
        //   args: {
        //     symbol: 'ELF',
        //     // to: '2PfWcs9yhY5xVcJPskxjtAHiKyNUbX7wyWv2NcwFJEg9iNfnPj',
        //     to: 'ELF_nn659b9X1BLhnu5RWmEUbuuV7J9QKVVSN54j9UmeCbF3Dve5D_AELF',
        //     amount: 1 * 10 ** 8,
        //     memo: 'transfer address1 to address2',
        //   },
        // });
        // console.log(req, '======req');
      }}>
      ManagerForwardCall Transfer
    </Button>
  );

  const onUserClick = useCallback(() => {
    navigate(`/setting`);
  }, [navigate]);

  return (
    <div className="portkey-home">
      <PortKeyHeader onUserClick={onUserClick} />
      <div className="portkey-home-body">
        <MyBalance />
        {TestCode}
        {/* <SettingDrawer
          open={visible}
          onClose={() => setVisible(false)}
          onMenuClick={(router) => navigate(`/setting/${router}`)}
        /> */}
      </div>
    </div>
  );
}
