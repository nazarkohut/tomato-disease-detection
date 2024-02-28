import {Component} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-tab-menu',
  templateUrl: './tab-menu.component.html',
  styleUrls: ['./tab-menu.component.scss'],
})
export class TabMenuComponent {
  constructor(private route: Router) {
  }
  goToPage(page_url: string): void {
    this.route.navigate([page_url]);
  }
}
