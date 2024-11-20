import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FocusedDirective } from 'src/app/library/directives/focused.directive';
import { InputTrimDirective } from 'src/app/library/directives/input-trim.directive';

@Component({
    selector: 'app-search-input',
    templateUrl: './search-input.component.html',
    styleUrls: ['./search-input.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatFormFieldModule, MatInputModule, FocusedDirective, FormsModule, MatButtonModule, MatIconModule, InputTrimDirective]
})
export class SearchInputComponent {
  searchString = model('');
}
