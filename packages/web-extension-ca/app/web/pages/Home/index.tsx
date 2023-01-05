import { Button, message } from 'antd';
import PortKeyHeader from 'pages/components/PortKeyHeader';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import MyBalance from './components/MyBalance';
import './index.less';
import './index.less';
import { addGuardian } from 'utils/sandboxUtil/addGuardian';
import { useCurrentNetworkInfo } from '@portkey/hooks/hooks-ca/network';
import { useCurrentChain } from '@portkey/hooks/hooks-ca/chainList';
import getPrivateKeyAndMnemonic from 'utils/Wallet/getPrivateKeyAndMnemonic';
import { useCurrentWallet } from '@portkey/hooks/hooks-ca/wallet';

export default function Home() {
  const navigate = useNavigate();
  const currentNetwork = useCurrentNetworkInfo();
  const currentChain = useCurrentChain();
  const wallet = useCurrentWallet();
  // 2A7tQJt8LgTPDvExTRSKdXQxgKWBcudSaUgBSkh7BPwxbHHMNw
  console.log(wallet, 'walletInfo==');
  const TestCode = (
    <Button
      onClick={async () => {
        // await InternalMessage.payload(InternalMessageTypes.SET_SEED, '11111111').send();
        const res = await getPrivateKeyAndMnemonic(
          {
            AESEncryptPrivateKey: wallet.walletInfo.AESEncryptPrivateKey,
          },
          '11111111',
        );
        if (!currentChain?.endPoint || !res?.privateKey) return message.error('error');
        const seed = await addGuardian({
          rpcUrl: currentChain.endPoint,
          chainType: currentNetwork.walletType,
          address: currentChain.caContractAddress,
          privateKey: '8aa27d601e2dfd823b5b94e83ff1ae43e7cc1f6fe51702ce33e1c98d39540d8f',
          paramsOption: [
            {
              caHash: '2045f9b4859d0b9eb6015ec90cabdfb31939ae19500ef0b9970aade32f310650',
              guardianToAdd: {
                guardianType: {
                  type: 0,
                  guardianType: 'hong.lin@aelf.io',
                },
                verifier: {
                  name: 'Verifier-002',
                  signature:
                    '4be2650fcc49f2e47c510a19b076a409c72e79ab128afcef66bdc934550cc1fe7a78d14fe9104d82f50ccd7fa2c7fe31517e8bb181b88dee48364e5f25414ba401',
                  verificationDoc:
                    '0,hong.lin@aelf.io,01/05/2023 10:09:27,2mBnRTqXMb5Afz4CWM2QakLRVDfaq2doJNRNQT1MXoi2uc6Zy3',
                },
              },
              guardiansApproved: [
                {
                  guardianType: {
                    type: 0,
                    guardianType: 'hong.lin@hoopox.com',
                  },
                  verifier: {
                    name: 'Verifier-002',
                    signature:
                      '38055b3a15df378571a5a19787dced9123ebbedfdb60b80dd533361e536b870000679977bbd8ecf691017678013f7622e5ac5a5fa303038a56692be6a8de06e301',
                    verificationDoc:
                      '0,hong.lin@hoopox.com,01/05/2023 10:09:45,2mBnRTqXMb5Afz4CWM2QakLRVDfaq2doJNRNQT1MXoi2uc6Zy3',
                  },
                },
              ],
            },
          ],
        });
        console.log(seed, 'Check==');
      }}>
      Check
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
