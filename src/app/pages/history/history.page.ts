import {Component, OnInit} from '@angular/core';
import {PhotoService} from "../../services/photo/photo.service";
import {DatesService} from "../../services/dates/dates.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {

  constructor(
    public photoService: PhotoService,
    public dateService: DatesService,
    public router: Router,
    public activatedRoute: ActivatedRoute,) {
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe((val) => {
      this.photoService.loadSavedPredictionsDays();
    });
  }

  goToPage(page_url: string): void {
    this.router.navigate([page_url]);
  }

  protected readonly Number = Number;
}
