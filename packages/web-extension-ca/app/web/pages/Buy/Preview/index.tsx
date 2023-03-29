import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Modal } from 'antd';
import BackHeader from 'components/BackHeader';
import CustomSvg from 'components/CustomSvg';
import { useNavigate } from 'react-router';
import './index.less';

export default function Preview() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const showModal = useCallback(() => {
    return Modal.info({
      open: true,
      width: 320,
      className: 'disclaimer-modal',
      okText: t('OK'),
      icon: null,
      closable: false,
      centered: true,
      title: (
        <div className="flex-column-center">
          <div className="title">{t('Disclaimer')}</div>
          <div className="content">
            {t(
              'AlchemyPay is a fiat-to-crypto platform independently operated by a third-party entity. Portkey shall not be held liable for any loss or damage suffered as a result of using AlchemyPay service. ',
            )}
          </div>
        </div>
      ),
    });
  }, [t]);

  return (
    <div className="preview-frame">
      <div className="preview-title">
        <BackHeader
          title={t('Buy')}
          leftCallBack={handleBack}
          rightElement={<CustomSvg type="Close2" onClick={handleBack} />}
        />
      </div>
      <div className="preview-content">
        <div className="transaction flex-column-center">
          <div className="send">
            <span className="amount">1735</span>
            <span className="currency">USD</span>
          </div>
          <div className="receive">I will receive ≈ 234.23 USD</div>
        </div>
        <div className="card">
          <div className="label">Service provider</div>
          <div className="card-item flex-column">
            <div className="flex-between-center ach">
              <CustomSvg type="BuyAch" />
              <div className="rate">1 ELF = 0.3333 USD</div>
            </div>
            <div className="ach-pay">{/* <CustomSvg type="XXX" /> */}</div>
          </div>
        </div>
        <div className="disclaimer">
          <span>
            Proceeding with this transaction means that you have read and understood
            <span className="highlight" onClick={showModal}>
              &nbsp;the Disclaimer
            </span>
            .
          </span>
        </div>
      </div>
      <div className="preview-footer">
        <Button type="primary" htmlType="submit">
          {t('Go to AlchemyPay')}
        </Button>
      </div>
    </div>
  );
}
