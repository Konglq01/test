import CustomSvg from 'components/CustomSvg';
import { DrawerProps } from 'antd';
import BaseDrawer from '../BaseDrawer';
import { AccountType } from '@portkey/types/wallet';
import './index.less';
import { useCallback } from 'react';
import { useAppSelector } from 'store/Provider/hooks';
import { useNetwork } from '@portkey/hooks/network';
import { unitConverter } from '@portkey/utils/converter';
import { ZERO } from '@portkey/constants/misc';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

interface CustomSelectProps extends DrawerProps {
  defaultValue?: string;
  selectList?: AccountType[];
  onChange?: (v: AccountType) => void;
}

export default function CustomSelectDrawer({ defaultValue, selectList = [], onChange, ...props }: CustomSelectProps) {
  const { t } = useTranslation();
  const { currentChain } = useNetwork();
  const { balances } = useAppSelector((state) => state.tokenBalance);
  const getBalance = useCallback(
    (address: string) => balances?.[currentChain.rpcUrl]?.[address]?.ELF,
    [balances, currentChain.rpcUrl],
  );

  return (
    <BaseDrawer {...props} className="change-account-drawer">
      <div className="account-list">
        {selectList.map((item) => (
          <div
            className="account-unit"
            key={item.address}
            onClick={(e) => {
              e.preventDefault();
              onChange?.(item);
            }}>
            <div className="current-status">
              {item.address === defaultValue && <CustomSvg type="TickGreen" style={{ width: 16, height: 16 }} />}
            </div>
            <div className="account-info">
              <div className={clsx('name', item.accountType === 'Import' && 'imported')}>{item.accountName}</div>
              <div className="amount">{`${unitConverter(
                ZERO.plus(getBalance(item.address) ?? 0).div(Math.pow(10, 8)),
              )} ELF`}</div>
            </div>
            <div className="imported">{item.accountType === 'Import' && <span>{t('IMPORTED')}</span>}</div>
          </div>
        ))}
      </div>
    </BaseDrawer>
  );
}
