import React from 'react';
import { StyleSheet, View } from 'react-native';

interface CommonSectionPropsType {
  headerTitle: string;
}

export function CommonSection(props: CommonSectionPropsType) {
  return (
    <>
      <View style={styles.header} />
    </>
  );
}

const styles = StyleSheet.create({
  header: {},
});
