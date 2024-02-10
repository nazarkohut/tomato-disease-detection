import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router, RouterStateSnapshot} from "@angular/router";

@Component({
  selector: 'app-particular-prediction-result',
  templateUrl: './particular-prediction-result.page.html',
  styleUrls: ['./particular-prediction-result.page.scss'],
})
export class ParticularPredictionResultPage {
  public imagePath: string = "";
  public titleDiseaseNames: string = "";
  public predictionTime: string = "";


  constructor(private router: Router, private route: ActivatedRoute) {
    this.route.params.subscribe(data => {
      console.log(this.router.getCurrentNavigation()?.extras)

      const extras = this.router.getCurrentNavigation()?.extras
      this.imagePath = extras?.state!["imagePath"];
      this.titleDiseaseNames = extras?.state!["titleDiseaseNames"];
      this.predictionTime = extras?.state!["predictionTime"];
      console.log("this.imagePath", this.imagePath);
    });
  }
}
