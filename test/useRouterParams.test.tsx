import { renderHook } from '@testing-library/react';
import '@testing-library/jest-dom';
import useRouterParams from '../packages/hooks/useRouterParams';

jest.mock('@react-navigation/native', () => {
  return {
    useRoute: jest.fn(() => {
      return { params: 'urlQueryTest' };
    }),
  };
});

test('useRouterParams', async () => {
  const { result } = renderHook(() => useRouterParams());
  expect(result.current).toBe('urlQueryTest');
});
