import crashlytics from '@react-native-firebase/crashlytics';
import { View, Button, Text } from 'react-native';
import React from 'react';
import { styles } from './Test.style';

export const PerfTest = () => {
  const crash = async () => {
    crashlytics().crash();
  };

  return (
    <View style={styles.sectionContainer}>
      <View>
        <Text>perf</Text>
        <View>
          <Button title="crash" onPress={() => crash()} />
        </View>
      </View>
    </View>
  );
};
