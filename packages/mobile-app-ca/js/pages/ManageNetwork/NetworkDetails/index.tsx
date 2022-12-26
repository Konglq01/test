import React, { useCallback, useMemo, useState } from 'react';
import PageContainer from 'components/PageContainer';
import { ChainItemType } from '@portkey/types/chain';
import { RouteProp, useRoute } from '@react-navigation/native';
import CommonInput from 'components/CommonInput';
import { useSetState } from 'hooks';
import { useAppDispatch } from 'store/hooks';
import {
  addCommonList,
  addCustomChainItem,
  removeCustomChainItem,
  setCurrentChain,
  updateCustomChainItem,
} from '@portkey/store/network/actions';
import { formatNetworkError, isNetworkError, NetWorkError } from '@portkey/store/network/utils';
import { formatRpcUrl } from '@portkey/utils';
import ActionSheet from 'components/ActionSheet';
import CommonToast from 'components/CommonToast';
import navigationService from 'utils/navigationService';
import CommonButton from 'components/CommonButton';
import { StyleSheet, View } from 'react-native';
import { defaultColors } from 'assets/theme';
import NetworkOverlay from 'components/NetworkOverlay';
import { windowHeight } from '@portkey/utils/mobile/device';
import { pTd } from 'utils/unit';
import { ChainType } from '@portkey/types';
import { useLanguage } from 'i18n/hooks';
import i18n from 'i18n';
type RouterParams = { chain: ChainItemType };
type InputValue = ChainItemType;
const chainNameMap: { [key in ChainType]: string } = {
  aelf: 'AELF series',
  ethereum: 'Ethereum series',
};
const scrollViewProps = { extraHeight: 120 };

