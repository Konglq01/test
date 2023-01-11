import CustomSvg from 'components/CustomSvg';
import RegisterHeader from 'pages/components/RegisterHeader';
import { useParams } from 'react-router';
import LoginCard from './components/LoginCard';
import ScanCard from './components/ScanCard';
import SignCard from './components/SignCard';
import { useCurrentNetworkInfo, useNetworkList } from '@portkey/hooks/hooks-ca/network';
import { useCallback, useMemo } from 'react';
import './index.less';
import { useAppDispatch } from 'store/Provider/hooks';
import { changeNetworkType } from '@portkey/store/store-ca/wallet/actions';
import { NetworkType } from '@portkey/types';
import CommonSelect from 'components/CommonSelect1';
import { useChangeNetwork } from 'hooks/useChangeNetwork';
import i18n from 'i18n';
import { Button, message } from 'antd';
import { clearLocalStorage } from 'utils/storage/chromeStorage';

export default function RegisterStart() {
  const { type } = useParams();
  console.log(type, 'useParams===');
  const currentNetwork = useCurrentNetworkInfo();
  const dispatch = useAppDispatch();
  const networkList = useNetworkList();
  const changeNetwork = useChangeNetwork();

  const selectItems = useMemo(
    () =>
      networkList?.map((item) => ({
        value: item.networkType,
        icon: 'Aelf',
        label: item.name,
        disabled: !item.isActive,
      })),
    [networkList],
  );

  const networkChange = useCallback(
    (value: NetworkType) => {
      dispatch(changeNetworkType(value));
      const network = networkList.find((item) => item.networkType === value);
      network && changeNetwork(network);
    },
    [changeNetwork, dispatch, networkList],
  );

  return (
    <div>
      <RegisterHeader />
      <div className="flex-between register-start-content">
        <div className="text-content">
          <CustomSvg type="PortKey" />
          <h1>{i18n.t('Welcome to Portkey') as string}</h1>
        </div>
        <div>
          {type === 'create' && <SignCard />}
          {type === 'scan' && <ScanCard />}
          {(!type || type === 'login') && (
            <>
              <LoginCard />
              <div className="network-list-wrapper">
                <CommonSelect
                  className="network-list-select"
                  value={currentNetwork.networkType}
                  items={selectItems}
                  onChange={networkChange}
                  style={{ width: 366 }}
                  showArrow={false}
                  getPopupContainer={(triggerNode) => triggerNode.parentElement}
                />
              </div>
            </>
          )}
        </div>
      </div>
      <Button
        style={{ width: 500 }}
        onClick={async () => {
          await clearLocalStorage();
          message.success('clear');
          location.reload();
        }}>
        ClearStorage
      </Button>
    </div>
  );
}
