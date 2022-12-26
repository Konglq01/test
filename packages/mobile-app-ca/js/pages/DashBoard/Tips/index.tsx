import Svg from 'components/Svg';
import React, { Dispatch, SetStateAction } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

interface TipsPropsTypes {
  closed: boolean;
  setClosed: Dispatch<SetStateAction<boolean>>;
}
export default function Tips(props: TipsPropsTypes) {
  const { closed, setClosed } = props;

  if (closed) return null;

  return (
    <View style={styles.wrap}>
      <Text>These assets are only for testing -Funds are not real</Text>
      <TouchableOpacity onPress={() => setClosed(true)}>
        <Svg icon="close" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: 'white',
  },
});
