import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ParticularPredictionResultPage } from './particular-prediction-result.page';

const routes: Routes = [
  {
    path: '',
    component: ParticularPredictionResultPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParticularPredictionResultPageRoutingModule {}
