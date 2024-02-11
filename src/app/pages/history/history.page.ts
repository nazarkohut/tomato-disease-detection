import {Component, OnInit} from '@angular/core';
import {PhotoService} from "../../services/photo/photo.service";
import { Storage } from '@ionic/storage-angular';
import CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import {Drivers} from "@ionic/storage";

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {

  async ngOnInit() {
    await this.initStorage();
  }

  async initStorage() {
    // Define the driver
    await this.storage.defineDriver(CordovaSQLiteDriver);
    // await this.storage.defineDriver(Drivers.IndexedDB);
    // Create the storage instance
    await this.storage.create();
    // Log the driver name
    console.log("HistoryPage", this.storage.driver);
  }

  // async ngOnInit() {
  //   await this.photoService.loadSaved();
  //   console.log(this.photoService.photos);
  // }

  constructor(public photoService: PhotoService, private storage: Storage) {
  }

  //
  // async ngOnInit() {
  //   await this.photoService.loadSaved();
  //   console.log(this.photoService.photos);
  //
  //   this.storage.defineDriver(CordovaSQLiteDriver);
  //   const storage = await this.storage.create();
  //   console.log("HistoryPage", storage.driver);
    // console.log("HistoryPage", storage.driver.);



    // const storage = await this.storage.create();
    // await storage.defineDriver(CordovaSQLiteDriver);
    // console.log("HistoryPage", storage.driver);

    // await this._storage.defineDriver(Drivers.LocalStorage);
  // }
}
