import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [MatProgressSpinner],
  templateUrl: './spinner.html',
  styleUrls: ['./spinner.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Spinner {}
