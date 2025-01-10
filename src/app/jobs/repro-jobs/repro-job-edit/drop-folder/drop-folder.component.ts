import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { DropFolder } from 'src/app/interfaces';

@Component({
  selector: 'app-drop-folder',
  templateUrl: './drop-folder.component.html',
  styleUrls: ['./drop-folder.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCheckbox, FormsModule, MatFormFieldModule, MatSelectModule, MatOptionModule],
})
export class DropFolderComponent {
  folderActive = model.required<boolean>();

  folders = input.required<DropFolder[]>();

  folder = model.required<DropFolder | null>();

  enabled = input(true, { transform: booleanAttribute });
  disabled = computed(() => !this.enabled());

  compareFn: (o1: DropFolder, o2: DropFolder) => boolean = (o1, o2) => o1?.path.join('/') === o2?.path.join('/');
}
