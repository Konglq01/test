import * as React from 'react';
import { Text } from '@rneui/base';
import SafeAreaBox from 'components/SafeAreaBox';

export default function Square() {
  return (
    <SafeAreaBox edges={['left', 'right', 'bottom']}>
      <Text>发现</Text>
    </SafeAreaBox>
  );
}
