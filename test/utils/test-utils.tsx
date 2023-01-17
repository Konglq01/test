import React, { PropsWithChildren } from 'react';
import { render, renderHook } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';

import type { Store } from 'redux';

export function renderWithProviders(ui: React.ReactElement, store: Store, renderOptions?: RenderOptions) {
  function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
    return <Provider store={store}>{children}</Provider>;
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

export function renderHookWithProviders(fn: Function, store: Store, initialProps?: RenderOptions) {
  function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
    return <Provider store={store}>{children}</Provider>;
  }
  return renderHook(() => fn(), { wrapper: Wrapper, initialProps });
}
