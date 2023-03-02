import React, { useMemo } from 'react';
import TokenSection from '../TokenSection';
import NFTSection from '../NFTSection';
import CommonTopTab from 'components/CommonTopTab';

import { useLanguage } from 'i18n/hooks';
// import { useCurrentELFBalances } from '@portkey/hooks/hooks-ca/balances';
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
