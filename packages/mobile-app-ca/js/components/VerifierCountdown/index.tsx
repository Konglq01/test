import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { TextM } from 'components/CommonText';
import Touchable from 'components/Touchable';
import useEffectOnce from 'hooks/useEffectOnce';
import React, { useCallback, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { StyleSheet, View } from 'react-native';
import { ViewStyleType } from 'types/styles';
export type VerifierCountdownInterface = {
  resetTime: (t: number) => void;
};
export type VerifierCountdownProps = {
  onResend?: () => void;
  style?: ViewStyleType;
};

const VerifierCountdown = forwardRef(({ style, onResend }: VerifierCountdownProps, ref) => {
  const [time, setTime] = useState<number>(0);
  const timer = useRef<NodeJS.Timer>();
  const startTimer = useCallback(() => {
    timer.current && clearInterval(timer.current);
    timer.current = setInterval(() => {
      setTime(t => {
        const newTime = t - 1;
        if (newTime <= 0) {
          timer.current && clearInterval(timer.current);
          timer.current = undefined;
          return 0;
        }
        return newTime;
      });
    }, 1000);
  }, []);
  useEffectOnce(() => {
    startTimer();
    return () => {
      timer.current && clearInterval(timer.current);
    };
  });
  const resetTime = useCallback(
    (t: number) => {
      setTime(t);
      startTimer();
    },
    [startTimer],
  );
  useImperativeHandle(ref, () => ({ resetTime }), [resetTime]);

  return (
    <View style={[GStyles.center, style]}>
      {time > 0 ? (
        <TextM style={styles.resendTip}>Resend in {time}s</TextM>
      ) : (
        <Touchable onPress={onResend}>
          <TextM style={styles.resendText}>Resend</TextM>
        </Touchable>
      )}
    </View>
  );
});
VerifierCountdown.displayName = 'VerifierCountdown';

export default VerifierCountdown;

const styles = StyleSheet.create({
  resendTip: {
    color: defaultColors.font7,
  },
  resendText: {
    color: defaultColors.font4,
  },
});
