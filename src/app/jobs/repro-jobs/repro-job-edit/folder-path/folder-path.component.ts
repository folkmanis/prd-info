import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-folder-path',
    templateUrl: './folder-path.component.html',
    styleUrls: ['./folder-path.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormsModule, MatIconModule, MatCheckboxModule, MatButtonModule]
})
export class FolderPathComponent {
  path = input('');

  updatePath = model(false);

  enabled = input(false, { transform: booleanAttribute });

  createFolder = output();

  disabled = computed(() => !this.enabled());
}
