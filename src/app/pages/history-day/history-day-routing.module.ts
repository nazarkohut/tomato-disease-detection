import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HistoryDayPage } from './history-day.page';

const routes: Routes = [
  {
    path: '',
    component: HistoryDayPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistoryDayPageRoutingModule {}
