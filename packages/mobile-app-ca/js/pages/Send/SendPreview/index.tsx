import React, { memo, useCallback, useState } from 'react';
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
import { usePin } from 'hooks/store';
import { getManagerAccount } from 'utils/redux';
import crossChainTransfer, {
  CrossChainTransferIntervalParams,
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

export interface SendHomeProps {
  route?: any;
}

const SendHome: React.FC<SendHomeProps> = props => {
  const { t } = useLanguage();

  // const {
  //   sendInfo: { selectedToContact, tokenItem, nftItem, sendNumber, transactionFee, isCrossChainTransfer },
  //   sendType,
  // } = useRouterParams<{
  //   sendInfo: {
  //     tokenItem: TokenItemShowType;
  //     nftItem: any;
  //     sendNumber: string | number;
  //     transactionFee: string | number;
  //     isCrossChainTransfer: boolean;
  //   };
  //   sendType: 'nft' | 'token';
  // }>();

  const { sendType, assetInfo, toInfo, transactionFee, sendNumber } = useRouterParams<IToSendPreviewParamsType>();

  const dispatch = useAppCommonDispatch();

  const pin = usePin();
  const chainInfo = useCurrentChain(assetInfo.chainId);

  const [isLoading] = useState(false);
  const currentNetwork = useCurrentNetwork();
  const wallet = useCurrentWalletInfo();
  const caAddresses = useCaAddresses();

  const showRetry = (retryFunc: any) => {
    ActionSheet.alert({
      title: t('Transaction failed ！'),
      buttons: [
        {
          title: t('Resend'),
          type: 'solid',
          onPress: () => {
            retryFunc?.();
          },
        },
      ],
    });
  };

  // TODO
  // const totalPay = useMemo(() => {
  //   // TODO: TransferNumber + Transaction Fee
  //   const totalTransactionFee = ZERO.plus(transactionFee).times(data?.USDT || 0);
  //   const totalTransferNumber =
  //     selectedToken.symbol === 'ELF' ? ZERO.plus(sendTokenNumber).times(data?.USDT || 0) : ZERO;
  //   console.log(totalTransactionFee.valueOf(), totalTransferNumber.valueOf());

  //   return totalTransactionFee.plus(totalTransferNumber);
  // }, [data?.USDT, selectedToken, sendTokenNumber, transactionFee]);

  // const showCrossChainTips = () => {
  //   CrossChainTransferModal.alert({});
  // };

  // const tokenInfo: any = useMemo(
  //   () => ({
  //     symbol: 'ELF',
  //     decimals: 8,
  //     address: 'JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE',
  //   }),
  //   // ({
  //   //   symbol: 'BTX-2',
  //   //   decimals: 0,
  //   //   tokenName: '1155-BTX2',
  //   //   address: 'JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE',
  //   //   supply: '1000',
  //   //   totalSupply: '1000',
  //   //   issuer: '2KQWh5v6Y24VcGgsx2KHpQvRyyU5DnCZ4eAUPqGQbnuZgExKaV',
  //   //   isBurnable: true,
  //   //   issueChainId: 9992731,
  //   //   issued: '1000',
  //   //   externalInfo: { value: { __nft_image_url: 'nft_image_url', __nft_is_burned: 'true' } },
  //   // }),

  //   [],
  // );

  const retryCrossChain = useCallback(
    async ({ managerTransferTxId, data }: { managerTransferTxId: string; data: CrossChainTransferIntervalParams }) => {
      try {
        //
        await intervalCrossChainTransfer(data);
        dispatch(removeFailedActivity(managerTransferTxId));
      } catch (error) {
        // tip retryCrossChain()
        // Modal.confirm
      }
    },
    [dispatch],
  );

  //  TODO: when finish send upDate balance

  const transfer = async () => {
    const tokenInfo = {
      symbol: assetInfo.symbol,
      decimals: assetInfo.decimals ?? 0,
      address: assetInfo.tokenContractAddress,
    };

    try {
      // TODO
      // CommonToast.success(t('Transfer Successful'));
      // navigationService.navigate('DashBoard');
      if (!chainInfo || !pin) return;
      const account = getManagerAccount(pin);
      if (!account) return;

      Loading.show();

      const contract = await getContractBasic({
        contractAddress: chainInfo.caContractAddress,
        rpcUrl: chainInfo.endPoint,
        account,
      });

      // TODO
      const amount = timesDecimals(sendNumber, tokenInfo.decimals).toNumber();
      // setLoading(true);

      const isCrossChainTransfer = isCrossChain(toInfo.address, assetInfo.chainId);

      if (isCrossChainTransfer) {
        const tokenContract = await getContractBasic({
          contractAddress: tokenInfo.address,
          rpcUrl: chainInfo.endPoint,
          account,
        });

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

        navigationService.navigate('DashBoard');
        CommonToast.success('success');
      } else {
        console.log('sameChainTransfers==sendHandler', tokenInfo);

        const sameTransferResult = await sameChainTransfer({
          contract,
          tokenInfo: { ...assetInfo, address: assetInfo.tokenContractAddress } as unknown as BaseToken,
          caHash: wallet.caHash || '',
          amount,
          toAddress: toInfo.address,
        });

        if (sameTransferResult.error) {
          Loading.hide();
          return CommonToast.fail(sameTransferResult?.error?.message || '');
        }

        console.log('sameTransferResult', sameTransferResult);
        navigationService.navigate('DashBoard');
        CommonToast.success('success');
      }
    } catch (error: any) {
      console.log('sendHandler==error', error);
      // if (!error?.type) return message.error(error);
      if (error.type === 'managerTransfer') {
        return CommonToast.fail(error);
      } else if (error.type === 'crossChainTransfer') {
        showRetry(() => {
          retryCrossChain(error);
        });
        // TODO tip retry
        dispatch(
          addFailedActivity({
            transactionId: error.managerTransferTxId,
            params: error.data,
          }),
        );

        return;
      } else {
        CommonToast.fail(error);
      }
    } finally {
      // setLoading(false);
    }

    Loading.hide();
  };

  const networkInfoShow = (address: string) => {
    const chainId = address.split('_')[2];
    return chainId === 'AELF' ? 'MainChain AELF' : `SideChain ${chainId} `;
  };

  return (
    <PageContainer
      safeAreaColor={['blue', 'white']}
      titleDom={t('Send')}
      containerStyles={styles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      {sendType === 'nft' ? (
        <View style={styles.topWrap}>
          {assetInfo?.imageUrl ? (
            <Text style={styles.noImg}>A</Text>
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
            <TextM style={styles.blackFontColor}>{'Wallet1'}</TextM>
          </View>
          <View style={[styles.flexSpaceBetween]}>
            <TextM style={styles.lightGrayFontColor} />
            <TextS style={styles.lightGrayFontColor}>{formatStr2EllipsisStr(`ELF_${caAddresses[0]}_AELF`)}</TextS>
          </View>
        </View>
        <Text style={[styles.divider, styles.marginTop0]} />
        {/* To */}
        <View style={styles.section}>
          <View style={[styles.flexSpaceBetween]}>
            <TextM style={[styles.blackFontColor]}>{t('To')}</TextM>
            <TextM style={[styles.blackFontColor, styles.fontBold]}>{toInfo?.name || '-'}</TextM>
          </View>
          <View style={[styles.flexSpaceBetween]}>
            <Text />
            <TextS style={styles.lightGrayFontColor}>{formatStr2EllipsisStr(toInfo?.address)}</TextS>
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
        <CommonButton loading={isLoading} title={t('Send')} type="primary" onPress={transfer} />
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
});
