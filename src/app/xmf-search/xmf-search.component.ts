import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable, combineLatest } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay, distinctUntilChanged, debounceTime, tap } from 'rxjs/operators';

interface FormValues {
  q: string;
}

@Component({
  selector: 'app-xmf-search',
  templateUrl: './xmf-search.component.html',
  styleUrls: ['./xmf-search.component.css']
})
export class XmfSearchComponent implements OnInit {

  searchForm = new FormGroup({
    q: new FormControl(''),
  });

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private breakpointObserver: BreakpointObserver,
  ) { }
  value$: Observable<string> = this.searchForm.valueChanges.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    map(params => <string>params.q),
    map(q => q.trim()),
    shareReplay(1),
  );
  isFacet$: Observable<boolean> = combineLatest(
    this.breakpointObserver.observe(Breakpoints.Handset),
    this.value$
  ).pipe(
    map(([handset, val]) => !handset.matches && val.length > 3)
  );
  ngOnInit() {
    this.value$.subscribe((q) => {
      if (q.length > 3) {
        this.router.navigate(['xmf-search', 's', { q }]);
      } else {
        this.router.navigate(['xmf-search']);
      }
    });

    const child = this.route.firstChild || null;
    if (child
      && child.snapshot.url[0].path === 's'
      && child.snapshot.paramMap.has('q')
      && child.snapshot.paramMap.get('q').length > 3) {
      const form: FormValues = {
        q: child.snapshot.paramMap.get('q'),
      };
      this.searchForm.setValue(form);
    }

  }

}
