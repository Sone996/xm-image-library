import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { ActiveRoutesDirective } from '@xm/shared/directives';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, ActiveRoutesDirective, MatButtonModule],
  templateUrl: './app-header.html',
  styleUrls: ['./app-header.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppHeader {}
