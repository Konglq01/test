import { useGetELFRateQuery } from '@portkey-wallet/store/rate/api';
import PromptCommonPage from 'pages/components/PromptCommonPage';
import { Transaction } from 'pages/Home/components/MyBalance';
import TransactionDetail from 'pages/Home/components/TransactionDetail';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useLocalStorage } from 'react-use';
import './index.less';

export default function TransactionDetailPage() {
  const [value, , remove] = useLocalStorage<Transaction>('TransactionDetail');
  const { data: rate } = useGetELFRateQuery({}, { pollingInterval: 1000 * 60 * 60 });
  const [transactionInfo, setTransactionInfo] = useState<Transaction>();
  const nav = useNavigate();

  useEffect(() => {
    if (value) {
      setTransactionInfo(value);
    } else {
      nav('/');
    }
  }, [nav, remove, value]);

  return (
    <PromptCommonPage>
      <div className="transaction-detail-page">
        <TransactionDetail
          rate={rate}
          info={transactionInfo}
          onClose={() => {
            remove();
            nav(-1);
          }}
        />
      </div>
    </PromptCommonPage>
  );
}
