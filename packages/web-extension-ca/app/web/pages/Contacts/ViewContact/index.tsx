import { Button, message } from 'antd';
import { useLocation, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import BackHeader from 'components/BackHeader';
import CustomSvg from 'components/CustomSvg';
import { AddressItem } from '@portkey-wallet/types/types-ca/contact';
import { useCopyToClipboard } from 'react-use';
import './index.less';
import { useCallback } from 'react';
import { useWalletInfo } from 'store/Provider/hooks';

export default function ViewContact() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { name, addresses, index } = state;
  const [, setCopied] = useCopyToClipboard();
  const { currentNetwork } = useWalletInfo();

  const handleCopy = useCallback(
    (v: string) => {
      setCopied(v);
      message.success(t('Copy Success'));
    },
    [setCopied, t],
  );

  const showChain = useCallback(
    (chainId: string) =>
      `${chainId.toLocaleLowerCase() === 'aelf' ? 'MainChain' : 'SideChain'} ${chainId} ${
        currentNetwork.toLocaleLowerCase() === 'testnet' ? 'Testnet' : ''
      }`,
    [currentNetwork],
  );

  return (
    <div className="view-contact-frame">
      <div className="view-contact-title">
        <BackHeader
          title={t('Contacts')}
          leftCallBack={() => {
            navigate('/setting/contacts');
          }}
          rightElement={
            <CustomSvg
              type="Close2"
              onClick={() => {
                navigate('/setting/contacts');
              }}
            />
          }
        />
      </div>
      <div className="contact-item-title">
        <div className="flex-center contact-item-icon">{index}</div>
        <div className="contact-item-name">{name}</div>
      </div>
      <div className="contact-item-body">
        <Button
          type="primary"
          htmlType="submit"
          onClick={() => {
            navigate('/setting/contacts/edit', { state: state });
          }}>
          {t('Edit')}
        </Button>
        <div className="contact-item-addresses">
          {addresses.map((ads: AddressItem, index: number) => (
            <div className="flex-between address-item" key={index}>
              <div>
                <div className="address">{`ELF_${ads?.address}_${ads?.chainId}`}</div>
                <div className="chain">{showChain(ads.chainId)}</div>
              </div>
              <CustomSvg onClick={() => handleCopy(ads?.address)} type="Copy" className="address-copy-icon" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
