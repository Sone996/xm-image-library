import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-grid-wrapper',
  standalone: true,
  imports: [],
  templateUrl: './grid-wrapper.html',
  styleUrls: ['./grid-wrapper.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridWrapper {}
