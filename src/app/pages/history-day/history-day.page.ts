import { Component, OnInit } from '@angular/core';
import {PhotoService} from "../../services/photo/photo.service";
import {ActivatedRoute, Router} from "@angular/router";
import {DatabaseService} from "../../services/database/database.service";
import {DatesService} from "../../services/dates/dates.service";

@Component({
  selector: 'app-history-day',
  templateUrl: './history-day.page.html',
  styleUrls: ['./history-day.page.scss'],
})
export class HistoryDayPage implements OnInit {
  public year: string = '';
  public month: string = '';
  public day: string = '';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public databaseService: DatabaseService,
    public datesService: DatesService,
    public photoService: PhotoService,
  ) { }

  goToPage(page_url: string): void {
    this.router.navigate([page_url]);
  }

  ngOnInit() {
    // Retrieving parameters from the route
    this.activatedRoute.paramMap.subscribe(params => {
      this.year = params.get('year')!;
      this.month = params.get('month')!;
      this.day = params.get('day')!;

      // Now you can use these parameters as needed
      this.photoService.loadPredictionByDay(this.year, this.month, this.day);

    });
  }

}
