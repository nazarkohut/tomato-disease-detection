import { Injectable } from '@angular/core';
import {cameraImageConfig} from "../../utils/constants";
import {NavigationExtras, Router} from "@angular/router";
import {PhotoService} from "../photo/photo.service";
import {Yolov8OnnxService} from "../yolov8/yolov8-onnx.service";

@Injectable({
  providedIn: 'root'
})
export class InferenceService {
  goToPage(page_url: string, predictionResult: string, titleDiseaseNames: string, predictionTime: string): void {
    const navigationExtras: NavigationExtras = {
      state: {
        imagePath: predictionResult,
        titleDiseaseNames: titleDiseaseNames,
        predictionTime: predictionTime,
      },
    };
    this.route.navigate([page_url], navigationExtras);
  }
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
          blue.push(imageData.data[index + 2] / 255.0); // TODO: add text with confidence and detected disease, also file name should be: 2 Healthy, 3 Late Blight and date -?
        }
        const input = [...red, ...green, ...blue];
        resolve(input);
      };
    });
  }

  countLabels(predictionResult: any[][]): {[label: string]: number} {
    const counts: {[label: string]: number} = {};

    // Iterate over each sublist in the big list
    for (const sublist of predictionResult) {
      // Extract the label from each sublist
      const label = sublist[4];

      // If the label exists, increment its count in the counts array
      if (label !== undefined) {
        counts[label] = (counts[label] || 0) + 1;
      }
    }

    return counts;
  }

  createCountString(labelCounts: {[label: string]: number}, replaceWhitespaces: boolean = true, countDelimiter: string = '-', spaceDelimiter: string = '_'): string {
    const countStrings: string[] = [];

    // Iterate over each label and its count
    for (const [label, count] of Object.entries(labelCounts)) {
      if (replaceWhitespaces){
        const cleanedLabel = label.replace(/\s/g, '');
        countStrings.push(`${count}${countDelimiter}${cleanedLabel}`);
      } else {
        countStrings.push(`${count}${countDelimiter}${label}`);
      }
    }

    // Join the count strings with underscores
    return countStrings.join(spaceDelimiter);
  }

  async runInferenceOnCameraPhoto(getPhotoFrom: string = "camera") {
    console.log("Executing: runInferenceOnCameraPhoto");
    const imageHeight = cameraImageConfig["imageHeight"];
    const imageWidth = cameraImageConfig["imageWidth"];
    const quality = cameraImageConfig["quality"];

    let capturedPhoto;
    if (getPhotoFrom === "camera"){
      capturedPhoto = await this.photoService.getPhotoFromCamera(quality, imageWidth, imageHeight);
    } else {
      capturedPhoto =  await this.photoService.getPhotoFromFileSystem(quality, imageWidth, imageHeight);
    }

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
    console.log("Going into createVisualizedImage...");

    const visualizedBase64 = await this.photoService.createVisualizedImage(imageBase64, output, imageWidth, imageHeight);

    const predictedDiseasesCounts = this.countLabels(output);
    const fileDiseaseNames = this.createCountString(predictedDiseasesCounts);
    const titleDiseaseNames = this.createCountString(predictedDiseasesCounts, false, " ", " ");
    const currentTime = this.photoService.getCurrentTime();
    const humanFormatCurrentTime = this.photoService.formatTime(currentTime, "human_readable");
    const fileFormatCurrentTime = this.photoService.formatTime(currentTime, "file")
    console.log("diseaseNames: ", fileDiseaseNames);

    const savedPhotoFile = await this.photoService.savePhoto(visualizedBase64, fileDiseaseNames, fileFormatCurrentTime, humanFormatCurrentTime);

    this.goToPage("particular-prediction-result", savedPhotoFile.webviewPath, titleDiseaseNames, humanFormatCurrentTime);
  }
}
