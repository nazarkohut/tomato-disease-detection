import {Component, OnInit} from '@angular/core';
import {PhotoService} from "../../services/photo/photo.service";

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {

  constructor(public photoService: PhotoService) {
  }

  async ngOnInit() {
    await this.photoService.loadSaved();
    console.log(this.photoService.photos);
  }
}
