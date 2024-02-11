import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage-angular';
import CordovaSQLiteDriver from "localforage-cordovasqlitedriver";
import { Drivers } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  public _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    await this.storage.defineDriver(CordovaSQLiteDriver);
    this._storage = await this.storage.create();
    // this.storage.ready();
    // this._storage.ready();
    console.log("StorageService", this.storage.driver)
    console.log("StorageService private var", this._storage.driver)
    const currentTime = new Date();
    console.log('Current time:', currentTime);
    return this._storage;
  }

  public get(key: string) {
    return this._storage?.get(key);
  }

  public outputDriverInfo(){
    console.log("Storage driver info", this._storage?.driver);

  }

  // Create and expose methods that users of this service can
  // call, for example:
  public set(key: string, value: any) {
    this._storage?.set(key, value);
  }
}
