import {Component, OnInit} from '@angular/core';
import {PhotoService} from "../../services/photo/photo.service";
import {Storage} from '@ionic/storage-angular';
import {DatesService} from "../../services/dates/dates.service";
import {ActivatedRoute, Router} from "@angular/router";
import {HeaderService} from "../../services/header/header.service";

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {

  constructor(
    public photoService: PhotoService,
    private storage: Storage,
    public dateService: DatesService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private headerService: HeaderService) {
  }

  // ionViewWillEnter() {
  //   this.photoService.loadSavedPredictionsDays();
  //   // this.headerService.setPageTitle('History(will enter)');
  // }

  ngOnInit() {
    this.activatedRoute.data.subscribe((val) => {
      this.photoService.loadSavedPredictionsDays();
    });
  }

  // ionViewDidEnter() {
  //   this.photoService.loadSavedPredictionsDays();
  //   this.headerService.setPageTitle('History');
  // }



  goToPage(page_url: string): void {
    this.router.navigate([page_url]);
  }

  protected readonly Number = Number;
}
