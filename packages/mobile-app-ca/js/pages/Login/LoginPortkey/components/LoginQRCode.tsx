import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Image } from 'react-native';
import AElf from 'aelf-sdk';
import { setCAInfoType } from '@portkey/store/store-ca/wallet/actions';
import { BGStyles, FontStyles } from 'assets/theme/styles';
import useEffectOnce from 'hooks/useEffectOnce';
import { useAppDispatch } from 'store/hooks';
import myEvents from 'utils/deviceEvent';
import navigationService from 'utils/navigationService';
import styles from '../styles';
import Touchable from 'components/Touchable';
import GStyles from 'assets/theme/GStyles';
import { TextL, TextM, TextXXXL } from 'components/CommonText';
import { LoginType } from '..';
import { useCurrentWallet } from '@portkey/hooks/hooks-ca/wallet';
import { WalletInfoType } from '@portkey/types/wallet';
import { useCredentials } from 'hooks/store';
import { useIntervalQueryCAInfoByAddress } from '@portkey/hooks/hooks-ca/graphql';
import CommonToast from 'components/CommonToast';
import { handleWalletInfo } from '@portkey/utils/wallet';
import { LoginQRData } from '@portkey/types/types-ca/qrcode';
import phone from 'assets/image/pngs/phone.png';
import QRCode from 'react-native-qrcode-svg';

export default function LoginQRCode({ setLoginType }: { setLoginType: (type: LoginType) => void }) {
  const { walletInfo, currentNetwork } = useCurrentWallet();
  const [newWallet, setNewWallet] = useState<WalletInfoType>();
  const dispatch = useAppDispatch();
  const { pin } = useCredentials() || {};
  const caInfo = useIntervalQueryCAInfoByAddress(currentNetwork, newWallet?.address);
  useEffect(() => {
    if (caInfo) {
      if (pin) {
        try {
          dispatch(setCAInfoType({ caInfo, pin }));
          navigationService.reset('Tab');
        } catch (error) {
          CommonToast.failError(error);
        }
      } else {
        navigationService.navigate('SetPin', {
          caInfo,
          walletInfo: handleWalletInfo(newWallet),
          managerInfo: caInfo.managerInfo,
        });
      }
    }
  }, [caInfo, dispatch, newWallet, pin, walletInfo]);
  const generateKeystore = useCallback(() => {
    try {
      const wallet = walletInfo?.address ? walletInfo : AElf.wallet.createNewWallet();
      setNewWallet(wallet);
    } catch (error) {
      console.error(error);
    }
  }, [walletInfo]);
  useEffectOnce(() => {
    const timer = setTimeout(() => {
      generateKeystore();
    }, 10);
    let timer2: any;
    myEvents.clearQRWallet.addListener(() => {
      timer2 = setTimeout(() => {
        setNewWallet(undefined);
        timer2 && clearTimeout(timer2);
        timer2 = setTimeout(() => {
          generateKeystore();
        }, 200);
      }, 500);
    });
    return () => {
      timer && clearTimeout(timer);
      timer2 && clearTimeout(timer2);
    };
  });
  const qrData = useMemo(() => {
    if (!newWallet) return 'xxx';
    const data: LoginQRData = {
      // TODO: ethereum
      chainType: 'aelf',
      type: 'login',
      address: newWallet.address,
      netWorkType: currentNetwork,
    };
    return JSON.stringify(data);
  }, [currentNetwork, newWallet]);
  return (
    <View style={[BGStyles.bg1, styles.card]}>
      <Touchable style={styles.iconBox} onPress={() => setLoginType('email')}>
        <Image source={phone} style={styles.iconStyle} />
      </Touchable>
      <TextXXXL style={[styles.qrCodeTitle, GStyles.textAlignCenter]}>Scan code to log in</TextXXXL>
      <TextM style={[GStyles.textAlignCenter, FontStyles.font3]}>Please use the Portkey DApp to scan the QR code</TextM>
      <View style={[GStyles.alignCenter, styles.qrCodeBox]}>
        {!newWallet && (
          <View style={styles.loading}>
            <TextL>Updating...</TextL>
          </View>
        )}
        <QRCode value={qrData} size={200} />
      </View>
    </View>
  );
}
