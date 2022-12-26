import React, { useCallback, useState } from 'react';
import OverlayModal from 'components/OverlayModal';
import { Keyboard, ScrollView, View, ViewProps } from 'react-native';
import { styles } from './styles';
import { TextL, TextM, TextS, TextTitle } from 'components/CommonText';
import GStyles from 'assets/theme/GStyles';
import { sleep } from 'utils';
import CommonToast from 'components/CommonToast';
import Touchable from 'components/Touchable';
import { useAppDispatch } from 'store/hooks';
import { setCurrentAccount } from '@portkey/store/wallet/actions';
import { AccountType } from '@portkey/types/wallet';
import { useAccountListNativeBalances } from '@portkey/hooks/hooks-eoa/balances';
import { useCredentials, useWallet } from 'hooks/store';
import { AccountItem } from './components';
import navigationService from 'utils/navigationService';
import { addressFormat } from '@portkey/utils';
import { useCurrentNetwork } from '@portkey/hooks/network';
import ButtonRow, { ButtonRowProps } from 'components/ButtonRow';
import { pTd } from 'utils/unit';
import fonts from 'assets/theme/fonts';
import CommonButton from 'components/CommonButton';
import { isWalletError } from '@portkey/store/wallet/utils';
import { useLanguage } from 'i18n/hooks';

type AccountListTypes = 'dashBoard' | 'innerPage';

export interface ModalBodyProps extends ViewProps {
  title?: string;
}

const showAccountInfo = (accountInfo: AccountType) => navigationService.navigate('AccountDetails', { accountInfo });

type RemoveAccountProps = {
  accountInfo: AccountType;
  buttons?: ButtonRowProps['buttons'];
};
const RemoveAccount = ({ accountInfo, buttons }: RemoveAccountProps) => {
  const { chainId, chainType } = useCurrentNetwork();
  const { t } = useLanguage();
  return (
    <View style={styles.centerBox}>
      <ScrollView alwaysBounceVertical={false}>
        <TextTitle style={GStyles.alignCenter}>{t('Remove Account ?')}</TextTitle>
        <View style={[styles.accountRow, GStyles.marginTop(pTd(16))]}>
          <TextL style={fonts.mediumFont}>{accountInfo?.accountName}</TextL>
          <TextM style={styles.addressText}>{addressFormat(accountInfo?.address, chainId, chainType)}</TextM>
        </View>
        <TextS style={[styles.replaceTip, GStyles.marginTop(pTd(24))]}>
          {t(
            'This account will be removed from your wallet. Please make sure you have the original Secret Recovery Phrase or private key for this imported account before continuing',
          )}
        </TextS>
        <ButtonRow
          buttons={buttons?.map(i => {
            const props: any = {
              ...i,
              onPress: () => {
                OverlayModal.destroy();
                i.onPress?.();
              },
            };
            return props;
          })}
        />
      </ScrollView>
    </View>
  );
};

const showRemoveAccount = (props: RemoveAccountProps) => {
  Keyboard.dismiss();
  OverlayModal.show(<RemoveAccount {...props} />, { position: 'center', type: 'zoomOut' });
};

