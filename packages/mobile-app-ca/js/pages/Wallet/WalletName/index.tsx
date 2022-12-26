import PageContainer from 'components/PageContainer';
import { useLanguage } from 'i18n/hooks';
import React, { useCallback, useEffect, useState } from 'react';
import { pageStyles } from './style';
import CommonButton from 'components/CommonButton';
import CommonInput from 'components/CommonInput';
import { ErrorType } from 'types/common';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { updateWalletNameAsync } from '@portkey/store/store-ca/wallet/actions';
import { INIT_HAS_ERROR } from 'constants/common';
import { isValidCAWalletName } from '@portkey/utils/reg';
import navigationService from 'utils/navigationService';
import CommonToast from 'components/CommonToast';

const WalletName: React.FC = () => {
  const { t } = useLanguage();
  const appDispatch = useAppDispatch();
  const { walletName } = useAppSelector(state => state.wallet);
  const [nameValue, setNameValue] = useState<string>('');
  const [nameError, setNameError] = useState<ErrorType>(INIT_HAS_ERROR);

  const onNameChange = useCallback((value: string) => {
    setNameValue(value);
    setNameError({ ...INIT_HAS_ERROR });
  }, []);

  useEffect(() => {
    setNameValue(walletName);
  }, [walletName]);

  const onSave = useCallback(async () => {
    const _nameValue = nameValue.trim();
    if (_nameValue === '') {
      setNameValue('');
      setNameError({
        isError: true,
        errorMsg: t('Please Enter Wallet Name'),
      });
      return;
    }
    if (!isValidCAWalletName(_nameValue)) {
      setNameError({ ...INIT_HAS_ERROR, errorMsg: t('only a-z, A-Z,0-9 and "_"allowed') });
      return;
    }

    const response = await appDispatch(updateWalletNameAsync(_nameValue));
    if (response.meta.requestStatus === 'fulfilled') {
      navigationService.goBack();
      CommonToast.success(t('Saved successful'), undefined, 'bottom');
    }
  }, [appDispatch, nameValue, t]);

  return (
    <PageContainer
      titleDom={t('Wallet Name')}
      safeAreaColor={['blue', 'gray']}
      containerStyles={pageStyles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <CommonInput
        type="general"
        value={nameValue}
        theme={'white-bg'}
        placeholder={t('Enter Wallet Name')}
        onChangeText={onNameChange}
        maxLength={16}
        errorMessage={nameError.errorMsg}
      />

      <CommonButton disabled={nameValue === ''} type="solid" onPress={onSave}>
        {t('Save')}
      </CommonButton>
    </PageContainer>
  );
};
export default WalletName;
