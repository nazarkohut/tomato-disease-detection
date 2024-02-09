import {Component, ViewChild, ElementRef} from '@angular/core';
import {Router} from '@angular/router';
import {PhotoService} from "../../services/photo/photo.service";

import {Yolov8OnnxService} from "../../services/yolov8/yolov8-onnx.service";
import {cameraImageConfig} from "../../utils/constants";

@Component({
  selector: 'app-tab-menu',
  templateUrl: './tab-menu.component.html',
  styleUrls: ['./tab-menu.component.scss'],
})
export class TabMenuComponent {
  constructor(private route: Router) {
  }

  goToPage(page_url: string): void {
    this.route.navigate([page_url]);
  }
}
