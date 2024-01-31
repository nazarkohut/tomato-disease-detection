import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PredictionResultPageRoutingModule } from './prediction-result-routing.module';

import { PredictionResultPage } from './prediction-result.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PredictionResultPageRoutingModule
  ],
  declarations: [PredictionResultPage]
})
export class PredictionResultPageModule {}
