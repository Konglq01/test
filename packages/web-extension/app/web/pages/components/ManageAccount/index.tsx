import { AccountType } from '@portkey/types/wallet';
import { DrawerProps } from 'antd';
import CustomSvg from 'components/CustomSvg';
import { useGetELFRateQuery } from '@portkey/store/rate/api';
import './index.less';
import { useTranslation } from 'react-i18next';
interface ManageAccountProps extends DrawerProps {
  onCreate: () => void;
  onImport: () => void;
  onAccountClick: (v: AccountType) => void;
  accountList?: (AccountType & { balances: string; symbol: string })[];
  defaultValue?: AccountType;
}

export default function ManageAccount({
  accountList,
  onAccountClick,
  onCreate,
  onImport,
  defaultValue,
}: ManageAccountProps) {
  const { t } = useTranslation();
  const { data } = useGetELFRateQuery({}, { pollingInterval: 1000 * 60 * 60 });
  console.log('data :>> ', data);

  return (
    <div className="manage-account">
      <div className="manage-account-header">
        <span>{t('My Accounts')}</span>
      </div>
      <div className="manage-account-content">
        {accountList?.map((item) => (
          <div
            className="account-unit"
            key={item.address}
            onClick={(e) => {
              e.preventDefault();
              console.log('item :>> ', item);
              onAccountClick(item);
            }}>
            <div className="current-status">
              {item.address === defaultValue?.address && (
                <CustomSvg type="TickGreen" style={{ width: 16, height: 16 }} />
              )}
            </div>
            <div className="account-info">
              <div className="name">{item.accountName}</div>
              <div className="amount">{`${item.balances} ${item.symbol}`}</div>
            </div>
            <div className="imported">{item.accountType === 'Import' && <span>{t('IMPORTED')}</span>}</div>
          </div>
        ))}
      </div>
      <div className="manage-account-footer">
        <div className="btn" onClick={onCreate}>
          <CustomSvg type="Plus3" style={{ width: 16, height: 16 }} />
          <span>{t('Create Account')}</span>
        </div>
        <div className="btn" onClick={onImport}>
          <CustomSvg type="Import2" style={{ width: 16, height: 16 }} />
          <span>{t('Import Account')}</span>
        </div>
      </div>
    </div>
  );
}
