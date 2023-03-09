import CommonModal from 'components/CommonModal';
import React from 'react';
import { useCustomModal } from 'store/Provider/hooks';

export default function CountryCode() {
  const { countryCodeModal } = useCustomModal();
  return (
    <CommonModal className="country-code-modal" open={countryCodeModal}>
      CountryCode
    </CommonModal>
  );
}
