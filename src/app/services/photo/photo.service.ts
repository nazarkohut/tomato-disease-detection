import {Injectable} from '@angular/core';
import {Camera, CameraResultType, CameraSource, Photo} from '@capacitor/camera';

import {Directory, Filesystem} from '@capacitor/filesystem';
import {Preferences} from '@capacitor/preferences';
import {Capacitor} from "@capacitor/core";
import { Storage } from '@ionic/storage-angular';
import CordovaSQLiteDriver from "localforage-cordovasqlitedriver";
import {StorageService} from "../storage/storage.service";

export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}

enum Month {
  January = 1,
  February = 2,
  March = 3,
  April = 4,
  May = 5,
  June = 6,
  July = 7,
  August = 8,
  September = 9,
  October = 10,
  November = 11,
  December = 12
}

@Injectable({
  providedIn: 'root'
})
export class PhotoService {


  public photos: any[] = []; // TODO: set type
  private PHOTO_STORAGE: string = 'predicted-diseases-photos';

  constructor(private storage: StorageService) {
    this.storage.init()
    const currentTime = new Date();
    console.log('Current time:', currentTime);
    this.storage.outputDriverInfo();
  }
  //
  // async init() {
  //   await this.storage.defineDriver();
  //   this.storage = await this.storage.create();
  // }

  private async readAsBase64(photo: Photo) {
    const file = await Filesystem.readFile({
      path: photo.path!
    });
    return file.data;
  }

  private async savePicture(photo: Photo | string, fileName: string, predictionTime: string, predictionTimeReadable: string) {
    // Convert photo to base64 format, required by Filesystem API to save
    let base64Data;
    if (typeof photo !== 'string'){
      base64Data = await this.readAsBase64(photo);
    } else {
      base64Data = photo
    }

    // Write the file to the data directory
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Documents
    });


    // Display the new image by rewriting the 'file://' path to HTTP
    // Details: https://ionicframework.com/docs/building/webview#file-protocol
    return {
      filepath: savedFile.uri,
      webviewPath: Capacitor.convertFileSrc(savedFile.uri),
      fileName: fileName,
      predictionTime: predictionTime,
      predictionTimeReadable: predictionTimeReadable,
    };
  }

  monthToString(month: number): string {
    return Month[month];
  }

  formatTime(time: string[], stringFormat: string = "fileName"): string {
    const [year, month, day, hours, minutes, seconds] = time;
    if (stringFormat === "human_readable") {
      const monthString = this.monthToString(Number(month));
      return `${day} of ${monthString}, ${year}; ${hours}:${minutes}:${seconds}`
    }
    return `${year}_${month}_${day}_${hours}_${minutes}_${seconds}`;
  }

  getCurrentTime(): string[] {
    const date = new Date();

    // Format the date components separately
    const year = date.getFullYear().toString(); // TODO: consider moving all of this somewhere
    const monthNumber = (date.getMonth() + 1)
    const month = monthNumber.toString().padStart(2, '0'); // Months are zero-based
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return [year, month, day, hours, minutes, seconds];
  }

  generateFileName(diseaseNames: string, predictionTime: string): string {
    return `${diseaseNames}_${predictionTime}`;
  }

  public async getPhotoFromCamera(quality: number, width: number, height: number) {
    return await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: quality,
      width: width,
      height: height
    });
  }

  public async getPhotoFromFileSystem(quality: number, width: number, height: number) {
    return await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos,
      quality: quality,
      width: width,
      height: height
    });
  }

  public async savePhoto(inferencePhoto: string | Photo, diseaseNames: string, predictionTime: string, predictionTimeReadable: string){
    const savedImageFile = await this.savePicture(inferencePhoto, `${this.generateFileName(diseaseNames, predictionTime)}.jpeg`, predictionTime, predictionTimeReadable);

    this.photos.unshift(savedImageFile);

    // await Preferences.set({
    //   key: this.PHOTO_STORAGE,
    //   value: JSON.stringify(this.photos),
    // });

    await this.storage.set(this.PHOTO_STORAGE, JSON.stringify(this.photos));
    return savedImageFile;
  }

  public async loadSaved() {
    // Retrieve cached photo array data
    // const { value } = await Preferences.get({ key: this.PHOTO_STORAGE });
    // this.photos = (value ? JSON.parse(value) : []);
    // const { value } = this.storage.get(this.PHOTO_STORAGE);
    // this.photos = (photoData ? JSON.parse(photoData) : []);
    // });

    const value = await this.storage.get(this.PHOTO_STORAGE);
    this.photos = value ? JSON.parse(value) : [];
    console.dir("this.photos: ", this.photos);
  }


  async createVisualizedImage(base64Image: string, boundingBoxes: number[][], imageWidth: number, imageHeight: number): Promise<string> {
    console.log("Init canvas...");
    const canvas = document.createElement('canvas');
    canvas.width = imageWidth;
    canvas.height = imageHeight;
    console.log("Init context...");
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }

    console.log("Before promise");
    // Draw the base image
    const image = new Image();
    image.src = base64Image;
    await new Promise<void>(resolve => {
      image.onload = () => {
        ctx.drawImage(image, 0, 0, imageWidth, imageHeight);

        // Draw bounding boxes and labels
        ctx.strokeStyle = '#ff0000';
        ctx.fillStyle = '#ce0000';
        ctx.lineWidth = 2;
        ctx.font = '16px Arial';
        for (const box of boundingBoxes) {
          const [x1, y1, x2, y2, diseaseName, confidenceLevel] = box;
          ctx.beginPath();
          ctx.rect(x1, y1, x2 - x1, y2 - y1);
          ctx.stroke();
          // Write disease name and confidence level above the bounding box
          ctx.fillText(`${diseaseName}: ${confidenceLevel.toFixed(2)}`, x1, y1 - 5);
        }

        resolve();
      };
    });
    console.log("After promise");

    // Convert canvas to base64 data URL
    const visualizedBase64 = canvas.toDataURL('image/jpeg');
    console.log("2 - visualizedBase64: ", visualizedBase64);
    return visualizedBase64;
  }
}

