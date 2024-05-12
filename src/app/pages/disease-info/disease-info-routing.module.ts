import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';

import { DiseaseInfoPage } from './disease-info.page';

const routes: Routes = [
  {
    path: '',
    component: DiseaseInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DiseaseInfoPageRoutingModule {}
