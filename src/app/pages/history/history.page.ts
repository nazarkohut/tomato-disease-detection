import {Component, OnInit} from '@angular/core';
import {PhotoService} from "../../services/photo/photo.service";
import {Storage} from '@ionic/storage-angular';
import {DatesService} from "../../services/dates/dates.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit{

  constructor(
    public photoService: PhotoService,
    private storage: Storage,
    public dateService: DatesService,
    public router: Router) {
  }

  // ionViewWillEnter() {
  //   // this.presentActionSheet();
  //   this.photoService.loadSavedPredictionsDays();
  // }

  ngOnInit() {
    // this.photoService.method();
    this.photoService.loadSavedPredictionsDays();
    // console.log(this.photoService.photos);
  }

  goToPage(page_url: string): void {
    this.router.navigate([page_url]);
  }

  protected readonly Number = Number;
}
