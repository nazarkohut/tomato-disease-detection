import {Component, OnInit} from '@angular/core';
import {StorageService} from "./services/storage/storage.service";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{
  constructor(public storageService: StorageService) {}


  async ngOnInit(){
    await this.storageService.init();
  }
}
