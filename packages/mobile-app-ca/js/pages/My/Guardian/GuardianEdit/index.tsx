import GStyles from 'assets/theme/GStyles';
import CommonButton from 'components/CommonButton';
import { TextL, TextM, TextS } from 'components/CommonText';
import Svg from 'components/Svg';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { pTd } from 'utils/unit';
import navigationService from 'utils/navigationService';
import PageContainer from 'components/PageContainer';
import { pageStyles } from './style';
import ListItem from 'components/ListItem';
import { useLanguage } from 'i18n/hooks';
import CommonInput from 'components/CommonInput';
import { checkEmail } from '@portkey-wallet/utils/check';
import { useGuardiansInfo } from 'hooks/store';
import { LOGIN_TYPE_LIST } from '@portkey-wallet/constants/verifier';
import { ApprovalType, VerificationType, VerifierItem } from '@portkey-wallet/types/verifier';
import { INIT_HAS_ERROR, INIT_NONE_ERROR } from 'constants/common';
import GuardianTypeSelectOverlay from '../components/GuardianTypeSelectOverlay';
import VerifierSelectOverlay from '../components/VerifierSelectOverlay';
import ActionSheet from 'components/ActionSheet';
import { ErrorType } from 'types/common';
import { UserGuardianItem } from '@portkey-wallet/store/store-ca/guardians/type';
import { FontStyles } from 'assets/theme/styles';
import Loading from 'components/Loading';
import CommonToast from 'components/CommonToast';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { LoginKeyType, LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { useAppDispatch } from 'store/hooks';
import { setPreGuardianAction } from '@portkey-wallet/store/store-ca/guardians/actions';
import { VerifierImage } from 'pages/Guardian/components/VerifierImage';
import { DefaultChainId } from '@portkey-wallet/constants/constants-ca/network';
import { verification } from 'utils/api';
import fonts from 'assets/theme/fonts';
import PhoneInput from 'components/PhoneInput';
import { CountryItem } from '@portkey-wallet/types/types-ca/country';
import { DefaultCountry } from '@portkey-wallet/constants/constants-ca/country';
import { defaultColors } from 'assets/theme';
import Touchable from 'components/Touchable';
import { useAppleAuthentication, useGoogleAuthentication } from 'hooks/authentication';

type RouterParams = {
  guardian?: UserGuardianItem;
  isEdit?: boolean;
};

const GuardianEdit: React.FC = () => {
  const { t } = useLanguage();
  const dispatch = useAppDispatch();

  const { guardian: editGuardian, isEdit = false } = useRouterParams<RouterParams>();

  const { verifierMap, userGuardiansList } = useGuardiansInfo();
  const verifierList = useMemo(() => (verifierMap ? Object.values(verifierMap) : []), [verifierMap]);

  const [selectedType, setSelectedType] = useState<typeof LOGIN_TYPE_LIST[number]>();
  const [selectedVerifier, setSelectedVerifier] = useState<VerifierItem>();
  const [account, setAccount] = useState<string>();
  const [guardianTypeError, setGuardianTypeError] = useState<ErrorType>({ ...INIT_HAS_ERROR });
  const [guardianError, setGuardianError] = useState<ErrorType>({ ...INIT_NONE_ERROR });
  const [country, setCountry] = useState<CountryItem>(DefaultCountry);
  const { appleSign, appleResponse } = useAppleAuthentication();
  const { googleSign, googleResponse } = useGoogleAuthentication();

  useEffect(() => {
    if (editGuardian) {
      setSelectedType(LOGIN_TYPE_LIST.find(item => item.value === editGuardian?.guardianType));
      setAccount(editGuardian?.guardianAccount);
      setSelectedVerifier(verifierList.find(item => item.name === editGuardian?.verifier?.name));
    }
  }, [editGuardian, verifierList]);

  const onAccountChange = useCallback((value: string) => {
    setAccount(value);
    setGuardianTypeError({ ...INIT_NONE_ERROR });
  }, []);

  const onSelectedVerifier = useCallback((item: VerifierItem) => {
    setGuardianError({ ...INIT_NONE_ERROR });
    setSelectedVerifier(item);
  }, []);

  const checkCurGuardianRepeat = useCallback(() => {
    if (
      userGuardiansList?.findIndex(
        guardian =>
          guardian.guardianType === selectedType?.value &&
          guardian.guardianAccount === account &&
          guardian.verifier?.id === selectedVerifier?.id,
      ) !== -1
    ) {
      return { ...INIT_HAS_ERROR, errorMsg: t('This guardian already exists') };
    } else {
      return { ...INIT_NONE_ERROR };
    }
  }, [account, selectedType, selectedVerifier, t, userGuardiansList]);

  const onConfirm = useCallback(() => {
    const guardianErrorMsg = checkEmail(account);
    if (guardianErrorMsg) {
      setGuardianTypeError({
        isError: true,
        errorMsg: guardianErrorMsg,
      });
      setGuardianError({ ...INIT_NONE_ERROR });
      return;
    }

    const _guardianError = checkCurGuardianRepeat();
    setGuardianError(_guardianError);
    if (_guardianError.isError) return;
    if (selectedVerifier === undefined || selectedType === undefined) return;

    ActionSheet.alert({
      title2: (
        <Text>
          <TextL>{`${selectedVerifier.name} will send a verification code to `}</TextL>
          <TextL style={fonts.mediumFont}>{account}</TextL>
          <TextL>{` to verify your email address.`}</TextL>
        </Text>
      ),
      buttons: [
        {
          title: t('Cancel'),
          type: 'outline',
        },
        {
          title: t('Confirm'),
          onPress: async () => {
            try {
              Loading.show();
              const req = await verification.sendVerificationCode({
                params: {
                  type: LoginType[selectedType.value],
                  guardianIdentifier: account,
                  verifierId: selectedVerifier.id,
                  chainId: DefaultChainId,
                },
              });
              if (req.verifierSessionId) {
                navigationService.navigate('VerifierDetails', {
                  guardianItem: {
                    isLoginAccount: false,
                    verifier: selectedVerifier,
                    guardianAccount: account,
                    guardianType: LoginType.Email,
                  },
                  requestCodeResult: {
                    verifierSessionId: req.verifierSessionId,
                  },
                  verificationType: VerificationType.addGuardian,
                });
              } else {
                throw new Error('send fail');
              }
            } catch (error) {
              CommonToast.failError(error);
            }
            Loading.hide();
          },
        },
      ],
    });
  }, [checkCurGuardianRepeat, account, selectedType, selectedVerifier, t]);

  const onApproval = useCallback(() => {
    const _guardianError = checkCurGuardianRepeat();
    setGuardianError(_guardianError);
    if (_guardianError.isError || !editGuardian || !selectedVerifier) return;
    dispatch(setPreGuardianAction(editGuardian));

    navigationService.navigate('GuardianApproval', {
      approvalType: ApprovalType.editGuardian,
      guardianItem: {
        ...editGuardian,
        verifier: selectedVerifier,
      },
    });
  }, [checkCurGuardianRepeat, dispatch, editGuardian, selectedVerifier]);

  const onRemove = useCallback(() => {
    if (!editGuardian) return;
    if (editGuardian.isLoginAccount) {
      ActionSheet.alert({
        title2: t(`This guardian is login account and cannot be remove`),
        buttons: [
          {
            title: t('OK'),
          },
        ],
      });
      return;
    }

    ActionSheet.alert({
      title: t('Are you sure you want to remove this guardian?'),
      message: t(`Removing a guardian requires guardians' approval`),
      buttons: [
        {
          title: t('Close'),
          type: 'outline',
        },
        {
          title: t('Send Request'),
          onPress: () => {
            navigationService.navigate('GuardianApproval', {
              approvalType: ApprovalType.deleteGuardian,
              guardianItem: editGuardian,
            });
          },
        },
      ],
    });
  }, [editGuardian, t]);

  const isConfirmDisable = useMemo(
    () => !selectedVerifier || !selectedType || !account,
    [account, selectedType, selectedVerifier],
  );

  const isApprovalDisable = useMemo(
    () => selectedVerifier?.id === editGuardian?.verifier?.id,
    [editGuardian, selectedVerifier],
  );

  return (
    <PageContainer
      safeAreaColor={['blue', 'gray']}
      titleDom={isEdit ? t('Edit Guardians') : t('Add Guardians')}
      leftCallback={() => navigationService.navigate('GuardianHome')}
      containerStyles={pageStyles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <View style={pageStyles.contentWrap}>
        {!isEdit && (
          <>
            <TextM style={pageStyles.titleLabel}>{t('Guardian Type')}</TextM>
            <ListItem
              onPress={() => {
                GuardianTypeSelectOverlay.showList({
                  list: LOGIN_TYPE_LIST,
                  labelAttrName: 'name',
                  value: selectedType?.value,
                  callBack: setSelectedType,
                });
              }}
              titleStyle={[GStyles.flexRowWrap, GStyles.itemCenter]}
              titleTextStyle={[pageStyles.titleTextStyle, !selectedType && FontStyles.font7]}
              style={pageStyles.typeWrap}
              titleLeftElement={
                selectedType?.icon && <Svg icon={selectedType.icon} size={pTd(28)} iconStyle={pageStyles.typeIcon} />
              }
              title={selectedType?.name || t('Select guardian types')}
              rightElement={<Svg size={pTd(20)} icon="down-arrow" />}
            />
          </>
        )}

        {selectedType && selectedType.value === LoginType.Email && (
          <CommonInput
            disabled={isEdit}
            type="general"
            theme="white-bg"
            label={t('Guardian email')}
            value={account}
            placeholder={t('Enter email')}
            maxLength={30}
            onChangeText={onAccountChange}
            errorMessage={guardianTypeError.isError ? guardianTypeError.errorMsg : ''}
            keyboardType="email-address"
          />
        )}

        {selectedType && selectedType.value === LoginType.Phone && (
          <PhoneInput
            label={t('Guardian Phone')}
            theme="white-bg"
            value={account}
            errorMessage={guardianTypeError.isError ? guardianTypeError.errorMsg : ''}
            onChangeText={onAccountChange}
            selectCountry={country}
            onCountryChange={setCountry}
          />
        )}

        {selectedType && selectedType.value === LoginType.Google && (
          <>
            <TextM style={pageStyles.oAuthLabel}>Guardian Google</TextM>
            <Touchable
              onPress={async () => {
                try {
                  const info = await googleSign();
                  console.log(info, '=======info');
                } catch (error) {
                  CommonToast.failError(error);
                }
              }}>
              <View style={pageStyles.oAuthBtn}>
                <TextM style={[FontStyles.font4, fonts.mediumFont]}>Click Add Google Account</TextM>
              </View>
            </Touchable>
          </>
        )}

        {selectedType && selectedType.value === LoginType.Apple && (
          <>
            <TextM style={pageStyles.oAuthLabel}>Guardian Apple</TextM>
            <Touchable
              onPress={async () => {
                try {
                  const info = await appleSign();
                  console.log(info, '=======info');
                } catch (error) {
                  CommonToast.failError(error);
                }
              }}>
              <View style={pageStyles.oAuthBtn}>
                <TextM style={[FontStyles.font4, fonts.mediumFont]}>Click Add Apple ID</TextM>
              </View>
            </Touchable>
          </>
        )}

        <TextM style={pageStyles.titleLabel}>{t('Verifier')}</TextM>
        <ListItem
          onPress={() => {
            VerifierSelectOverlay.showList({
              id: selectedVerifier?.id,
              labelAttrName: 'name',
              list: verifierList,
              callBack: onSelectedVerifier,
            });
          }}
          titleLeftElement={
            selectedVerifier && (
              <VerifierImage style={pageStyles.verifierImageStyle} size={pTd(30)} uri={selectedVerifier.imageUrl} />
            )
          }
          titleStyle={[GStyles.flexRowWrap, GStyles.itemCenter]}
          titleTextStyle={[pageStyles.titleTextStyle, !selectedVerifier && FontStyles.font7]}
          style={pageStyles.verifierWrap}
          title={selectedVerifier?.name || t('Select guardian verifiers')}
          rightElement={<Svg size={pTd(20)} icon="down-arrow" />}
        />
        {guardianError.isError && <TextS style={pageStyles.errorTips}>{guardianError.errorMsg || ''}</TextS>}
      </View>

      <View>
        {isEdit ? (
          <>
            <CommonButton disabled={isApprovalDisable} type="primary" onPress={onApproval}>
              {t('Send Request')}
            </CommonButton>
            <CommonButton
              style={pageStyles.removeBtnWrap}
              type="clear"
              onPress={onRemove}
              titleStyle={FontStyles.font12}>
              {t('Remove')}
            </CommonButton>
          </>
        ) : (
          <CommonButton disabled={isConfirmDisable} type="primary" onPress={onConfirm}>
            {t('Confirm')}
          </CommonButton>
        )}
      </View>
    </PageContainer>
  );
};

export default GuardianEdit;
