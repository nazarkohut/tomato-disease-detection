import {Component, OnInit} from '@angular/core';
import {PhotoService} from "../../services/photo/photo.service";
import {Storage} from '@ionic/storage-angular';
import {DatesService} from "../../services/dates/dates.service";
import {Router} from "@angular/router";
import {HeaderService} from "../../services/header/header.service";

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage {

  constructor(
    public photoService: PhotoService,
    private storage: Storage,
    public dateService: DatesService,
    public router: Router,
    private headerService: HeaderService) {
  }

  // ionViewWillEnter() {
  //   this.photoService.loadSavedPredictionsDays();
  // }

  ionViewDidEnter() {
    this.photoService.loadSavedPredictionsDays();
    this.headerService.setPageTitle('History');
  }



  goToPage(page_url: string): void {
    this.router.navigate([page_url]);
  }

  protected readonly Number = Number;
}
