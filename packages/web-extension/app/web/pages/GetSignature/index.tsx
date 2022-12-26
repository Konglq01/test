import React, { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import querystring from 'query-string';
import { useNetwork } from 'store/Provider/hooks';
import InternalMessage from 'messages/InternalMessage';
import InternalMessageTypes from 'messages/InternalMessageTypes';
import errorHandler from 'utils/errorHandler';
import { Button } from 'antd';
import './index.less';
import CustomSvg from 'components/CustomSvg';
import { useTranslation } from 'react-i18next';

interface SignatureInfoType {
  hexToBeSign: string;
  account: string;
  appLogo?: string;
  appName: string;
  appHref: string;
  signature: string;
}

export default function GetSignature() {
  const { t } = useTranslation();
  const { search } = useLocation();
  const { currentChain, chainList } = useNetwork();
  const [signatureInfo, setSignatureInfo] = useState<SignatureInfoType>();
  const [appInfo, setAppInfo] = useState<{
    appName?: string;
    appLogo?: string;
    appHref?: string;
  }>();

  useEffect(() => {
    try {
      const data = JSON.parse(querystring.parse(search).detail);
      // const { appName, appLogo, appHref: origin, signedMsgString, account, hexToBeSign } = data;
      console.log(data, 'data--');
      setSignatureInfo(data);
      setAppInfo({
        appLogo: data.appLog,
        appHref: data.appHref,
      });
    } catch (error) {
      InternalMessage.payload(InternalMessageTypes.CLOSE_PROMPT, {
        closeParams: { ...errorHandler(400001, error) },
      }).send();
    }
  }, [chainList, search]);

  const approveHandler = useCallback(() => {
    if (!signatureInfo?.signature) return;
    InternalMessage.payload(InternalMessageTypes.CLOSE_PROMPT, {
      closeParams: {
        ...errorHandler(0),
        data: {
          signature: signatureInfo?.signature,
        },
      },
    }).send();
  }, [signatureInfo?.signature]);

  return (
    <div className="dapp-modal signature-modal">
      <div className="chain-wrap">
        <span className="status" />
        {currentChain.networkName}
      </div>
      <div className="dapp-info-wrap">
        {appInfo?.appLogo ? <img src={appInfo.appLogo} /> : <CustomSvg type="Aelf" />}
        <span>{appInfo?.appHref}</span>
      </div>
      <div className="tips-wrap">
        <p className="primary">{t('Sign Message')}</p>
        <p className="secondary">{t('You are requested to sign the following message')}</p>
      </div>
      <div className="detail-wrap">
        <h4>{t('Message')}</h4>
        <div className="params">
          <h5>String to be sign</h5>
          <p>{signatureInfo?.signature}</p>
          <h5>signature</h5>
          <p>{signatureInfo?.hexToBeSign}</p>
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
          {t('Reject')}
        </Button>
        <Button type="primary" disabled={!signatureInfo?.signature} onClick={approveHandler}>
          {t('Sign')}
        </Button>
      </div>
    </div>
  );
}
