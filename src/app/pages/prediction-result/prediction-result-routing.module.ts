import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PredictionResultPage } from './prediction-result.page';

const routes: Routes = [
  {
    path: '',
    component: PredictionResultPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PredictionResultPageRoutingModule {}
