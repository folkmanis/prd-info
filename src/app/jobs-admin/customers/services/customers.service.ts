import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpOptions } from "src/app/library/http/http-options";
import { Observable, combineLatest } from 'rxjs';
import { map, pluck } from 'rxjs/operators';

@Injectable()
export class CustomersService {
private httpPath = '/data/customers/'
  constructor(
    private http: HttpClient,
  ) { }
}
