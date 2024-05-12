import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {DatabaseService} from "../../services/database/database.service";
import {DatesService} from "../../services/dates/dates.service";

@Component({
  selector: 'app-particular-prediction-result',
  templateUrl: './particular-prediction-result.page.html',
  styleUrls: ['./particular-prediction-result.page.scss'],
})
export class ParticularPredictionResultPage implements OnInit {
  public imagePath: string = "";
  public titleDiseaseNames: string = "";
  public predictionTime: string = "";

  ngOnInit() {
    this.activatedRoute.params.subscribe(async params => {
      const predictionId = params['id']!;
      console.log("predictionId", predictionId)
      const predictionRecord = await this.databaseService.findPredictionById(predictionId);

      console.log("Prediction record", predictionRecord)
      if (predictionRecord !== null) {
        const date = this.datesService.timestampToDate(predictionRecord.predictionTime)

        console.log("Prediction record is not null: ", predictionRecord)
        this.imagePath = predictionRecord.webViewPath;
        this.titleDiseaseNames = predictionRecord.fileName;
        this.predictionTime = this.datesService.formatTime(date, "humanReadable");
      }
    });
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private databaseService: DatabaseService,
    private datesService: DatesService
  ) {

  }
}
