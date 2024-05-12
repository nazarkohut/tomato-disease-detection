import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.scss'],
})
export class HeaderMenuComponent implements OnInit {
  pageTitle: string = '';
  // Variable to indicate whether to show the logo
  showLogo: boolean = false;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe(data => {
      // Perform actions when route data changes
      console.log('Route data changed:', data);
      this.pageTitle = data["title"];
      this.showLogo = data["showLogo"] as boolean;
    });

    this.activatedRoute.params.subscribe(params => {
      // Perform actions when route data changes
      console.log('Route data changed:', params);
      if (this.pageTitle === "History for ") {
        const year = params['year'];
        const month = params['month'];
        const day = params['day'];
        this.pageTitle += `${day}.${month}.${year}`
      }
    });
  }

  goToPage(page_url: string): void {
    this.router.navigate([page_url]);
  }
}
