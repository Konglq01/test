import { ZERO } from '@portkey-wallet/constants/misc';
import { useGetELFRateQuery } from '@portkey-wallet/store/rate/api';
import { TokenItemType } from '@portkey-wallet/types/types-eoa/token';
import { unitConverter } from '@portkey-wallet/utils/converter';
import { Modal } from 'antd';
import CustomSvg from 'components/CustomSvg';
import DropdownSearch from 'components/DropdownSearch';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from 'store/Provider/hooks';
import checkMain from 'utils/util.isMain';
import './index.less';

interface CustomSelectProps {
  open?: boolean;
  selectList?: TokenItemType[];
  onChange?: (v: TokenItemType) => void;
  onClose?: () => void;
}

export default function CustomTokenModal({ open, selectList = [], onChange, onClose }: CustomSelectProps) {
  const { t } = useTranslation();
  const { currentAccount } = useAppSelector((state) => state.wallet);
  const { currentChain } = useAppSelector((state) => state.chain);
  const { balances } = useAppSelector((state) => state.tokenBalance);
  const { data } = useGetELFRateQuery({}, { pollingInterval: 1000 * 60 * 10 });
  const [openDrop, setOpenDrop] = useState<boolean>(false);
  const [filterWord, setFilterWord] = useState<string>('');
  const { netWorkType, chainId } = currentChain;
  const isMain = checkMain(netWorkType, chainId);

  function getBalance(token: TokenItemType) {
    return ZERO.plus(balances?.[currentChain.rpcUrl]?.[currentAccount?.address ?? '']?.[token.symbol] ?? 0).div(
      `1e${token.decimals}`,
    );
  }

  return (
    <Modal
      open={open}
      className="custom-token-modal"
      onCancel={onClose}
      width={320}
      closeIcon={<CustomSvg type="Close2" style={{ width: 18, height: 18 }} />}
      title={t('Select Asset')}
      footer={<></>}>
      <DropdownSearch
        overlayClassName="empty-dropdown"
        open={openDrop}
        overlay={<div className="empty-tip">{t('There is no search result.')}</div>}
        inputProps={{
          onBlur: () => setOpenDrop(false),
          onFocus: () => {
            if (filterWord && !selectList.length) setOpenDrop(true);
          },
          onChange: (e) => {
            const _value = e.target.value;
            if (!_value) setOpenDrop(false);

            setFilterWord(_value);
          },
          placeholder: t('Placeholder Token Name'),
        }}
      />
      <div className="list">
        {selectList.map((token) => (
          <div className="item" key={token.symbol} onClick={onChange?.bind(undefined, token)}>
            <div className="icon">
              {token.symbol === 'ELF' ? (
                <CustomSvg type="Aelf" />
              ) : (
                <div className="custom">{token.symbol.slice(0, 1)}</div>
              )}
            </div>
            <div className="amount">
              <p className="balance">{`${unitConverter(getBalance(token))} ${token.symbol}`}</p>
              {isMain && token.symbol === 'ELF' && (
                <p className="convert">{`$${unitConverter(getBalance(token).multipliedBy(data?.USDT || 0))} USD`}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}
