import type { ChainChangeHandler, ChainItemType } from '@portkey-wallet/types/chain';
import { Button, Dropdown } from 'antd';
import CustomSvg from 'components/CustomSvg';
import { useCallback, useState } from 'react';
import { useCommonState } from 'store/Provider/hooks';
import ChainMenu from '../ChainMenu';
import './index.less';

export default function ChainSelect({
  chainList,
  currentChain,
  onChainRemove,
  onChainChange,
  onManageChain,
}: {
  currentChain: ChainItemType;
  chainList: ChainItemType[];
  onChainChange: ChainChangeHandler;
  onChainRemove: ChainChangeHandler;
  onManageChain: () => void;
}) {
  const { isPrompt } = useCommonState();
  const [visible, setVisible] = useState<boolean>(false);
  const onOpenChange = useCallback(() => {
    setVisible(!visible);
  }, [visible]);

  return (
    <Dropdown
      onOpenChange={onOpenChange}
      open={visible}
      trigger={['click']}
      placement={isPrompt ? 'bottom' : undefined}
      overlayClassName="network-dropdown"
      overlay={
        <ChainMenu
          onClose={() => setVisible(false)}
          initState={currentChain}
          chainList={chainList}
          onChainChange={onChainChange}
          onChainRemove={onChainRemove}
          onManageChain={onManageChain}
        />
      }>
      <Button className="trigger-btn" onClick={() => setVisible(true)}>
        <span className="status"></span>
        <span className="network-name">{currentChain.networkName}</span>
        <CustomSvg type="Down" style={{ width: 12, height: 12 }} />
      </Button>
    </Dropdown>
  );
}
