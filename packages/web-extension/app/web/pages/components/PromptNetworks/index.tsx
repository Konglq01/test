import { CommonListAction, CustomChain, setCurrentChain } from '@portkey-wallet/store/network/actions';
import { checkRpcUrlFormat } from '@portkey-wallet/store/network/utils';
import { UpdateChainListType, ChainItemType } from '@portkey-wallet/types/chain';
import { Button, message } from 'antd';
import SandboxEventTypes from 'messages/SandboxEventTypes';
import { ReactNode, useCallback, useMemo, useState } from 'react';
import SandboxEventService, { SandboxErrorCode } from 'service/SandboxEventService';
import { useAppDispatch, useAppSelector } from 'store/Provider/hooks';
import PromptSettingColumn from '../PromptSettingColumn';
import AElf from 'aelf-sdk';
import './index.less';
import SearchInput from '../ManageNetwork/SearchInput';
import NetworkList, { NetworksType } from '../NetworkList';
import NetworkEdit from '../NetworkEdit';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { EditType } from 'types';
import { RequireAllOne, UpdateType } from '@portkey-wallet/types';

export default function PromptNetworks() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { currentChain, chainList } = useAppSelector((state) => state.chain);
  const [rightEle, setRightEle] = useState<ReactNode | undefined>(undefined);
  const [searchVal, setSearchVal] = useState<{ search: string; list?: ChainItemType[] }>();
  const [activeTab, setActiveTab] = useState<NetworksType>(NetworksType.CommonNetwork);

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

  const onNetworkSearch = useCallback((search: string, list?: ChainItemType[]) => setSearchVal({ search, list }), []);

  const formatNetworkData = useCallback(
    (v: UpdateChainListType) =>
      new Promise(async (resolve) => {
        if (v.type === 'remove') {
          await dispatch(CustomChain[v.type](v.chain));
          resolve(true);
          return;
        }
        let chain = { ...v.chain };
        let nativeCurrency = chain.nativeCurrency;

        if (chain.chainType === 'aelf') {
          const chainStatus = await checkRpcUrlFormat({
            rpcUrl: chain.rpcUrl,
            chainType: chain.chainType,
            chainId: chain.chainId,
          });
          const result = await SandboxEventService.dispatchAndReceive(SandboxEventTypes.callViewMethod, {
            rpcUrl: chain.rpcUrl,
            address: chainStatus.GenesisContractAddress,
            methodName: 'GetContractAddressByName',
            paramsOption: AElf.utils.sha256('AElf.ContractNames.Token'),
            chainType: currentChain.chainType,
          });
          // const result = await SandboxEventService.listen(dispatchKey);
          console.log(result, result.code, 'tokenAddress=====');
          if (result.code === SandboxErrorCode.error)
            throw Error(result?.message?.Error?.Message ?? result?.message ?? 'something error');
          const tokenAddress = result.message;

          nativeCurrency = {
            name: 'ELF',
            symbol: 'ELF',
            decimals: 8,
            address: tokenAddress,
          };
          chain = Object.assign(chain, { nativeCurrency });
        }
        await dispatch(CustomChain[v.type](chain));
        resolve(true);
      }),
    [currentChain.chainType, dispatch],
  );

  const onUpdateNetwork = useCallback(
    async (v: UpdateChainListType, isChange?: boolean) => {
      try {
        await formatNetworkData(v);
        if (isChange) {
          const ids = setTimeout(async () => {
            clearTimeout(ids);
            dispatch(CommonListAction.add({ rpcUrl: v.chain.rpcUrl }));
            dispatch(setCurrentChain({ rpcUrl: v.chain.rpcUrl }));
          }, 300);
        }
      } catch (error: any) {
        console.log(error, 'error===onUpdateNetwork');
        error.message && message.error(error.message);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, formatNetworkData],
  );

  const getEditEle = useCallback(
    (value: {
      type: EditType;
      networkInfo: RequireAllOne<Partial<ChainItemType>>;
      finishType: UpdateType;
      onDelete?: (v: any) => void;
    }) => {
      const { type, networkInfo, finishType, onDelete } = value;
      return (
        <NetworkEdit
          type={type}
          chainList={chainList}
          networkInfo={networkInfo}
          currentNetworkRpcUrl={currentChain.rpcUrl}
          onFinish={(v, isChangeNetwork) => {
            onUpdateNetwork(
              {
                type: finishType,
                chain: v,
              },
              isChangeNetwork,
            );
            setRightEle(undefined);
          }}
          onDelete={onDelete}
        />
      );
    },
    [chainList, currentChain.rpcUrl, onUpdateNetwork],
  );

  const header = (
    <div className="header">
      <p className="title">{t('Manage Networks')}</p>
      <Button
        onClick={() => {
          setRightEle(<></>);
          setTimeout(() => {
            const ele = getEditEle({
              type: 'edit',
              networkInfo: { chainType: 'aelf' },
              finishType: 'add',
            });
            setRightEle(ele);
          }, 0);
        }}>
        {t('Add Network')}
      </Button>
    </div>
  );

  return (
    <PromptSettingColumn
      className={clsx('prompt-networks', rightEle && 'with-right')}
      header={header}
      rightElement={rightEle}>
      <SearchInput dataSource={Item[activeTab]} onNetworkSearch={onNetworkSearch} />
      <NetworkList
        hideAddBtn
        activeTab={activeTab}
        currentChain={currentChain}
        chainList={searchVal?.list ?? []}
        onSelect={(v) => {
          setRightEle(<></>);
          setTimeout(() => {
            const ele = getEditEle({
              type: 'view',
              networkInfo: v,
              finishType: 'update',
              onDelete: (v) => {
                onUpdateNetwork({
                  type: 'remove',
                  chain: v,
                });
                setRightEle(undefined);
              },
            });
            setRightEle(ele);
          }, 0);
        }}
        onAddCommon={(v) => dispatch(CommonListAction.add({ rpcUrl: v.rpcUrl }))}
        onRemoveCommon={(v) => dispatch(CommonListAction.remove({ rpcUrl: v.rpcUrl }))}
        onChange={(key) => setActiveTab(key as NetworksType)}
      />
    </PromptSettingColumn>
  );
}
