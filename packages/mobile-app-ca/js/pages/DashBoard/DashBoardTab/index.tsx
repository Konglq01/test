import React, { useMemo } from 'react';
import TokenSection from '../TokenSection/index.';
import NFTSection from '../NFTSection/index.';
import CommonTopTab from 'components/CommonTopTab';

import { useLanguage } from 'i18n/hooks';
// import { useCurrentELFBalances } from '@portkey-wallet/hooks/hooks-ca/balances';
type DashBoardTabProps = {
  getAccountBalance?: () => void;
};

const DashBoardTab: React.FC<DashBoardTabProps> = (props: DashBoardTabProps) => {
  const { t } = useLanguage();
  // const balance = useCurrentELFBalances(__DEV__);
  const tabList = useMemo(() => {
    return [
      {
        name: t('Tokens'),
        tabItemDom: <TokenSection {...props} />,
      },
      {
        name: t('NFTs'),
        tabItemDom: <NFTSection {...props} />,
      },
    ];
  }, [props, t]);

  return <CommonTopTab hasTabBarBorderRadius tabList={tabList} />;
};
export default DashBoardTab;
