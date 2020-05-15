import { Injectable } from '@angular/core';
import { Parser } from '../classes/parser';

@Injectable()
export class ParserService {

  constructor() { }

  private readonly _parser = new Parser();

  parseCsv(csvString: string, delimiter: string): (string | number)[][] {
    return this._parser.parseCsv(csvString, delimiter);
  }

}
