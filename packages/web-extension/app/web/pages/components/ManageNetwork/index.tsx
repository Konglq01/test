import { ChainItemType, UpdateChainListType } from '@portkey-wallet/types/chain';
import { DrawerProps } from 'antd';
import CustomSvg from 'components/CustomSvg';
import { forwardRef, useCallback, useImperativeHandle, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import BaseDrawer from '../BaseDrawer';
import NetworkEdit from '../NetworkEdit';
import NetworkList, { NetworksType } from '../NetworkList';
import SettingHeader from '../SettingHeader';
import './index.less';
import SearchInput from './SearchInput';

interface ManageNetworkProps extends DrawerProps {
  currentChain: ChainItemType;
  chainList: ChainItemType[];
  onUpdateNetwork: (v: UpdateChainListType, isChangeNetwork?: boolean) => void;
  onClose?: () => void;
  onAddCommon: (v: ChainItemType) => void;
  onRemoveCommon: (v: ChainItemType) => void;
}

enum NetworkStage {
  ManageNetwork,
  AddNetwork,
  ViewNetwork,
}

const ManageNetwork = forwardRef(
  (
    { currentChain, chainList, onUpdateNetwork, onClose, onAddCommon, onRemoveCommon, ...props }: ManageNetworkProps,
    _ref,
  ) => {
    const { t } = useTranslation();
    const [stage, setStage] = useState<NetworkStage>(NetworkStage.ManageNetwork);
    const [viewItem, setViewItem] = useState<ChainItemType>();
    const [searchVal, setSearchVal] = useState<{ search: string; list?: ChainItemType[] }>();
    const [activeTab, setActiveTab] = useState<NetworksType>(NetworksType.CommonNetwork);

    const title = useMemo(
      () => (
        <>
          {stage === NetworkStage.ManageNetwork && <div>{t('Manage Networks')}</div>}
          {stage === NetworkStage.AddNetwork && <div>{t('Add Network')}</div>}
          {stage === NetworkStage.ViewNetwork && <div>{viewItem?.networkName}</div>}
        </>
      ),
      [stage, t, viewItem?.networkName],
    );

    const resetDrawer = useCallback(() => {
      setStage(NetworkStage.ManageNetwork);
      setViewItem(undefined);
    }, []);

    useImperativeHandle(_ref, () => ({ resetDrawer }));

    const onCloseNetworkBrawer = useCallback(() => {
      if (stage === NetworkStage.AddNetwork || stage === NetworkStage.ViewNetwork) {
        setStage(NetworkStage.ManageNetwork);
      } else {
        onClose?.();
      }
      resetDrawer();
    }, [onClose, resetDrawer, stage]);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const onNetworkSearch = useCallback((search: string, list?: ChainItemType[]) => setSearchVal({ search, list }), []);

    const Item = useMemo(() => {
      let map: { [x: string]: ChainItemType[] } = {
        [NetworksType.CommonNetwork]: [],
        [NetworksType.Network]: [],
        [NetworksType.Custom]: [],
      };
      const CommonNetwork = map[NetworksType.CommonNetwork];
      const Network = map[NetworksType.Network];
      const Custom = map[NetworksType.Custom];
      chainList.forEach((item) => {
        if (item.isCommon) CommonNetwork.push(item);
        if (!item.isCustom) Network.push(item);
        if (item.isCustom) Custom.push(item);
        map = {
          [NetworksType.CommonNetwork]: CommonNetwork,
          [NetworksType.Network]: Network,
          [NetworksType.Custom]: Custom,
        };
      });
      return map;
    }, [chainList]);

    return (
      <BaseDrawer
        className="manage-network-wrapper"
        title={
          <>
            <div style={{ paddingBottom: stage === NetworkStage.ManageNetwork ? 0 : 26 }}>
              <SettingHeader
                title={title}
                rightElement={
                  <CustomSvg type="Close2" onClick={onCloseNetworkBrawer} style={{ width: 18, height: 18 }} />
                }
                leftCallBack={onCloseNetworkBrawer}
              />
            </div>
            {stage === NetworkStage.ManageNetwork && (
              <SearchInput dataSource={Item[activeTab]} onNetworkSearch={onNetworkSearch} />
            )}
          </>
        }
        placement="right"
        destroyOnClose
        {...props}>
        {stage === NetworkStage.ManageNetwork && (
          <NetworkList
            activeTab={activeTab}
            currentChain={currentChain}
            chainList={searchVal?.list ?? []}
            onSelect={(v) => {
              setStage(NetworkStage.ViewNetwork);
              setViewItem(v);
            }}
            onAddCommon={onAddCommon}
            onRemoveCommon={onRemoveCommon}
            onChange={(key) => setActiveTab(key as NetworksType)}
            onAdd={() => setStage(NetworkStage.AddNetwork)}
          />
        )}
        {stage === NetworkStage.AddNetwork && (
          <NetworkEdit
            type="edit"
            chainList={chainList}
            networkInfo={{ chainType: 'aelf' }}
            currentNetworkRpcUrl={currentChain.rpcUrl}
            onFinish={(v, isChangeNetwork) => {
              onUpdateNetwork(
                {
                  type: 'add',
                  chain: v,
                },
                isChangeNetwork,
              );
              onCloseNetworkBrawer();
            }}
          />
        )}
        {stage === NetworkStage.ViewNetwork && viewItem && (
          <NetworkEdit
            chainList={chainList}
            type="view"
            networkInfo={viewItem}
            currentNetworkRpcUrl={currentChain.rpcUrl}
            onFinish={(v, isChangeNetwork) => {
              try {
                onUpdateNetwork(
                  {
                    type: 'update',
                    chain: v,
                  },
                  isChangeNetwork,
                );
                onCloseNetworkBrawer();
              } catch (error) {
                console.log(error, 'onUpdateNetwork==');
              }
            }}
            onDelete={(v) =>
              onUpdateNetwork({
                type: 'remove',
                chain: v,
              })
            }
          />
        )}
      </BaseDrawer>
    );
  },
);

export default ManageNetwork;

export interface ManageNetworkInstance {
  resetDrawer: () => void;
}
