export interface Range {
  start: number;
  end: number;
}
/**
 * Cache objekts.
 */
export class PagedCache<T> {
  private _cachedData: Array<T | undefined>;
  private _pageSize = 100;
  private _cachedPages = new Set<number>();
  /**
   * Konstruktors ar sākotnējiem iestatījumiem
   *
   * @param _length Kopējais objektu skaits. Sākotnēji var būt nepiepildīts
   * @param _fetchFunction Funkcija, kas iegūs datus. Atgriež datu Observable, kuram ir jāpabeidzas
   * @param firstPage Pirmā datu porcija, ja tāda ir. Jābūt tieši 100 objektiem (vienai lapai)
   */
  constructor(
    private _length: number,
    private _fetchFunction: (start: number, limit: number) => Promise<T[]>,
    firstPage?: T[],
  ) {
    this._cachedData = Array.from({ length: this._length });
    if (firstPage && (firstPage.length === this._pageSize || firstPage.length === this._length)) {
      this._cachedData.splice(0, this._pageSize, ...firstPage);
      this._cachedPages.add(0);
    }
  }

  async fetchRange(range: Range): Promise<Array<T | undefined>> {
    const startPage = this.getPageForIndex(range.start);
    const endPage = this.getPageForIndex(range.end);
    const fetch$: Promise<void>[] = [];
    for (let idx = startPage; idx <= endPage; idx++) {
      if (this._cachedPages.has(idx) === false) {
        fetch$.push(this.fetchPage(idx));
      }
    }
    await Promise.all(fetch$);
    return this._cachedData;
  }

  private async fetchPage(page: number) {
    this._cachedPages.add(page);
    const start = page * this._pageSize;
    const data = await this._fetchFunction(start, this._pageSize);
    this._cachedData.splice(start, data.length, ...data);
  }

  private getPageForIndex(idx: number): number {
    return Math.floor(idx / this._pageSize);
  }
}
