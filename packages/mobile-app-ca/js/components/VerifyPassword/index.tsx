/* eslint-disable react/react-in-jsx-scope */
import OverlayModal from 'components/OverlayModal';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { isIos } from '@portkey/utils/mobile/device';
import styles from './styles';
import { pTd } from 'utils/unit';
import { TextL, TextM } from 'components/CommonText';
import GStyles from 'assets/theme/GStyles';
import Password from 'components/Password';
import { Input } from '@rneui/base';
import { sleep } from 'utils';
import { checkPin } from 'utils/redux';

const BottomView = (props: { cancel?: () => void; determine?: () => void }) => {
  const { cancel, determine } = props;
  const Components = useMemo(
    () => (
      <View style={styles.buttonsBox}>
        <TouchableOpacity onPress={cancel} style={styles.buttonItem}>
          <Text style={styles.cancelText}>cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={determine} style={styles.rightButtonItem}>
          <Text style={styles.buttonText}>determine</Text>
        </TouchableOpacity>
      </View>
    ),
    [cancel, determine],
  );
  return Components;
};

const PayComponents = (props: { callBack?: (v: boolean) => void }) => {
  const [pwTip, setPwTip] = useState(false);
  const { callBack } = props;
  const intervalRef = useRef<string>();
  // const determine = useCallback(() => {
  //   if (payPw === intervalRef.current) {
  //     callBack?.(true);
  //     OverlayModal.hide();
  //   } else {
  //     setPwTip(true);
  //   }
  // }, [intervalRef, payPw, callBack]);

  const onChange = useCallback((value: string) => {
    intervalRef.current = value;
    if (value.length === 6) {
      // determine();
    }
  }, []);

  const cancel = useCallback(() => {
    callBack?.(false);
    OverlayModal.hide();
  }, [callBack]);
  return (
    <ScrollView alwaysBounceVertical={false} keyboardShouldPersistTaps="always">
      <View style={[styles.container]}>
        <View style={styles.pleasePayPwdBox}>
          {/* <AntDesign color={'white'} size={pTd(20)} name="close" /> */}
          <TextM style={styles.pleasePayPwd} numberOfLines={1}>
            Please enter the payment password
          </TextM>
          <TouchableOpacity onPress={cancel}>
            <TextM>cancel</TextM>
          </TouchableOpacity>
        </View>
        <Password maxLength={6} style={GStyles.marginArg(pTd(25), 0, pTd(15), 0)} onChange={onChange} />
        <View style={styles.payTipsBox}>
          {pwTip ? <TextM style={[GStyles.pwTip, styles.tips]}>Wrong password</TextM> : null}
        </View>
        {/* <BottomView cancel={cancel} determine={determine} /> */}
        {/* {isIos ? <KeyboardSpace /> : null} */}
      </View>
    </ScrollView>
  );
};

const PasswordComponents = (props: { callBack?: (v: boolean, password?: string) => void }) => {
  const [pwTip, setPwTip] = useState(false);
  const [loading, setLoading] = useState(false);
  const { callBack } = props;
  const intervalRef = useRef<string>();
  const onChange = useCallback((value: string) => {
    intervalRef.current = value;
  }, []);

  const determine = useCallback(async () => {
    if (!intervalRef.current) return;
    setLoading(true);
    await sleep(500);
    const checkResult = checkPin(intervalRef.current);
    setLoading(false);
    if (checkResult) {
      OverlayModal.hide();
      callBack?.(true, intervalRef.current);
    } else {
      setPwTip(true);
    }
  }, [callBack]);

  const cancel = useCallback(() => {
    OverlayModal.hide();
    callBack?.(false);
  }, [callBack]);
  return (
    <ScrollView alwaysBounceVertical={false} keyboardShouldPersistTaps="always">
      <View style={styles.container}>
        <TextL>Please enter the account password</TextL>
        <Input autoFocus secureTextEntry={true} onChangeText={onChange} placeholder="Please enter" />
        {pwTip && (
          <TextM style={[GStyles.pwTip, styles.tips]}>The account password is incorrect, please re-enter it</TextM>
        )}
        {loading ? <ActivityIndicator /> : <BottomView cancel={cancel} determine={determine} />}
      </View>
    </ScrollView>
  );
};

export const payShow = (callBack?: (v: boolean) => void) => {
  OverlayModal.show(<PayComponents callBack={callBack} />, {
    style: styles.style,
    modal: true,
    autoKeyboardInsets: isIos ? true : false,
    containerStyle: styles.containerStyle,
  });
};

const passwordShow = (callBack?: (v: boolean, password?: string) => void) => {
  OverlayModal.show(<PasswordComponents callBack={callBack} />, {
    style: styles.style,
    modal: true,
    autoKeyboardInsets: isIos ? true : false,
    containerStyle: styles.containerStyle,
  });
};

export default {
  payShow,
  passwordShow,
};
