import { FilesizePipe } from './filesize.pipe';

describe('FilesizePipe', () => {
  let pipe: FilesizePipe;

  beforeEach(() => {
    pipe = new FilesizePipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('supports', () => {
    it('should support number', () => {
      expect(() => pipe.transform(123)).not.toThrow();
    });
    it('should support string', () => {
      expect(() => pipe.transform('123' as unknown as number)).not.toThrow();
    });

    it('should parse with default settings', () => {
      expect(pipe.transform(1024)).toBe('1.02 kB');
    });

    it('should parse with options', () => {
      expect(pipe.transform(265318, { locale: 'lv' })).toMatch(/,/);
    });

    it('should return null if not number', () => {
      expect(pipe.transform({} as number)).toBeNull();
    });
  });
});
