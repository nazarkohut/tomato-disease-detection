import { Injectable } from '@angular/core';
import {DatabaseService, DatabaseWikiInfo} from "../database.service";

@Injectable({
  providedIn: 'root'
})
export class WikiService {
  public wikiRecords: DatabaseWikiInfo[] = [];

  constructor(private databaseService: DatabaseService) { }



  async loadWiki(){
    await this.databaseService.loadWiki();

    this.wikiRecords = this.databaseService.getWikiRecords();
    console.log("These wiki records: ", this.wikiRecords)
  }

  // async loadParticularWiki(id: number){
  //   await this.databaseService.loadParticularWiki(id);
  //
  //   this.wikiRecords = this.databaseService.getParticularWikiRecord();
  //   console.log("These wiki records: ", this.wikiRecords)
  // }
}
