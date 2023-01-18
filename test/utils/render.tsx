import React, { PropsWithChildren } from 'react';
import { render, renderHook } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import type { Store } from 'redux';

/**
 * render components with provider wrapper
 */
export function renderWithProvider(ui: React.ReactElement, store: Store, renderOptions?: RenderOptions) {
  function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
    return <Provider store={store}>{children}</Provider>;
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

/**
 * render hook with provider wrapper
 */
export function renderHookWithProvider(fn: Function, store: Store, initialProps?: RenderOptions) {
  function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
    return <Provider store={store}>{children}</Provider>;
  }
  return renderHook(() => fn(), { wrapper: Wrapper, initialProps });
}

/**
 * render components with router wrapper
 */
export function renderWithRouter(ui: React.ReactElement) {
  return render(ui, { wrapper: BrowserRouter });
}
