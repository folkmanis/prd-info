import { HideZeroPipe } from './hide-zero.pipe';

describe('HideZeroPipe', () => {
  let pipe: HideZeroPipe;
  beforeEach(() => {
    pipe = new HideZeroPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('hides 0 number', () => {
    expect(pipe.transform(0)).toBe('');
  });

  it('hides 0 string', () => {
    expect(pipe.transform('0')).toBe('');
  });

  it('not modiefies other object', () => {
    expect(pipe.transform(false)).toBe(false);
    expect(pipe.transform({})).toEqual({});
  });
});
