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
import {StorageService} from "./services/storage/storage.service";
import {HttpClientModule} from "@angular/common/http";

@NgModule({
  declarations: [AppComponent, TabMenuComponent, HeaderMenuComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    IonicStorageModule.forRoot({
      driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage]
    })
  ],
  providers: [{provide: RouteReuseStrategy, useClass: IonicRouteStrategy}, StorageService],
  bootstrap: [AppComponent],
})
export class AppModule {
}
