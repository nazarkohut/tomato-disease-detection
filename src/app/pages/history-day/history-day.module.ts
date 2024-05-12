import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistoryDayPageRoutingModule } from './history-day-routing.module';

import { HistoryDayPage } from './history-day.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HistoryDayPageRoutingModule
  ],
  declarations: [HistoryDayPage]
})
export class HistoryDayPageModule {}
