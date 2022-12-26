import InternalMessage from 'messages/InternalMessage';
import InternalMessageTypes from 'messages/InternalMessageTypes';
import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import errorHandler from 'utils/errorHandler';
import querystring from 'query-string';
import './index.less';
import { useNetwork } from 'store/Provider/hooks';
import { ChainItemType } from '@portkey/types/chain';
import { Button } from 'antd';
import { useDispatch } from 'react-redux';
import { setCurrentChain } from '@portkey/store/network/actions';
import CustomSvg from 'components/CustomSvg';
import { useTranslation } from 'react-i18next';

export default function SwitchChain() {
  const { t } = useTranslation();
  const { search } = useLocation();
  const [appInfo, setAppInfo] = useState<{
    appName?: string;
    appLogo?: string;
    appHref?: string;
  }>();
  const { currentChain, chainList } = useNetwork();
  const [toChain, setToChain] = useState<ChainItemType>();
  const dispatch = useDispatch();

  useEffect(() => {
    try {
      const data = JSON.parse(querystring.parse(search).detail);
      const { rpcUrl, appLogo, appHref } = data;
      if (!rpcUrl) throw '';
      const chain = chainList.find((item) => item.rpcUrl === rpcUrl);
      if (!chain) throw '';
      setToChain(chain);
      if (!appHref) throw '';
      setAppInfo({
        appLogo,
        appHref,
      });
    } catch (error) {
      InternalMessage.payload(InternalMessageTypes.CLOSE_PROMPT, {
        closeParams: { ...errorHandler(400001, error) },
      }).send();
    }
  }, [chainList, search]);

  const approveHandler = useCallback(() => {
    if (!toChain) return;
    dispatch(setCurrentChain(toChain));
    InternalMessage.payload(InternalMessageTypes.CLOSE_PROMPT, {
      closeParams: {
        ...errorHandler(0),
        data: {
          chainId: toChain.chainId,
          chainType: toChain.chainType,
          rpcUrl: toChain.rpcUrl,
          blockExplorerURL: toChain.blockExplorerURL,
          nativeCurrency: toChain.nativeCurrency,
        },
      },
    }).send();
  }, [dispatch, toChain]);

  return (
    <div className="dapp-modal switch-chain-wrapper">
      <div className="chain-wrap">
        <span className="status" />
        <span className="network-name">{currentChain.networkName}</span>
      </div>
      <div className="dapp-info-wrap">
        {appInfo?.appLogo ? <img src={appInfo.appLogo} /> : <CustomSvg type="Aelf" />}
        <span>{appInfo?.appHref}</span>
      </div>
      <div className="tips-wrap">
        <p className="primary">{t('Allow This Site to Switch Networks?')}</p>
        <p className="secondary">{t('This will switch the selected network within Portkey to a new network:')}</p>
      </div>
      <div className="switch-wrap">
        <div className="chain">
          <CustomSvg type="Aelf" />
          <p>{currentChain.networkName}</p>
        </div>
        <div className="link">
          <CustomSvg type="Oval" />
          <div className="line" />
        </div>
        <div className="chain">
          <CustomSvg type="Aelf" />
          <p>{toChain?.networkName}</p>
        </div>
      </div>
      <div className="btn-wrap">
        <Button
          onClick={() => {
            InternalMessage.payload(InternalMessageTypes.CLOSE_PROMPT, {
              closeParams: {
                ...errorHandler(700001, 'reject'),
              },
            }).send();
          }}>
          {t('Cancel')}
        </Button>
        <Button disabled={!toChain} type="primary" onClick={approveHandler}>
          {t('Switch Network')}
        </Button>
      </div>
    </div>
  );
}
