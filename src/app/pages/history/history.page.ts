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
  }

  reorderItems(event: any) {
    const draggedItem = this.photoService.photos.splice(event.detail.from, 1)[0];
    this.photoService.photos.splice(event.detail.to, 0, draggedItem);
    event.detail.complete();
  }
}
