import { useCurrentNetwork } from '@portkey-wallet/hooks/network';
import { removeAccount, updateAccountName } from '@portkey-wallet/store/wallet/actions';
import { isWalletError } from '@portkey-wallet/store/wallet/utils';
import { AccountType } from '@portkey-wallet/types/wallet';
import { getExploreLink } from '@portkey-wallet/utils';
import { RouteProp, useRoute } from '@react-navigation/native';
import GStyles from 'assets/theme/GStyles';
import AccountCard from 'components/AccountCard';
import AccountOverlay from 'components/AccountOverlay';
import CommonButton from 'components/CommonButton';
import CommonInput from 'components/CommonInput';
import { TextL } from 'components/CommonText';
import CommonToast from 'components/CommonToast';
import PageContainer from 'components/PageContainer';
import Svg from 'components/Svg';
import Touchable from 'components/Touchable';
import { useAccountByAddress, useCredentials, useWallet } from 'hooks/store';
import i18n from 'i18n';
import { useLanguage } from 'i18n/hooks';
import React, { useCallback, useMemo, useState } from 'react';
import { View, Linking } from 'react-native';
import { useAppDispatch } from 'store/hooks';
import { isIos, windowHeight } from 'utils/device';
import navigationService from 'utils/navigationService';
import { pTd } from 'utils/unit';
import styles from './styles';
type RouterParams = RouteProp<{ params: { accountInfo: AccountType } }>;

export default function AccountDetails() {
  const { currentAccount } = useWallet();
  const { t } = useLanguage();
  const { params } = useRoute<RouterParams>();
  const { accountInfo } = params || {};
  const { blockExplorerURL } = useCurrentNetwork();
  const [accountName, setAccountName] = useState<string>();
  const credentials = useCredentials();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const tmpAccountInfo = useAccountByAddress(accountInfo.address);
  const account = useMemo(() => tmpAccountInfo || currentAccount, [currentAccount, tmpAccountInfo]);
  const isRemove = account && account.accountType !== 'Create';
  const onRemoveAccount = useCallback(() => {
    if (!account) return;
    AccountOverlay.showRemoveAccount({
      accountInfo: accountInfo,
      buttons: [
        { title: i18n.t('Never Mind'), type: 'outline' },
        {
          title: i18n.t('Remove'),
          type: 'primary',
          onPress: () => {
            if (!credentials) return;
            try {
              dispatch(
                removeAccount({
                  address: account.address,
                  password: credentials.password,
                }),
              );
              navigationService.goBack();
              CommonToast.success(i18n.t('Account Successfully Remove!'));
            } catch (error) {
              const message = isWalletError(error);
              message && CommonToast.fail(message);
            }
          },
        },
      ],
    });
  }, [account, accountInfo, credentials, dispatch]);
  const onUpdateAccountName = useCallback(() => {
    if (!credentials) return;
    setIsEdit(false);
    if (accountName && accountName !== account?.accountName) {
      try {
        dispatch(
          updateAccountName({
            address: accountInfo.address,
            accountName,
            password: credentials.password,
          }),
        );
      } catch (error) {
        setAccountName(undefined);
        const message = isWalletError(error);
        message && CommonToast.fail(message);
      }
    }
  }, [account?.accountName, accountInfo.address, accountName, credentials, dispatch]);
  return (
    <PageContainer
      leftDom
      titleDom
      containerStyles={styles.containerStyle}
      rightDom={
        <Touchable style={styles.closeBox} onPress={navigationService.goBack}>
          <Svg size={pTd(14)} icon="close" />
        </Touchable>
      }>
      <View style={[GStyles.itemCenter, { minHeight: windowHeight - pTd(isRemove ? 230 : 180) }]}>
        <View style={styles.editRow}>
          {isEdit ? (
            <View style={styles.inputRow}>
              <CommonInput
                autoFocus
                maxLength={30}
                value={accountName}
                onChangeText={setAccountName}
                defaultValue={account?.accountName}
                containerStyle={styles.accountContainerStyle}
                inputContainerStyle={styles.inputContainerStyle}
                inputStyle={styles.inputStyle}
                type="general"
                textAlign={isIos ? 'center' : 'left'}
              />
              <Touchable style={styles.finishBox} onPress={onUpdateAccountName}>
                <Svg icon="finish" size={pTd(16)} />
              </Touchable>
            </View>
          ) : (
            <View style={[GStyles.flexRowWrap, GStyles.itemCenter, styles.accountRow]}>
              <TextL numberOfLines={1} style={styles.accountNameText}>
                {account?.accountName}
              </TextL>
              <Touchable onPress={() => setIsEdit(!isEdit)}>
                <Svg icon="edit" size={pTd(16)} />
              </Touchable>
            </View>
          )}
        </View>
        {account ? <AccountCard account={account} /> : null}
      </View>
      <View style={styles.bottomBox}>
        <CommonButton
          onPress={() => account && navigationService.navigate('ShowPrivateKey', { account })}
          title={t('Show Private Key')}
          type="primary"
        />
        {blockExplorerURL ? (
          <CommonButton
            onPress={() => Linking.openURL(getExploreLink(blockExplorerURL, accountInfo.address))}
            containerStyle={GStyles.marginTop(8)}
            title={t('View on Explorer')}
            type="clear"
          />
        ) : null}

        {isRemove && (
          <CommonButton
            type="clear"
            title={t('Remove Account')}
            containerStyle={GStyles.marginTop(8)}
            titleStyle={styles.removeTitleStyle}
            onPress={onRemoveAccount}
          />
        )}
      </View>
    </PageContainer>
  );
}
