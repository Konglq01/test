import React, { useState } from 'react';

import { useAppSelector, useAppDispatch } from 'store/hooks';
import { decrement, increment, incrementByAmount, incrementAsync, incrementIfOdd } from '../../store/counter/slice';
import { View } from 'react-native';
import { Button, Input, Text } from '@rneui/base';
import { useGetBlockByHeightQuery } from 'store/testApi/slice';

export function Counter() {
  const { value: count, status } = useAppSelector(state => state.counter);
  console.log(status, '=====status');

  const dispatch = useAppDispatch();
  const [incrementAmount, setIncrementAmount] = useState('2');

  const incrementValue = Number(incrementAmount) || 0;
  const { data, error, isLoading } = useGetBlockByHeightQuery('114206708');
  console.log({ data, error, isLoading }, '={ isLoading, isError, data, currentData }');

  return (
    <View>
      <View>
        <Button onPress={() => dispatch(decrement())}>-</Button>
        <Text>{count}</Text>
        <Button onPress={() => dispatch(increment())}>+</Button>
      </View>
      <View>
        <Input value={incrementAmount} onChangeText={setIncrementAmount} />
        <Button onPress={() => dispatch(incrementByAmount(incrementValue))}>Add Amount</Button>
        <Button onPress={() => dispatch(incrementAsync(incrementValue))}>Add Async</Button>
        <Button onPress={() => dispatch(incrementIfOdd(incrementValue))}>Add If Odd</Button>
      </View>
    </View>
  );
}