export default function NetworkDetails() {
  const dispatch = useAppDispatch();
  const { params } = useRoute<RouteProp<{ params?: RouterParams }>>();
  const { chain } = params || {};
  const [isEdit, setIsEdit] = useState<boolean>();
  const [netWorkError, setNetWorkError] = useState<NetWorkError>();
  const [loading, setLoading] = useState<boolean>();
  const { t } = useLanguage();
  const defaultInputValue = useMemo(() => {
    if (chain)
      return {
        ...chain,
        chainId: typeof chain?.chainId !== 'string' ? String(chain?.chainId) : chain?.chainId,
      };
  }, [chain]);
  const [inputValue, setInputValue] = useSetState<InputValue>(defaultInputValue);

  const [isCMS, isDisabled] = useMemo(() => {
    const cms = chain && !chain?.isCustom;
    const disabled = cms || (!isEdit && !!defaultInputValue);
    return [cms, disabled];
  }, [chain, defaultInputValue, isEdit]);
  const onSetChainItem = useCallback(async () => {
    setLoading(true);
    try {
      if (defaultInputValue) {
        await dispatch(
          updateCustomChainItem({
            ...chain,
            ...inputValue,
            chainType: 'aelf',
            rpcUrl: formatRpcUrl(inputValue.rpcUrl),
            blockExplorerURL: inputValue.blockExplorerURL?.trim(),
          }),
        );
        CommonToast.success(i18n.t('Modified Successfully!'));
        navigationService.goBack();
      } else {
        const chainInfo: ChainItemType = {
          ...inputValue,
          chainType: 'aelf',
          rpcUrl: formatRpcUrl(inputValue.rpcUrl),
          blockExplorerURL: inputValue.blockExplorerURL?.trim(),
        };
        await dispatch(addCustomChainItem(chainInfo));
        NetworkOverlay.showSwitchChain(chainInfo, [
          { title: i18n.t('Not Now'), type: 'outline', onPress: () => navigationService.navigate('Wallet') },
          {
            title: i18n.t('Yes2'),
            onPress: () => {
              dispatch(addCommonList(chainInfo));
              dispatch(setCurrentChain(chainInfo));
              navigationService.navigate('Wallet');
            },
          },
        ]);
      }
      setNetWorkError(undefined);
    } catch (error) {
      const isError = formatNetworkError(error);
      isError && setNetWorkError(isError);
    }
    setLoading(false);
  }, [chain, defaultInputValue, dispatch, inputValue]);
  const onRemove = useCallback(() => {
    if (!chain) return;
    ActionSheet.alert({
      title: i18n.t('Delete Network?'),
      buttons: [
        { title: i18n.t('No') },
        {
          title: i18n.t('Yes'),
          onPress: () => {
            try {
              dispatch(removeCustomChainItem(chain));
              navigationService.goBack();
            } catch (error) {
              const message = isNetworkError(error);
              message && CommonToast.fail(message);
            }
          },
        },
      ],
    });
  }, [chain, dispatch]);
  const buttonProps = useMemo(() => {
    let onPress: any = onSetChainItem,
      title = 'Save';
    if (defaultInputValue) {
      if (isEdit) {
        title = 'Save';
      } else {
        title = 'Edit';
        onPress = () => setIsEdit(true);
      }
    }
    return { onPress, title };
  }, [defaultInputValue, isEdit, onSetChainItem]);
  const minHeight = useMemo(() => {
    let min = windowHeight - pTd(170);
    if (isEdit && !!chain) min = windowHeight - pTd(220);
    return min;
  }, [chain, isEdit]);
  return (
    <PageContainer
      scrollViewProps={scrollViewProps}
      safeAreaColor={['blue', 'gray']}
      containerStyles={styles.containerStyles}
      titleDom={chain?.networkName || t('Add Network')}>
      <View style={{ minHeight }}>
        <CommonInput
          disabled={true}
          type="general"
          label={t('Network Series')}
          inputContainerStyle={styles.inputContainerStyle}
          defaultValue={defaultInputValue ? chainNameMap[defaultInputValue.chainType] : chainNameMap.aelf}
        />
        <CommonInput
          type="general"
          maxLength={50}
          label={t('Network Name')}
          disabled={isDisabled}
          placeholder={t('Enter Name')}
          errorMessage={netWorkError?.networkName ? t(netWorkError.networkName) : undefined}
          defaultValue={defaultInputValue?.networkName}
          underlineColorAndroid="transparent"
          inputContainerStyle={styles.inputContainerStyle}
          onChangeText={networkName => setInputValue({ networkName })}
        />
        <CommonInput
          type="general"
          label={t('New RPC URL')}
          disabled={isDisabled}
          placeholder="https://URL"
          errorMessage={netWorkError?.rpcUrl ? t(netWorkError.rpcUrl) : undefined}
          defaultValue={defaultInputValue?.rpcUrl}
          inputContainerStyle={styles.inputContainerStyle}
          onChangeText={rpcUrl => setInputValue({ rpcUrl })}
        />
        <CommonInput
          label={t('Chain ID')}
          type="general"
          disabled={isDisabled}
          placeholder={t('Enter Chain ID')}
          errorMessage={netWorkError?.chainId ? t(netWorkError.chainId) : undefined}
          defaultValue={defaultInputValue?.chainId}
          inputContainerStyle={styles.inputContainerStyle}
          onChangeText={chainId => setInputValue({ chainId })}
        />
        {defaultInputValue && !defaultInputValue.blockExplorerURL && !isEdit ? null : (
          <CommonInput
            type="general"
            disabled={isDisabled}
            placeholder={t('Enter Block Explorer URL')}
            label={t('Block Explorer URL (optional)')}
            errorMessage={netWorkError?.blockExplorerURL ? t(netWorkError.blockExplorerURL) : undefined}
            inputContainerStyle={styles.inputContainerStyle}
            defaultValue={defaultInputValue?.blockExplorerURL}
            onChangeText={blockExplorerURL => setInputValue({ blockExplorerURL })}
          />
        )}
      </View>
      <View style={styles.buttonRow}>
        {!isCMS && (
          <CommonButton
            type="primary"
            {...buttonProps}
            title={t(buttonProps.title)}
            loading={loading}
            disabled={!inputValue.networkName || !inputValue.chainId || !inputValue.rpcUrl}
          />
        )}
        {isEdit && !!chain && (
          <CommonButton
            type="clear"
            title={t('Delete')}
            loading={loading}
            onPress={onRemove}
            containerStyle={styles.removeContainerStyle}
            titleStyle={styles.removeTitleStyle}
            disabled={!inputValue.networkName || !inputValue.chainId || !inputValue.rpcUrl}
          />
        )}
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  containerStyles: {
    backgroundColor: defaultColors.bg4,
    paddingTop: 24,
  },
  inputContainerStyle: {
    backgroundColor: defaultColors.bg1,
    borderColor: defaultColors.bg1,
  },
  removeTitleStyle: {
    color: defaultColors.error,
  },
  removeContainerStyle: {
    marginTop: 8,
  },
  buttonRow: {
    marginBottom: 20,
  },
});
