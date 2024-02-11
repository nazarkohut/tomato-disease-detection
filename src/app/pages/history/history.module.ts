import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistoryPageRoutingModule } from './history-routing.module';

import { HistoryPage } from './history.page';
import {IonicStorageModule} from "@ionic/storage-angular";
import CordovaSQLiteDriver from "localforage-cordovasqlitedriver";
import {Drivers} from "@ionic/storage";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HistoryPageRoutingModule,
    IonicStorageModule.forRoot({
      driverOrder: [CordovaSQLiteDriver._driver, Drivers.IndexedDB]
    })
  ],
  declarations: [HistoryPage]
})
export class HistoryPageModule  {

}


