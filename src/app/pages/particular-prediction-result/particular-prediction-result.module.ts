import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ParticularPredictionResultPageRoutingModule } from './particular-prediction-result-routing.module';

import { ParticularPredictionResultPage } from './particular-prediction-result.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ParticularPredictionResultPageRoutingModule
  ],
  declarations: [ParticularPredictionResultPage]
})
export class ParticularPredictionResultPageModule {}
