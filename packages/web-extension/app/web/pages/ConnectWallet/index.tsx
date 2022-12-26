import CustomSvg from 'components/CustomSvg';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router';
import { useWalletInfo } from 'store/Provider/hooks';
import qs from 'query-string';
import InternalMessage from 'messages/InternalMessage';
import InternalMessageTypes from 'messages/InternalMessageTypes';
import errorHandler from 'utils/errorHandler';
import { Button, Checkbox, Divider } from 'antd';
import type { CheckboxChangeEvent, CheckboxOptionType } from 'antd/es/checkbox';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import './index.less';
import { addressFormat } from '@portkey/utils';
import { useNetwork } from '@portkey/hooks/network';
import { useTranslation } from 'react-i18next';
const CheckboxGroup = Checkbox.Group;

export default function ConnectWallet() {
  const { t } = useTranslation();
  const { search } = useLocation();
  const [appInfo, setAppInfo] = useState<{
    appName?: string;
    appLogo?: string;
    appHref?: string;
  }>();
  const { accountList, currentAccount } = useWalletInfo();
  const [checkedList, setCheckedList] = useState<CheckboxValueType[]>(
    currentAccount?.address ? [currentAccount.address] : [],
  );
  const [indeterminate, setIndeterminate] = useState(true);
  const [checkAll, setCheckAll] = useState(false);
  const { currentChain } = useNetwork();
  const { chainId, chainType } = currentChain;

  const plainOptions: CheckboxOptionType[] | undefined = useMemo(
    () =>
      accountList?.map((account) => ({
        label: (
          <div className="account">
            <p className="name">{account.accountName}</p>
            <p className="address">
              {addressFormat(`${account.address.slice(0, 9)}...${account.address.slice(-11)}`, chainId, chainType)}
            </p>
          </div>
        ),
        value: account.address,
      })),
    [accountList, chainId, chainType],
  );

  useEffect(() => {
    try {
      const data = JSON.parse(qs.parse(search).detail);
      const { appName, appLogo, appHref } = data;
      setAppInfo({
        appName: appName || '',
        appLogo,
        appHref,
      });
    } catch (error) {
      console.log('error', error);
      InternalMessage.payload(InternalMessageTypes.CLOSE_PROMPT, {
        closeParams: { ...errorHandler(400001, error) },
      }).send();
    }
  }, [search]);

  const onChange = useCallback(
    (list: CheckboxValueType[]) => {
      if (!plainOptions) return;
      setCheckedList(list);
      setIndeterminate(!!list.length && list.length < plainOptions.length);
      setCheckAll(list.length === plainOptions?.length ?? 0);
    },
    [plainOptions],
  );

  const onCheckAllChange = useCallback(
    (e: CheckboxChangeEvent) => {
      if (!plainOptions) return;
      setCheckedList(e.target.checked ? plainOptions.map((a) => a.value) : []);
      setIndeterminate(false);
      setCheckAll(e.target.checked);
    },
    [plainOptions],
  );

  const approveHandler = useCallback(() => {
    InternalMessage.payload(InternalMessageTypes.CLOSE_PROMPT, {
      closeParams: {
        ...errorHandler(0),
        data: checkedList,
      },
    }).send();
  }, [checkedList]);

  return (
    <div className="dapp-modal connect-modal">
      <div className="dapp-info-wrap">
        {appInfo?.appLogo ? <img src={appInfo.appLogo} /> : <CustomSvg type="Aelf" />}
        <span>{appInfo?.appHref}</span>
      </div>
      <div className="title">
        <h1>{t('Connect with Portkey')}</h1>
        <p>{t('Select the account(s) to use on this site')}</p>
      </div>
      {plainOptions && plainOptions.length > 1 ? (
        <div className="account-wrap">
          <Checkbox className="all-select" indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
            {t('Select All')}
          </Checkbox>
          <CheckboxGroup className="account-list" options={plainOptions} value={checkedList} onChange={onChange} />
        </div>
      ) : (
        <div className="account-wrap only-one-account">
          <div className="account">
            <p className="name">{accountList?.[0].accountName}</p>
            <p className="address">
              {addressFormat(
                `${accountList?.[0].address.slice(0, 9)}...${accountList?.[0].address.slice(-11)}`,
                chainId,
                chainType,
              )}
            </p>
          </div>
        </div>
      )}
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
        <Button type="primary" disabled={!checkedList.length} onClick={approveHandler}>
          {t('Approve')}
        </Button>
      </div>
      <p className="tip">{t('Only connect to sites that you trust.')}</p>
    </div>
  );
}
