import { ChainItemType } from '@portkey/types/chain';
import { Button, List, Modal, Tabs } from 'antd';
import CustomSvg from 'components/CustomSvg';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import './index.less';

export enum NetworksType {
  CommonNetwork = 'CommonNetwork',
  Network = 'Network',
  Custom = 'Custom',
}

interface NetworkListProps {
  currentChain: ChainItemType;
  chainList: ChainItemType[];
  activeTab: NetworksType;
  hideAddBtn?: boolean;
  onSelect: (v: ChainItemType) => void;
  onRemoveCommon: (v: ChainItemType) => void;
  onAddCommon: (v: ChainItemType) => void;
  onAdd?: () => void;
  onChange?: (activeKey: string) => void;
}

export default function NetworkList({
  currentChain,
  chainList,
  activeTab,
  hideAddBtn,
  onRemoveCommon,
  onAddCommon,
  onSelect,
  onChange,
  onAdd,
}: NetworkListProps) {
  const { t } = useTranslation();
  const actionIconRender = useCallback(
    (type: NetworksType, item: ChainItemType) => {
      if (type === NetworksType.CommonNetwork && !item.isFixed)
        return (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onRemoveCommon(item);
            }}>
            {t('Hide')}
          </Button>
        );

      if (item.isFixed) {
        return <CustomSvg type="LockFilled" style={{ width: 16, height: 16 }} />;
      }

      if (item.isCommon) {
        return (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onRemoveCommon(item);
            }}>
            {t('Hide')}
          </Button>
        );
      }

      return (
        <Button
          onClick={(e) => {
            e.stopPropagation();
            Modal.confirm({
              width: 320,
              content: (
                <>
                  <h3>{t('Add This Network?')}</h3>
                  <div className="network-name">
                    <CustomSvg type="Aelf" />
                    <p>{item.networkName}</p>
                  </div>
                  <div className="chain-info">
                    <p>
                      <span className="label">{t('Network Series')}</span>
                      <span className="value">{t('AELF Series')}</span>
                    </p>
                    <p>
                      <span className="label">{t('Name')}</span>
                      <span className="value">{item.networkName}</span>
                    </p>
                    <p>
                      <span className="label">{t('New RPC URL')}</span>
                      <span className="value">{item?.rpcUrl}</span>
                    </p>
                    <p>
                      <span className="label">{t('Chain ID')}</span>
                      <span className="value">{item.chainId}</span>
                    </p>
                    {!!item.blockExplorerURL && (
                      <p>
                        <span className="label">{t('Block Explorer URL')}</span>
                        <span className="value">{item.blockExplorerURL}</span>
                      </p>
                    )}
                  </div>
                </>
              ),
              className: 'add-network delete-modal',
              icon: null,
              centered: true,
              okText: t('Add'),
              cancelText: t('Cancel'),
              onOk: () => {
                onAddCommon(item);
              },
            });
          }}>
          {t('Add')}
        </Button>
      );
    },
    [onAddCommon, onRemoveCommon, t],
  );

  const listRender = useCallback(
    (chainList: ChainItemType[], type: NetworksType) => {
      const _dataSource = chainList.filter((item) => {
        let flag: boolean | undefined = true;
        if (type === NetworksType.CommonNetwork) flag = item.isCommon;
        if (type === NetworksType.Network) flag = true;
        if (type === NetworksType.Custom) flag = item.isCustom;
        return flag;
      });

      if (!_dataSource.length) {
        return (
          <div className="empty-list">
            <CustomSvg type="EmptyBox" style={{ width: 64, height: 64 }} />
            <div className="tip">{t('Add Network')}</div>
          </div>
        );
      }

      return (
        <List
          dataSource={_dataSource}
          renderItem={(item) => (
            <List.Item className="network-unit" onClick={() => onSelect(item)}>
              <div className="network-unit-info">
                <div className="icon">
                  <CustomSvg type="Aelf" style={{ width: 24, height: 24 }} />
                  {currentChain?.rpcUrl === item?.rpcUrl && (
                    <div className="current-chain">
                      <CustomSvg type="TickFilled" style={{ width: 16, height: 16 }} />
                    </div>
                  )}
                </div>
                <span className="name">{item.networkName}</span>
              </div>
              <div className="action">{actionIconRender(type, item)}</div>
            </List.Item>
          )}
        />
      );
    },
    [actionIconRender, currentChain?.rpcUrl, onSelect, t],
  );

  const TabsItem = useMemo(
    () => [
      {
        label: t('Favorites'),
        key: NetworksType.CommonNetwork,
      },
      {
        label: t('Networks'),
        key: NetworksType.Network,
      },
      {
        label: t('Custom'),
        key: NetworksType.Custom,
      },
    ],
    [t],
  );

  return (
    <div className="network-list">
      <Tabs activeKey={activeTab} onChange={onChange} items={TabsItem} />
      <div className="chain-list">{listRender(chainList, activeTab)}</div>
      {hideAddBtn || (
        <div className="network-action">
          <Button type="primary" onClick={onAdd}>
            {t('Add Network')}
          </Button>
        </div>
      )}
    </div>
  );
}
