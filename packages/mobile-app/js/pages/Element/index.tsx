import React from 'react';
import { Text, View } from 'react-native';
import { makeStyles, useThemeMode } from '@rneui/themed';
import { Button } from '@rneui/base';

type Params = {
  fullWidth?: boolean;
};

export default function Element(props: Params) {
  const styles = useStyles(props);
  const { mode, setMode } = useThemeMode();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{mode}</Text>
      <Button onPress={() => setMode(mode === 'dark' ? 'light' : 'dark')}>changeMode</Button>
    </View>
  );
}

const useStyles = makeStyles((theme, props: Params) => ({
  container: {
    background: theme.colors.white,
    width: props.fullWidth ? '100%' : 'auto',
  },
  text: {
    color: theme.colors.primaryLight,
  },
}));
