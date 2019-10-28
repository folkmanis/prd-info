import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { map, distinctUntilChanged,  debounceTime } from 'rxjs/operators';

interface FormValues {
  q: string;
  zmg?: boolean;
}

@Component({
  selector: 'app-xmf-search',
  templateUrl: './xmf-search.component.html',
  styleUrls: ['./xmf-search.component.css']
})
export class XmfSearchComponent implements OnInit {

  searchForm = new FormGroup({
    q: new FormControl(''),
    zmg: new FormControl(true),
  });

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.searchForm.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(this.changeDetector),
      map((val) => {
        const params: FormValues = { q: val.q };
        if (val.zmg) {
          params.zmg = true;
        }
        return params;
      }),
    ).subscribe((params) => {
      if (params.q.length > 3) {
        this.router.navigate(['xmf-search', 's', params]);
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
        zmg: !!child.snapshot.paramMap.get('zmg'),
      };
      this.searchForm.setValue(form);
    }

    /*     setTimeout(() => {
          this.searchForm.setValue(
            { q: 'ottens', tikaiZemgus: false },
            { emitEvent: true });
        }, 1000); // Testēšanai!!! Noņemt!!!
     */    // setTimeout(() => { this.searchControl.setValue('ottenst', { emitEvent: true }); }, 1000); // Testēšanai!!! Noņemt!!!
  }

  private changeDetector = (x: FormValues, y: FormValues): boolean => {
    for (const k of Object.keys(x)) {
      if (x[k] !== y[k]) {
        return false;
      }
    }
    return true;
  }

}
