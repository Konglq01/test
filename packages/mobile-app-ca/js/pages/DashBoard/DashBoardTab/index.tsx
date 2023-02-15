import React, { useMemo } from 'react';
import TokenSection from '../TokenSection/index.';
import NFTSection from '../NFTSection/index.';
import CommonTopTab from 'components/CommonTopTab';

import { useLanguage } from 'i18n/hooks';
import { useCurrentELFBalances } from '@portkey/hooks/hooks-ca/balances';
import CommonButton from 'components/CommonButton';
import navigationService from 'utils/navigationService';
type DashBoardTabProps = {
  getAccountBalance?: () => void;
};

const DashBoardTab: React.FC<DashBoardTabProps> = (props: DashBoardTabProps) => {
  const { t } = useLanguage();
  const balance = useCurrentELFBalances(__DEV__);
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
  // if (__DEV__)
  //   return (
  //     <>
  //       <TextTitle selectable>{balance}</TextTitle>
  //       <CommonButton
  //         title="Home"
  //         onPress={() => {
  //           navigationService.navigate('Home');
  //         }}
  //       />
  //     </>
  //   );

  return <CommonTopTab hasTabBarBorderRadius tabList={tabList} />;
};
export default DashBoardTab;
