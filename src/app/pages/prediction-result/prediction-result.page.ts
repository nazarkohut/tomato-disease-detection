import { Component, OnInit } from '@angular/core';
import {PhotoService} from "../../services/photo/photo.service";
import {cameraImageConfig} from "../../utils/constants";
import {Yolov8OnnxService} from "../../services/yolov8/yolov8-onnx.service";
import {NavigationExtras, Router} from "@angular/router";

@Component({
  selector: 'app-prediction-result',
  templateUrl: './prediction-result.page.html',
  styleUrls: ['./prediction-result.page.scss'],
})
export class PredictionResultPage {
  goToPage(page_url: string): void {
    this.route.navigate([page_url]);
  }

  public actionSheetButtons = [
    {
      text: 'Take a picture',
      icon: "camera",
      handler: () => {
        this.runInferenceOnCameraPhoto();
      }
    },
    {
      text: 'Upload from file system',
      icon: "folder-open-outline"
    },
    {
      text: 'Cancel',
      role: 'cancel',
      data: {
        action: 'cancel',
      },
    },
  ];
  constructor(private route: Router, public photoService: PhotoService, public YOLOv8Service: Yolov8OnnxService) { }

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


        const red: number[] = [], green: number[] = [], blue: number[] = []; // TODO: this one works, but why and need to check if the output is the same is in the dataset
        for (let index = 0; index < imageData.data.length; index += 4) {
          red.push(imageData.data[index] / 255.0);
          green.push(imageData.data[index + 1] / 255.0); // TODO: why do we need to normalize, why red, green, blue are in strange structure
          blue.push(imageData.data[index + 2] / 255.0); // TODO: add text with confidence and detected decease, also file name should be: 2 Healthy, 3 Late Blight and date -?
        }
        const input = [...red, ...green, ...blue];
        resolve(input);
      };
    });
  }
  async runInferenceOnCameraPhoto() {
    console.log("Executing: runInferenceOnCameraPhoto");
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
    // Draw bounding boxes on the image
    // this.drawBoundingBoxes(imageBase64, output);
    console.log("Going into createVisualizedImage...");

    const visualizedBase64 = await this.photoService.createVisualizedImage(imageBase64, output, imageWidth, imageHeight);
    this.goToPage("particular-prediction-result") // visualizedBase64);
    // await this.photoService.savePhoto(inferencePhoto);
  }
}