const AccountList = ({
  accountListType = 'dashBoard',
  selectAccountCallback,
}: {
  accountListType?: AccountListTypes;
  selectAccountCallback?: (account: AccountType) => void;
}) => {
  const { accountList } = useWallet();
  const { t } = useLanguage();
  const dispatch = useAppDispatch();
  const credentials = useCredentials();
  const accountListNativeBalances = useAccountListNativeBalances();
  const onSetCurrentAccount = useCallback(
    (account: AccountType) => {
      if (!credentials) return;
      try {
        dispatch(setCurrentAccount({ address: account.address, password: credentials?.password }));
        OverlayModal.hide();
      } catch (error) {
        const message = isWalletError(error);
        message && CommonToast.fail(message);
      }
    },
    [credentials, dispatch],
  );

  const justSelectAccount = (account: AccountType) => {
    selectAccountCallback?.(account);
    OverlayModal.hide();
  };

  return (
    <View style={styles.bottomBox}>
      <Touchable style={styles.headerRow} onPress={OverlayModal.hide}>
        <View style={styles.headerIcon} />
      </Touchable>
      <ScrollView alwaysBounceVertical={false}>
        <View style={[GStyles.marginBottom(16), GStyles.marginTop(8)]}>
          {accountList?.map((account, key) => (
            <AccountItem
              balances={accountListNativeBalances?.[account.address]}
              onPress={() => {
                selectAccountCallback ? justSelectAccount(account) : onSetCurrentAccount(account);
              }}
              account={account}
              key={key}
            />
          ))}
        </View>
      </ScrollView>
      {accountListType === 'dashBoard' && (
        <>
          <CommonButton
            type="clear"
            title={t('Create Account')}
            buttonStyle={styles.listButtonStyle}
            containerStyle={styles.listButtonContainerStyle}
            titleStyle={styles.listButtonTitleStyle}
            onPress={() => {
              OverlayModal.hide();
              navigationService.navigate('CreateAccount');
            }}
          />
          <CommonButton
            type="clear"
            title={t('Import Account')}
            containerStyle={styles.listButtonContainerStyle}
            buttonStyle={styles.listButtonStyle}
            titleStyle={styles.listButtonTitleStyle}
            onPress={() => {
              OverlayModal.hide();
              navigationService.navigate('ImportAccount');
            }}
          />
        </>
      )}
    </View>
  );
};

const showAccountList = (
  accountListType?: AccountListTypes,
  selectAccountCallback?: (account: AccountType) => void,
) => {
  Keyboard.dismiss();
  OverlayModal.show(<AccountList accountListType={accountListType} selectAccountCallback={selectAccountCallback} />, {
    position: 'bottom',
  });
};

type ReplaceAccountProps = {
  account1: AccountType;
  account2: AccountType;
  buttons?: ButtonRowProps['buttons'];
};

const ReplaceAccount = ({ account1, account2, buttons }: ReplaceAccountProps) => {
  const { chainId, chainType } = useCurrentNetwork();
  const [loading, setLoading] = useState<boolean>();
  const { t } = useLanguage();
  return (
    <View style={styles.centerBox}>
      <ScrollView alwaysBounceVertical={false}>
        <TextTitle style={GStyles.alignCenter}>{t('Replace Account?')}</TextTitle>
        <View style={styles.accountRow}>
          <TextL style={fonts.mediumFont}>{account1?.accountName}</TextL>
          <TextM style={styles.addressText}>{addressFormat(account1?.address, chainId, chainType)}</TextM>
        </View>
        <View style={styles.accountRow}>
          <TextL style={fonts.mediumFont}>{account2?.accountName}</TextL>
          <TextM style={styles.addressText}>{addressFormat(account2?.address, chainId, chainType)}</TextM>
        </View>
        <TextS style={styles.replaceTip}>
          {t('This account has been imported via private key. To proceed, the imported account will be replaced.')}
        </TextS>
        <ButtonRow
          buttons={buttons?.map(i => {
            const props: any = {
              ...i,
              onPress: () => {
                OverlayModal.hide();
                i.onPress?.();
              },
              disabled: loading,
            };
            if (i.type === 'primary') {
              props.onPress = async () => {
                setLoading(true);
                await sleep(10);
                OverlayModal.hide();
                i.onPress?.();
                setLoading(false);
              };
              props.loading = loading;
            }
            return props;
          })}
        />
      </ScrollView>
    </View>
  );
};
const replaceAccount = (props: ReplaceAccountProps) => {
  Keyboard.dismiss();
  OverlayModal.show(<ReplaceAccount {...props} />, { position: 'center', type: 'zoomOut', modal: true });
};

export default {
  showAccountInfo,
  showRemoveAccount,
  showAccountList,
  replaceAccount,
};
