import React, { useCallback } from 'react';
import { FlatList, StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
export interface IndexBarProps {
  data: string[];
  indexBarItemStyle?: ViewStyle;
  indexTestStyle?: TextStyle;
  onPress?: (index: number) => void;
}
export default function IndexBar({ data, indexBarItemStyle, indexTestStyle, onPress }: IndexBarProps) {
  const indexBarItem = useCallback(
    ({ item, index }: { item: string; index: number }) => {
      return (
        <TouchableOpacity
          delayPressIn={200}
          style={[styles.indexBarItemStyle, indexBarItemStyle]}
          onPressIn={() => onPress?.(index)}>
          <Text style={[styles.indexTestStyle, indexTestStyle]}>{item}</Text>
        </TouchableOpacity>
      );
    },
    [indexBarItemStyle, indexTestStyle, onPress],
  );
  return (
    <FlatList
      data={data}
      renderItem={indexBarItem}
      keyExtractor={(_: string, index: number) => index.toString()}
      initialNumToRender={data ? data.length : 10}
    />
  );
}

const styles = StyleSheet.create({
  indexTestStyle: {
    fontSize: 16,
    color: '#157EFB',
  },
  indexBarItemStyle: {
    width: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
