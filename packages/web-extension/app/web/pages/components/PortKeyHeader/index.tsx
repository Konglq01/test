import { message } from 'antd';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector, useCommonState, useLoading } from 'store/Provider/hooks';
import ManageNetwork, { ManageNetworkInstance } from '../ManageNetwork';
import {
  setCurrentChain,
  fetchChainListAsync,
  CustomChain,
  CommonListAction,
} from '@portkey-wallet/store/network/actions';
import { BasicContracts, UpdateChainListType } from '@portkey-wallet/types/chain';
import ChainSelect from 'components/ChainSelect';
import SandboxEventService, { SandboxErrorCode } from 'service/SandboxEventService';
import SandboxEventTypes from 'messages/SandboxEventTypes';
import { checkRpcUrlFormat } from '@portkey-wallet/store/network/utils';
import CustomSvg from 'components/CustomSvg';
import AElf from 'aelf-sdk';
import './index.less';

interface PortKeyHeaderProps {
  onUserClick?: (e?: any) => void;
  customLogoShow?: boolean;
  manageNetworkShow?: boolean;
}

const PortKeyHeader = forwardRef(
  ({ onUserClick, customLogoShow = true, manageNetworkShow = true }: PortKeyHeaderProps, _ref) => {
    const [isManageChain, setIsManageChain] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const { isPrompt } = useCommonState();
    const [, setLoading] = useLoading();
    const networkRef = useRef<ManageNetworkInstance>();
    const { currentChain, chainList } = useAppSelector((state) => state.chain);
    const commonList = useMemo(() => chainList.filter((item) => item), [chainList]);

    const showManageNetwork = useCallback(() => {
      setIsManageChain(true);
    }, []);
    useImperativeHandle(_ref, () => ({ showManageNetwork }));

    console.log(currentChain, 'currentChain==');

    useEffect(() => {
      try {
        dispatch(fetchChainListAsync());
      } catch (error) {
        console.log(error);
      }
    }, [dispatch]);

    const ManageNetworkClose = useCallback(() => {
      setIsManageChain(false);
      networkRef.current?.resetDrawer();
    }, []);

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
          let basicContracts: BasicContracts;
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
            basicContracts = { tokenContract: tokenAddress };
            nativeCurrency = {
              name: 'ELF',
              symbol: 'ELF',
              decimals: 8,
              address: tokenAddress,
            };
            chain = Object.assign(chain, { nativeCurrency, basicContracts });
          }
          await dispatch(CustomChain[v.type](chain));
          resolve(true);
        }),
      [currentChain.chainType, dispatch],
    );

    const onUpdateNetwork = useCallback(
      async (v: UpdateChainListType, isChange?: boolean) => {
        try {
          setLoading(true);
          await formatNetworkData(v);
          if (isChange) {
            const ids = setTimeout(async () => {
              clearTimeout(ids);
              dispatch(CommonListAction.add({ rpcUrl: v.chain.rpcUrl }));
              dispatch(setCurrentChain({ rpcUrl: v.chain.rpcUrl }));
            }, 300);
          }
          ManageNetworkClose();
        } catch (error: any) {
          console.log(error, 'error===onUpdateNetwork');
          error.message && message.error(error.message);
        }
        setLoading(false);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [ManageNetworkClose, dispatch, formatNetworkData],
    );

    return (
      <>
        <div className={isPrompt ? 'prompt-portkey-header' : 'portkey-header'}>
          <div className="portkey-header-body">
            <div className="porkey-area">
              <CustomSvg type="PortKey" className="portkey-logo" />
              {isPrompt && <div className="portkey-label">PORTKEY</div>}
            </div>
            {manageNetworkShow && (
              <div className="chain-select">
                <ChainSelect
                  currentChain={currentChain}
                  chainList={commonList}
                  onChainChange={(chain) => dispatch(setCurrentChain(chain))}
                  onChainRemove={(chain) => dispatch(CustomChain.remove(chain))}
                  onManageChain={() => setIsManageChain(true)}
                />
              </div>
            )}

            {customLogoShow && <CustomSvg className="custom-logo" type="Settings" onClick={onUserClick} />}
          </div>
        </div>
        <ManageNetwork
          ref={networkRef}
          open={isManageChain}
          currentChain={currentChain}
          chainList={chainList}
          onClose={ManageNetworkClose}
          onUpdateNetwork={onUpdateNetwork}
          onAddCommon={(v) => dispatch(CommonListAction.add({ rpcUrl: v.rpcUrl }))}
          onRemoveCommon={(v) => dispatch(CommonListAction.remove({ rpcUrl: v.rpcUrl }))}
        />
      </>
    );
  },
);

export default PortKeyHeader;

export interface PortKeyHeaderInstance {
  showManageNetwork: () => void;
}
