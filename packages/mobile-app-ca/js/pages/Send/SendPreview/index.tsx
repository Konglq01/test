import React, { memo, useCallback, useRef, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import PageContainer from 'components/PageContainer';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import { TextM, TextS, TextL } from 'components/CommonText';
import CommonButton from 'components/CommonButton';
import ActionSheet from 'components/ActionSheet';
import { formatAddress2NoPrefix, formatChainInfo, formatStr2EllipsisStr } from 'utils';
import { addRecentContact } from '@portkey/store/store-ca/recent/slice';
import { isAelfAddress, isCrossChain } from '@portkey/utils/aelf';
import { updateBalance } from '@portkey/store/tokenBalance/slice';
import { useLanguage } from 'i18n/hooks';
import { useAppCommonDispatch } from '@portkey/hooks';
import GStyles from 'assets/theme/GStyles';
import fonts from 'assets/theme/fonts';
import { Image, ScreenHeight } from '@rneui/base';
import { getContractBasic } from '@portkey/contracts/utils';
import { useCurrentChain } from '@portkey/hooks/hooks-ca/chainList';
import { getDefaultWallet } from 'utils/aelfUtils';
import { usePin, useWallet } from 'hooks/store';
import { getManagerAccount } from 'utils/redux';
import crossChainTransfer, {
  CrossChainTransferParamsType,
  intervalCrossChainTransfer,
} from 'utils/transfer/crossChainTransfer';
import { useCurrentNetwork } from '@portkey/hooks/network';
import { useCurrentNetworkInfo } from '@portkey/hooks/hooks-ca/network';
import { useCaAddresses, useCurrentWalletInfo } from '@portkey/hooks/hooks-ca/wallet';
import { timesDecimals } from '@portkey/utils/converter';
import sameChainTransfer from 'utils/transfer/sameChainTransfer';
import { addFailedActivity, removeFailedActivity } from '@portkey/store/store-ca/activity/slice';
import useRouterParams from '@portkey/hooks/useRouterParams';
import CommonToast from 'components/CommonToast';
import navigationService from 'utils/navigationService';
import Loading from 'components/Loading';
import { IToSendPreviewParamsType } from '@portkey/types/types-ca/routeParams';
import { BaseToken } from '@portkey/types/types-ca/token';
import { ContractBasic } from '@portkey/contracts/utils/ContractBasic';

export interface SendHomeProps {
  route?: any;
}

const SendHome: React.FC<SendHomeProps> = props => {
  const { t } = useLanguage();

  const { sendType, assetInfo, toInfo, transactionFee, sendNumber } = useRouterParams<IToSendPreviewParamsType>();

  const dispatch = useAppCommonDispatch();

  const pin = usePin();
  const chainInfo = useCurrentChain(assetInfo.chainId);

  const [isLoading] = useState(false);
  const currentNetwork = useCurrentNetwork();
  const wallet = useCurrentWalletInfo();
  const { walletName } = useWallet();
  const caAddresses = useCaAddresses();
  const contractRef = useRef<ContractBasic>();
  const tokenContractRef = useRef<ContractBasic>();

  const showRetry = useCallback(
    (retryFunc: () => void) => {
      ActionSheet.alert({
        title: t('Transaction failed ！'),
        buttons: [
          {
            title: t('Resend'),
            type: 'solid',
            onPress: () => {
              retryFunc();
            },
          },
        ],
      });
    },
    [t],
  );

  const transfer = useCallback(async () => {
    const tokenInfo = {
      symbol: assetInfo.symbol,
      decimals: assetInfo.decimals ?? 0,
      address: assetInfo.tokenContractAddress,
    };

    if (!chainInfo || !pin) return;
    const account = getManagerAccount(pin);
    if (!account) return;

    if (!contractRef.current) {
      contractRef.current = await getContractBasic({
        contractAddress: chainInfo.caContractAddress,
        rpcUrl: chainInfo.endPoint,
        account,
      });
    }

    const contract = contractRef.current;
    const amount = timesDecimals(sendNumber, tokenInfo.decimals).toNumber();
    const isCrossChainTransfer = isCrossChain(toInfo.address, assetInfo.chainId);

    if (isCrossChainTransfer) {
      if (!tokenContractRef.current) {
        tokenContractRef.current = await getContractBasic({
          contractAddress: tokenInfo.address,
          rpcUrl: chainInfo.endPoint,
          account,
        });
      }
      const tokenContract = tokenContractRef.current;

      const crossChainTransferResult = await crossChainTransfer({
        tokenContract,
        contract,
        chainType: currentNetwork.chainType ?? 'aelf',
        managerAddress: wallet.address,
        tokenInfo: { ...assetInfo, address: assetInfo.tokenContractAddress } as unknown as BaseToken,
        caHash: wallet.caHash || '',
        amount,
        toAddress: toInfo.address,
      });

      console.log('crossChainTransferResult', crossChainTransferResult);
    } else {
      console.log('sameChainTransfers==sendHandler', tokenInfo);
      const sameTransferResult = await sameChainTransfer({
        contract,
        tokenInfo: {
          ...assetInfo,
          address: assetInfo?.tokenContractAddress || assetInfo?.address,
        } as unknown as BaseToken,
        caHash: wallet.caHash || '',
        amount,
        toAddress: toInfo.address,
      });

      if (sameTransferResult.error) {
        return CommonToast.fail(sameTransferResult?.error?.message || '');
      }
      console.log('sameTransferResult', sameTransferResult);
    }
    navigationService.navigate('Tab');
    CommonToast.success('success');
  }, [assetInfo, chainInfo, currentNetwork.chainType, pin, sendNumber, toInfo.address, wallet.address, wallet.caHash]);

  const retryCrossChain = useCallback(
    async (managerTransferTxId: string, data: CrossChainTransferParamsType) => {
      const tokenInfo = {
        symbol: assetInfo.symbol,
        decimals: assetInfo.decimals ?? 0,
        address: assetInfo.tokenContractAddress,
      };
      if (!chainInfo || !pin) return;
      const account = getManagerAccount(pin);
      if (!account) return;

      Loading.show();
      try {
        if (!tokenContractRef.current) {
          tokenContractRef.current = await getContractBasic({
            contractAddress: tokenInfo.address,
            rpcUrl: chainInfo.endPoint,
            account,
          });
        }
        const tokenContract = tokenContractRef.current;
        await intervalCrossChainTransfer(tokenContract, data);
        dispatch(removeFailedActivity(managerTransferTxId));
        navigationService.navigate('Tab');
        CommonToast.success('success');
      } catch (error) {
        showRetry(() => {
          retryCrossChain(managerTransferTxId, data);
        });
      }
      Loading.hide();
    },
    [assetInfo.decimals, assetInfo.symbol, assetInfo.tokenContractAddress, chainInfo, dispatch, pin, showRetry],
  );

  const onSend = async () => {
    Loading.show();
    try {
      await transfer();
    } catch (error: any) {
      console.log('sendHandler==error2222', error);
      if (error.type === 'managerTransfer') {
        console.log(error);
        CommonToast.failError(error.error);
        console.log('????');
        return;
      } else if (error.type === 'crossChainTransfer') {
        dispatch(
          addFailedActivity({
            transactionId: error.managerTransferTxId,
            params: error.data,
          }),
        );
        showRetry(() => {
          retryCrossChain(error.managerTransferTxId, error.data);
        });
        return;
      } else {
        CommonToast.failError(error);
      }
    }
    Loading.hide();
  };

  const networkInfoShow = (address: string) => {
    const chainId = address.split('_')[2];
    return chainId === 'AELF' ? 'MainChain AELF' : `SideChain ${chainId} `;
  };

  console.log('transactionFeetransactionFeetransactionFee', transactionFee);

  return (
    <PageContainer
      safeAreaColor={['blue', 'white']}
      titleDom={`${t('Send')}${sendType === 'token' ? ' ' + assetInfo.symbol : ''}`}
      containerStyles={styles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      {sendType === 'nft' ? (
        <View style={styles.topWrap}>
          {!assetInfo?.imageUrl ? (
            <Text style={styles.noImg}>{assetInfo?.alias[0]}</Text>
          ) : (
            <Image style={styles.img} source={{ uri: assetInfo?.imageUrl }} />
          )}
          <View style={styles.topLeft}>
            <TextL style={styles.nftTitle}>{`${assetInfo.alias} #${assetInfo?.tokenId}`} </TextL>
            <TextS>{`Amount：${sendNumber}`}</TextS>
          </View>
        </View>
      ) : (
        <>
          <Text style={styles.tokenCount}>{`- ${sendNumber} ${assetInfo?.symbol}`} </Text>
          {/* <TextM style={styles.tokenUSD}>-$ -</TextM> */}
        </>
      )}

      <View style={styles.card}>
        {/* From */}
        <View style={styles.section}>
          <View style={[styles.flexSpaceBetween]}>
            <TextM style={styles.lightGrayFontColor}>{t('From')}</TextM>
            <TextM style={styles.blackFontColor}>{walletName}</TextM>
          </View>
          <View style={[styles.flexSpaceBetween]}>
            <TextM style={styles.lightGrayFontColor} />
            <TextS style={styles.lightGrayFontColor}>
              {formatStr2EllipsisStr(`ELF_${caAddresses[0]}_${assetInfo.chainId}`)}
            </TextS>
          </View>
        </View>
        <Text style={[styles.divider, styles.marginTop0]} />
        {/* To */}
        <View style={styles.section}>
          <View style={[styles.flexSpaceBetween]}>
            <TextM style={[styles.blackFontColor]}>{t('To')}</TextM>
            <View style={styles.alignItemsEnd}>
              {toInfo?.name && <TextM style={[styles.blackFontColor, styles.fontBold]}>{toInfo?.name}</TextM>}
              <TextS style={styles.lightGrayFontColor}>{formatStr2EllipsisStr(toInfo?.address)}</TextS>
            </View>
          </View>
        </View>
        <Text style={[styles.divider, styles.marginTop0]} />
        {/* more Info */}
        <View style={styles.section}>
          <View style={[styles.flexSpaceBetween]}>
            <TextM style={[styles.blackFontColor]}>{t('Network')}</TextM>
            <TextM style={[styles.blackFontColor, styles.fontBold]}>{`${formatChainInfo(
              assetInfo.chainId,
            )} → ${networkInfoShow(toInfo?.address)} `}</TextM>
          </View>
        </View>
        <Text style={[styles.divider, styles.marginTop0]} />
        {/* transaction Fee */}
        <View style={styles.section}>
          <View style={[styles.flexSpaceBetween]}>
            <TextM style={[styles.blackFontColor, styles.fontBold]}>{t('Transaction Fee')}</TextM>
            <TextM style={[styles.blackFontColor, styles.fontBold]}>{`${transactionFee} ${'ELF'} `}</TextM>
          </View>
          <View style={[styles.flexSpaceBetween, styles.marginTop4]}>
            <Text />
            <TextS style={styles.lightGrayFontColor}>{`$ ${'-'}`}</TextS>
          </View>
        </View>
      </View>

      <View style={styles.buttonWrapStyle}>
        <CommonButton loading={isLoading} title={t('Send')} type="primary" onPress={onSend} />
      </View>
    </PageContainer>
  );
};

addRecentContact;

export default memo(SendHome);

export const styles = StyleSheet.create({
  pageWrap: {
    backgroundColor: defaultColors.bg1,
    height: ScreenHeight - pTd(130),
  },
  topWrap: {
    width: '100%',
    marginTop: pTd(40),
    ...GStyles.flexRow,
  },
  img: {
    width: pTd(64),
    height: pTd(64),
    borderRadius: pTd(6),
    marginRight: pTd(16),
  },
  noImg: {
    overflow: 'hidden',
    width: pTd(64),
    height: pTd(64),
    borderRadius: pTd(6),
    backgroundColor: defaultColors.bg7,
    fontSize: pTd(54),
    lineHeight: pTd(64),
    textAlign: 'center',
    color: defaultColors.font7,
    marginRight: pTd(16),
  },
  topLeft: {
    ...GStyles.flexCol,
    justifyContent: 'center',
  },
  nftTitle: {
    color: defaultColors.font5,
    marginBottom: pTd(4),
  },
  tokenCount: {
    marginTop: pTd(60),
    fontSize: pTd(28),
    width: '100%',
    textAlign: 'center',
  },
  tokenUSD: {
    color: defaultColors.font3,
    width: '100%',
    textAlign: 'center',
    marginTop: pTd(4),
  },
  group: {
    backgroundColor: defaultColors.bg1,
    marginTop: pTd(24),
    paddingLeft: pTd(16),
    paddingRight: pTd(16),
    borderRadius: pTd(6),
  },
  buttonWrapStyle: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  errorMessage: {
    lineHeight: pTd(16),
    color: defaultColors.error,
    marginTop: pTd(4),
    paddingLeft: pTd(8),
  },
  wrap: {
    height: pTd(56),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  borderTop: {
    borderTopColor: defaultColors.border6,
    borderTopWidth: pTd(0.5),
  },
  title: {
    flex: 1,
    color: defaultColors.font3,
  },
  tokenNum: {
    textAlign: 'right',
    color: defaultColors.font5,
  },
  usdtNum: {
    marginLeft: pTd(6),
    marginTop: pTd(4),
    color: defaultColors.font3,
    textAlign: 'right',
  },
  notELFWrap: {
    height: pTd(84),
    alignItems: 'flex-start',
    paddingTop: pTd(18),
    paddingBottom: pTd(18),
  },
  totalWithUSD: {
    marginTop: pTd(12),
    display: 'flex',
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  flexSpaceBetween: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: pTd(20),
    width: '100%',
  },
  titles1: {
    marginTop: pTd(56),
  },
  values1: {
    marginTop: pTd(4),
  },
  divider: {
    marginTop: pTd(24),
    width: '100%',
    height: pTd(0.5),
    backgroundColor: defaultColors.border6,
  },
  titles2: {
    marginTop: pTd(25),
  },
  values2: {
    marginTop: pTd(4),
  },
  card: {
    marginTop: pTd(40),
    borderRadius: pTd(6),
    borderWidth: pTd(0.5),
    borderColor: defaultColors.border1,
    width: '100%',
  },
  section: {
    ...GStyles.paddingArg(16, 12),
  },
  marginTop16: {
    marginTop: pTd(16),
  },
  marginTop4: {
    marginTop: pTd(4),
  },
  marginTop0: {
    marginTop: 0,
  },
  marginLeft8: {
    marginLeft: pTd(8),
  },
  space: {
    flex: 1,
  },
  button: {
    marginBottom: pTd(30),
  },
  lightGrayFontColor: {
    color: defaultColors.font3,
  },
  blackFontColor: {
    color: defaultColors.font5,
  },
  fontBold: {
    ...fonts.mediumFont,
  },
  greenFontColor: {
    color: defaultColors.font10,
  },
  alignItemsCenter: {
    alignItems: 'center',
  },
  alignItemsEnd: {
    alignItems: 'flex-end',
  },
});
