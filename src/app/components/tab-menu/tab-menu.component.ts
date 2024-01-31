import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {PhotoService} from "../../services/photo/photo.service";
import {ActionSheetController} from "@ionic/angular";

@Component({
  selector: 'app-tab-menu',
  templateUrl: './tab-menu.component.html',
  styleUrls: ['./tab-menu.component.scss'],
})
export class TabMenuComponent {

  constructor(private route: Router, private photoService: PhotoService) { }

  goToPage(page_url: string): void{
    this.route.navigate([page_url]);
  }

  async addPhotoToGallery() {
    await this.photoService.addNewToGallery();
  }

}
