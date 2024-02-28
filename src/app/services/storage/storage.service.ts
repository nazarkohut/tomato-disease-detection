import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage-angular';
// import CordovaSQLiteDriver from "localforage-cordovasqlitedriver";

@Injectable()
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {

  }

  async init() {
    // await this.storage.defineDriver(CordovaSQLiteDriver);
    this._storage = await this.storage.create();
  }

  public get(key: string) {
    return this._storage?.get(key) || [];
  }

  public getDriverName(){
    return this._storage?.driver || "";
  }

  // Create and expose methods that users of this service can
  // call, for example:
  public set(key: string, value: any) {
    this._storage?.set(key, value);
  }
}
