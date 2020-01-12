import { HideZeroPipe } from './hide-zero.pipe';

describe('HideZeroPipe', () => {
  it('create an instance', () => {
    const pipe = new HideZeroPipe();
    expect(pipe).toBeTruthy();
  });
});
