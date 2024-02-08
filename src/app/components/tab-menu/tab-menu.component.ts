import { Component} from '@angular/core';
import { Router } from '@angular/router';
import {PhotoService} from "../../services/photo/photo.service";

import {Yolov8OnnxService} from "../../services/yolov8/yolov8-onnx.service";
import {cameraImageConfig} from "../../utils/constants";

@Component({
  selector: 'app-tab-menu',
  templateUrl: './tab-menu.component.html',
  styleUrls: ['./tab-menu.component.scss'],
})
export class TabMenuComponent {

  constructor(private route: Router, private photoService: PhotoService, public YOLOv8Service: Yolov8OnnxService) { }

  goToPage(page_url: string): void{
    this.route.navigate([page_url]);
  }

  // TODO: move these converters into more appropriate folder and file
  private async downloadImageAsBase64(url: string): Promise<string> {
    const response = await fetch(url);
    const blob = await response.blob();
    return this.convertBlobToBase64(blob);
  }

  private async convertBlobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(blob);
    });
  }

  private convertImgToNumberArray(imgAsBase64: string, imageWidth: number, imageHeight: number): Promise<number[]> {
    const image = new Image();
    image.src = imgAsBase64;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Could not get context');
    }
    return new Promise((resolve) => {
      image.onload = function () {
        canvas.width = imageWidth;
        canvas.height = imageHeight;
        context.drawImage(image, 0, 0, imageWidth, imageHeight);
        const imageData = context.getImageData(0, 0, imageWidth, imageHeight);
        const dataArray: number[] = [];
        for (let i = 0; i < imageData.data.length; i += 4) {
          dataArray.push(imageData.data[i] / 255.0);
          dataArray.push(imageData.data[i + 1] / 255.0);
          dataArray.push(imageData.data[i + 2] / 255.0);
        }
        resolve(dataArray);
      };
    });
  }
  async addPhotoToGallery() {
    const imageHeight = cameraImageConfig["imageHeight"];
    const imageWidth = cameraImageConfig["imageWidth"];
    const quality = cameraImageConfig["quality"];

    const capturedPhoto = await this.photoService.getPhotoFromCamera(quality, imageWidth, imageHeight);
    console.log(capturedPhoto.base64String);
    console.log("DataUrl:", capturedPhoto.dataUrl);
    console.log(capturedPhoto.path);
    console.log(capturedPhoto.webPath);
    console.log(capturedPhoto.exif);

    const imageBase64 = await this.downloadImageAsBase64(capturedPhoto.webPath!);

    const capturedPhotoNumberArray = await this.convertImgToNumberArray(imageBase64, imageWidth, imageHeight);
    console.log("capturedPhotoNumberArray:", capturedPhotoNumberArray);
    // console.log(capturedPhotoNumberArray);
    const inferencePhoto = await this.YOLOv8Service.run_model(capturedPhotoNumberArray, imageWidth, imageHeight);
    console.log(inferencePhoto)

    const output = this.YOLOv8Service.process_output(inferencePhoto, imageWidth, imageHeight);
    console.log(output);
    // await this.photoService.savePhoto(inferencePhoto);
  }

}
