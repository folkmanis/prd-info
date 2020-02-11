import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators, AsyncValidatorFn, AbstractControl, FormGroupDirective } from '@angular/forms';
import { UploadService } from './services/upload.service';
import { KastesPreferencesService } from '../services/kastes-preferences.service';
import { PasutijumiService } from '../services/pasutijumi.service';
import { map, tap } from 'rxjs/operators';
import { ErrorStateMatcher } from '@angular/material/core';
import { UploadTabulaComponent } from './upload-tabula/upload-tabula.component';
import { MatDialog } from '@angular/material/dialog';
import { EndDialogComponent } from './end-dialog/end-dialog.component';

class FormErrorMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | null): boolean {
    // const isSubmited = form && form.submitted;
    return !!(control && control.invalid); // && (control.dirty || control.touched || isSubmited));
  }
}

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  @ViewChild(UploadTabulaComponent) private uploadTabulaComponent: UploadTabulaComponent;

  private defaultText = 'Atlasīt csv failu';
  displayText: string = this.defaultText;
  fileLoaded = false; // Ielādēts fails
  boxGatavi = false; // Sagatavots sadalījums pa kastēm
  file: File;
  pasutijumsForm = new FormGroup({
    pasutijumsName: new FormControl('',
      [Validators.required],
      this.existPasutijumsName()
    ),
  }
  );
  formErrorMatcher = new FormErrorMatcher();

  constructor(
    private uploadService: UploadService,
    private kastesPreferencesService: KastesPreferencesService,
    private pasutijumiService: PasutijumiService,
    public dialog: MatDialog,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  onFileDrop(fileList: FileList) {
    this.clearFile();
    if (fileList.length > 1) {
      this.displayText = 'Tikai vienu failu!';
      return;
    }
    if (fileList[0].size > 20 * 1024) {
      this.displayText = 'Maksimālais faila izmērs 20kb';
      this.clearFile();
      return;
    }
    if (fileList.length === 1 && fileList[0].name.endsWith('.csv')) { // max faila izmērs 20k
      this.file = fileList[0];
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        this.uploadService.loadCsv(fileReader.result.toString(), ';');
        this.pasutijumsForm.patchValue({ pasutijumsName: this.file.name.slice(0, -4).trim() });
        this.fileLoaded = true;
        this.displayText = 'Augšupielādei sagatavots fails:';
      };
      fileReader.readAsText(this.file);
    }
  }

  clearFile() {
    this.displayText = this.defaultText;
    this.file = null;
    this.fileLoaded = false;
    this.boxGatavi = false;
  }

  existPasutijumsName(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      return this.pasutijumiService.ofPasutijumi.pipe(
        map((pas) =>
          pas.find((el) => el.name === control.value) ? { existPasutijumsName: { value: control.value } } : null
        ),
      );
    };
  }

  onSubmitAll() {
    this.uploadService.savePasutijums(this.pasutijumsForm.get('pasutijumsName').value)
      .subscribe((resp) => {
        this.finalDialog(resp.affectedRows);
      });
  }

  finalDialog(affectedRows: number): void {
    const dialogRef = this.dialog.open(EndDialogComponent, { width: '400px', disableClose: true, data: { rows: affectedRows } });

    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['kastes', 'selector', 0]);
    });
  }
}
