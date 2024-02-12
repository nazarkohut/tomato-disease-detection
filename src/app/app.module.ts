import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';

import {AppComponent} from './app.component';
import { Drivers, Storage } from '@ionic/storage';
import {AppRoutingModule} from './app-routing.module';
import {TabMenuComponent} from "./components/tab-menu/tab-menu.component";
import {HeaderMenuComponent} from "./components/header-menu/header-menu.component";
import {IonicStorageModule} from '@ionic/storage-angular';
import CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import {StorageService} from "./services/storage/storage.service";

@NgModule({
  declarations: [AppComponent, TabMenuComponent, HeaderMenuComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicStorageModule.forRoot({
      driverOrder: [CordovaSQLiteDriver._driver, Drivers.IndexedDB]
    })
  ],
  providers: [{provide: RouteReuseStrategy, useClass: IonicRouteStrategy}, StorageService],
  bootstrap: [AppComponent],
})
export class AppModule {
}
