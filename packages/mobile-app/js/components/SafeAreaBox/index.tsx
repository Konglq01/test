import React from 'react';
import { SafeAreaView, SafeAreaViewProps } from 'react-native-safe-area-context';
import styles from './styles';

export type SafeAreaBoxProps = SafeAreaViewProps;
export default function SafeAreaBox(props: SafeAreaBoxProps) {
  return <SafeAreaView {...props} style={[styles.pageWrap, props.style]} />;
}
