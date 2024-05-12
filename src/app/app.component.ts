import {Component, OnInit} from '@angular/core';
import {StorageService} from "./services/storage/storage.service";
import {DatabaseService} from "./services/database/database.service";
import {SplashScreen} from "@capacitor/splash-screen";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{
  constructor(public storageService: StorageService, public databaseService: DatabaseService) {}


  async ngOnInit(){
    await this.storageService.init();
    await this.databaseService.initializePlugin();
    await SplashScreen.hide();
  }
}
