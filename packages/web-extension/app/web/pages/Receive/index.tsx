import { addressFormat } from '@portkey/utils';
import clsx from 'clsx';
import Copy from 'components/Copy';
import CustomSvg from 'components/CustomSvg';
import TitleWrapper from 'components/TitleWrapper';
import CustomSelectDrawer from 'pages/components/CustomSelectDrawer';
import QRCode from 'qrcode.react';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAppSelector, useCommonState, useNetwork, useWalletInfo } from 'store/Provider/hooks';
import { AccountType } from '@portkey/types/wallet';
import './index.less';
import PromptCommonPage from 'pages/components/PromptCommonPage';
import CustomSelectModal from 'pages/components/CustomSelectModal';
import { List } from 'antd';
import { unitConverter } from '@portkey/utils/converter';
import { ZERO } from '@portkey/constants/misc';
import { useTranslation } from 'react-i18next';

export default function Receive() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { accountList = [], currentAccount } = useWalletInfo();
  const { currentChain } = useNetwork();
  const [selectVal, setSelectVal] = useState<AccountType | undefined>(currentAccount);
  const [open, setOpen] = useState<boolean>(false);
  const { isPrompt } = useCommonState();
  const { balances } = useAppSelector((state) => state.tokenBalance);
  const getBalance = useCallback(
    (address: string) => balances?.[currentChain.rpcUrl]?.[address]?.ELF,
    [balances, currentChain.rpcUrl],
  );

  const receiveAddress = useMemo(() => {
    const address = selectVal?.address || currentAccount?.address || '';
    return addressFormat(address, currentChain.chainId, currentChain.chainType);
  }, [currentAccount?.address, currentChain.chainId, currentChain.chainType, selectVal]);

  const rightElement = useMemo(() => {
    return (
      <div>
        <CustomSvg onClick={() => navigate(-1)} type="Close2" style={{ width: 18, height: 18, cursor: 'pointer' }} />
      </div>
    );
  }, [navigate]);

  const SelectEle = useMemo(() => {
    if (isPrompt) {
      return (
        <CustomSelectModal
          open={open}
          dataSource={accountList}
          onClose={() => setOpen(false)}
          render={(item) => (
            <List.Item key={item.address}>
              <div
                className="account-unit"
                key={item.address}
                onClick={() => {
                  setSelectVal(item);
                }}>
                <div className="current-status">
                  {item.address === selectVal?.address && (
                    <CustomSvg type="TickGreen" style={{ width: 16, height: 16 }} />
                  )}
                </div>
                <div className="account-info">
                  <div className={clsx('name', item.accountType === 'Import' && 'imported')}>{item.accountName}</div>
                  <div className="amount">{`${unitConverter(
                    ZERO.plus(getBalance(item.address) ?? 0).div(Math.pow(10, 8)),
                  )} ELF`}</div>
                </div>
                <div className="imported">{item.accountType === 'Import' && <span>{t('IMPORTED')}</span>}</div>
              </div>
            </List.Item>
          )}
        />
      );
    }
    return (
      <CustomSelectDrawer
        open={open}
        height="224"
        maskClosable={true}
        placement="bottom"
        onClose={() => setOpen(false)}
        selectList={accountList}
        defaultValue={selectVal?.address}
        onChange={(v: AccountType) => {
          setSelectVal(v);
          setOpen(false);
        }}
      />
    );
  }, [accountList, getBalance, isPrompt, open, selectVal?.address]);

  return (
    <PromptCommonPage>
      <div className="receive-wrapper">
        <TitleWrapper leftElement rightElement={rightElement} />
        <div className="receive-content">
          <div
            onClick={() => setOpen(true)}
            className={clsx(['single-account', accountList.length > 1 && 'more-account'])}>
            <div className="name">{selectVal?.accountName}</div>
            {accountList.length > 1 && <CustomSvg type="Down" style={{ width: 13, height: 13 }} />}
          </div>
          {accountList.length > 1 && SelectEle}
          <p className="receive-tip">{t('Scan the QR code to receive')}</p>
          <QRCode value={receiveAddress} style={{ width: 140, height: 140 }} />
          <div className="receive-address">
            <div className="address">{receiveAddress}</div>
            <Copy className="copy-icon" toCopy={receiveAddress}></Copy>
          </div>
        </div>
      </div>
    </PromptCommonPage>
  );
}
