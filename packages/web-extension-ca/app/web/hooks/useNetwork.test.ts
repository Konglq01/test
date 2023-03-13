import { renderHook } from '@testing-library/react-hooks';
import { useIsTestnet } from './useNetwork';
import { useWalletInfo } from 'store/Provider/hooks';

jest.mock('store/Provider/hooks');

// TODO：Temporary solution mock useMemo，needs to be optimized
jest.mock('react', () => {
  return {
    ...jest.requireActual('react'),
    useMemo: jest.fn((fn: () => void) => {
      return fn();
    }),
  };
});

describe('useIsTestnet', () => {
  it('', () => {
    const { result } = renderHook(() => useIsTestnet());
    console.log('====', result);
  });
  it('should return true when current network is testnet', () => {
    jest.mocked(useWalletInfo).mockReturnValue({
      currentNetwork: 'TESTNET',
    } as any);

    const { result } = renderHook(() => useIsTestnet());
    expect(result?.current).toBe(true);
  });

  it('should return false when current network is not testnet', () => {
    jest.mocked(useWalletInfo).mockReturnValue({
      currentNetwork: 'MAINNET',
    } as any);

    const { result } = renderHook(() => useIsTestnet());
    expect(result.current).toBe(false);
  });
});
