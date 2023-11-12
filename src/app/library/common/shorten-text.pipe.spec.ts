import { ShortenTextPipe } from './shorten-text.pipe';

describe('ShortenTextPipe', () => {
  let pipe: ShortenTextPipe;
  beforeEach(() => {
    pipe = new ShortenTextPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should shorten long text', () => {
    expect(pipe.transform('123456789', 6)).toEqual('123...');
  });

  it('should shorten number', () => {
    expect(pipe.transform(123456, 4)).toBe('####');
  });

  it('should not shorten number', () => {
    expect(pipe.transform(123456, 6)).toBe(123456);
  });

  it('should not change other objects', () => {
    expect(pipe.transform({})).toEqual({});
  });

  it('should not change short text', () => {
    expect(pipe.transform('123456789     ', 10)).toEqual('123456789');
  });

  it('should not change 3 symbols', () => {
    expect(pipe.transform('123   ', 3)).toBe('123');
  });

  it('invalid length should return empty string', () => {
    expect(pipe.transform('123', -1)).toBe('');
  });

  it('default length should be 100 symbols', () => {
    const sym = 'x';
    expect(pipe.transform(sym.repeat(110))).toEqual(sym.repeat(97) + '...');
  });

  it('should shorten to 1 symbol', () => {
    expect(pipe.transform('1234', 1)).toBe('.');
  });
  it('should shorten to 2 symbols', () => {
    expect(pipe.transform('1234', 2)).toBe('..');
  });
  it('should shorten to 3 symbols', () => {
    expect(pipe.transform('1234', 3)).toBe('...');
  });
});
