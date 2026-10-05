import { Component, computed, input } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { MatIconButton } from '@angular/material/button';
import { MatOption } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { isEqual } from 'lodash-es';
import { FileElement } from 'src/app/filesystem';
import { CustomerList } from 'src/app/interfaces';
import { ProductionStageModel } from '../production-stages-edit/production-stage-edit.model';

const folderNames = (elements: FileElement[]): { value: string[]; name: string }[] =>
  elements
    .filter((el) => el.isFolder)
    .map((el) => ({
      value: [...el.parent, el.name],
      name: [...el.parent, el.name].join('/'),
    }));

@Component({
  selector: 'app-drop-folders',
  templateUrl: './drop-folders.component.html',
  styleUrls: ['./drop-folders.component.scss'],
  imports: [MatIconButton, MatIcon, MatFormFieldModule, MatSelect, MatOption, FormField],
})
export class DropFoldersComponent {
  fieldTree = input.required<FieldTree<ProductionStageModel['dropFolders']>>();

  dropFolders = input.required<FileElement[]>();
  protected folderNames = computed(() => folderNames(this.dropFolders()));

  customers = input.required<CustomerList[]>();

  protected pathCompare: (o1: string[], o2: string[]) => boolean = isEqual;

  protected onCustomerSelection({ value, source }: MatSelectChange): void {
    if (Array.isArray(value) && value.includes('**')) {
      source.value = ['**'];
    }
  }

  append() {
    this.fieldTree()().value.update((value) => [...value, { path: [], customers: [] }]);
    this.fieldTree()().markAsDirty();
  }

  delete(idx: number) {
    this.fieldTree()().value.update((value) => value.filter((_, i) => i !== idx));
    this.fieldTree()().markAsDirty();
  }
}
