import {Component, OnInit} from '@angular/core';
import {HeaderService} from "../../services/header/header.service";
import {WikiPage} from "../../pages/wiki/wiki.page";

@Component({
  selector: 'app-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.scss'],
})
export class HeaderMenuComponent implements OnInit{
  pageTitle: string = '';

  constructor(private headerService: HeaderService) { }

  ngOnInit() {
    this.headerService.getPageTitle().subscribe(title => {
      this.pageTitle = title;
    });
  }
}
