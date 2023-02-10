import CommonSlice, { setIsPrompt } from './slice';

const reducer = CommonSlice.reducer;

describe('common', () => {
  test('prev isPrompt false, set isPrompt true', () => {
    expect(reducer({ isPrompt: false }, setIsPrompt(false))).toEqual({ isPrompt: false });
  });
  test('prev isPrompt false, set isPrompt false', () => {
    expect(reducer({ isPrompt: false }, setIsPrompt(true))).toEqual({ isPrompt: true });
  });
});
