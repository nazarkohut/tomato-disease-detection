import { Component, OnInit } from '@angular/core';
import {PhotoService} from "../../services/photo/photo.service";

@Component({
  selector: 'app-prediction-result',
  templateUrl: './prediction-result.page.html',
  styleUrls: ['./prediction-result.page.scss'],
})
export class PredictionResultPage implements OnInit {

  constructor(public photoService: PhotoService) { }

  async ngOnInit() {
    await this.photoService.loadSaved();
  }
}
